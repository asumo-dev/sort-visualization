import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { Utils } from '@/utils/utils';
import { SortStep } from '@/utils/sort';

class SortRenderer {
  private readonly svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  private readonly margin: number;

  private readonly barWidth: number;

  private readonly barSpace: number;

  private readonly maxBarHeight: number;

  private readonly heightGap: number;

  constructor(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number,
    itemCount = 20,
    marginRatio = 0.1,
    barSpaceRatio = 0.5,
  ) {
    this.svg = svg;
    this.margin = 400 * marginRatio;
    this.barWidth = (width - this.margin * 2) / itemCount / (1 + barSpaceRatio);
    this.barSpace = this.barWidth * barSpaceRatio;
    this.maxBarHeight = height - this.margin * 2;
    this.heightGap = this.maxBarHeight / itemCount;
  }

  createBars(items: number[]) {
    const colorScale = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain([items[0], items[items.length - 1]]);

    this.svg
      .selectAll(`.bar`)
      .data(items, (d: number) => d)
      .enter()
      .append(`rect`)
      .attr(`class`, `bar`)
      .attr(
        `x`,
        (d, i: number) => this.margin + i * (this.barWidth + this.barSpace),
      )
      .attr(`y`, (d) => this.margin + this.maxBarHeight - d * this.heightGap)
      .attr(`width`, this.barWidth)
      .attr(`height`, (d) => d * this.heightGap)
      .attr(`rx`, 4)
      .attr(`ry`, 4)
      .attr(`opacity`, 0.7)
      .attr(`fill`, (d) => colorScale(d));
  }

  updateBars(
    items: number[],
    options?: { delay?: number; duration?: number; highlight?: number[] },
  ) {
    const { delay, duration, highlight } = options;

    let transition = this.svg
      .selectAll(`.bar`)
      .data(items, (d: number) => d)
      .transition();

    if (highlight) {
      transition = transition
        .duration(100)
        .attr(`opacity`, (d, i) => (highlight.includes(i) ? 1 : 0.4))
        .transition();
    }

    if (delay) {
      transition = transition.delay(options.delay);
    }
    if (duration) {
      transition = transition.duration(options.duration);
    }

    return transition
      .ease(d3.easeElasticOut)
      .attr(
        `x`,
        (d, i: number) => this.margin + i * (this.barWidth + this.barSpace),
      )
      .end();
  }
}

type SortAnimationProps = {
  itemCount: number;
  sortMethod: (items: number[]) => IterableIterator<SortStep>;
};

const SortAnimation: React.FC<SortAnimationProps> = ({
  itemCount,
  sortMethod,
}) => {
  const ref = useRef<SVGSVGElement>();

  const width = 400;
  const height = 400;
  const marginRatio = 0.05;
  const barSpaceRatio = 0.5; // the ratio of space between bars to a bar width

  useEffect(() => {
    const svg = d3.select(ref.current);
    const renderer = new SortRenderer(
      svg,
      width,
      height,
      itemCount,
      marginRatio,
      barSpaceRatio,
    );
    const items = Array.from(Array(itemCount)).map((e, i) => i + 1);

    renderer.createBars(items);

    let unmounted = false;

    (async () => {
      Utils.shuffleArray(items);
      // shuffle animation
      await renderer.updateBars(items, {
        duration: 1000,
        delay: 1000,
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const sortStep of sortMethod(items)) {
        if (unmounted) return;

        if (sortStep.isDataUpdated) {
          // eslint-disable-next-line no-await-in-loop
          await renderer.updateBars(items, {
            duration: 250,
            highlight: sortStep.compared,
          });
        }

        // eslint-disable-next-line no-await-in-loop
        await renderer.updateBars(items, {
          duration: 100,
          highlight: sortStep.compared,
        });
      }
    })();

    return () => {
      unmounted = true;
      if (ref.current) {
        ref.current.innerHTML = ``;
      }
    };
  }, []);

  return <svg ref={ref} width={width} height={height} />;
};

export default SortAnimation;
