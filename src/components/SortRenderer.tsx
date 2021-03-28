import * as d3 from 'd3';

export class SortRenderer {
  private readonly svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  private readonly margin: number;

  private readonly barWidth: number;

  private readonly barSpace: number;

  private readonly maxBarHeight: number;

  private readonly heightGap: number;

  private readonly barX: (_, i: number) => number;

  private readonly barY: (d) => number;

  private readonly fontSize: number;

  constructor(
    svgElement: SVGSVGElement,
    width: number,
    height: number,
    itemCount = 20,
    marginRatio = 0.1,
    barSpaceRatio = 0.5,
  ) {
    this.svg = d3.select(svgElement);
    this.margin = 400 * marginRatio;
    this.barWidth = (width - this.margin * 2) / itemCount / (1 + barSpaceRatio);
    this.barSpace = this.barWidth * barSpaceRatio;
    this.maxBarHeight = height - this.margin * 2;
    this.heightGap = this.maxBarHeight / itemCount;

    this.fontSize = Math.min(this.margin, this.barWidth) - 3;

    this.barX = (_, i: number) =>
      this.margin + i * (this.barWidth + this.barSpace);
    this.barY = (d) => this.margin + this.maxBarHeight - d * this.heightGap;
  }

  createBars(items: number[]): void {
    const colorScale = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain([items[0], items[items.length - 1]]);

    const g = this.svg
      .selectAll(`.bar-group`)
      .data(items, (d: number) => d)
      .enter()
      .append(`g`)
      .attr(`class`, `bar-group`)
      .attr(
        `transform`,
        (d, i) => `translate(${this.barX(d, i)} ${this.barY(d)})`,
      );

    // bar
    g.append(`rect`)
      .attr(`class`, `bar`)
      .attr(`width`, this.barWidth)
      .attr(`height`, (d) => d * this.heightGap)
      .attr(
        `transform-origin`,
        (d) => `${this.barWidth / 2} ${d * this.heightGap}`,
      )
      .attr(`rx`, 4)
      .attr(`ry`, 4)
      .attr(`opacity`, 0.8)
      .attr(`fill`, (d) => colorScale(d));

    const textY = (d) => d * this.heightGap + this.fontSize / 2 + 4;

    // text of bar size
    g.append(`text`)
      .text((d) => d)
      .attr(`x`, this.barWidth / 2)
      .attr(`y`, textY)
      .attr(`fill`, `#555`)
      .attr(`font-size`, this.fontSize)
      .attr(`class`, `size-text`)
      .attr(`transform-origin`, (d) => `${this.barWidth / 2} ${textY(d)}`)
      .attr(`dominant-baseline`, `central`)
      .attr(`text-anchor`, `middle`);
  }

  updateBars(
    items: number[],
    options?: { delay?: number; duration?: number; highlight?: number[] },
  ): Promise<void> {
    const { delay, duration, highlight } = options;

    const g = this.svg.selectAll(`.bar-group`).data(items, (d: number) => d);

    return g
      .transition()
      .ease(d3.easeElasticOut)
      .attr(
        `transform`,
        (d, i) => `translate(${this.barX(d, i)} ${this.barY(d)})`,
      )
      .each(() => {
        if (highlight) {
          SortRenderer.highlightBars(g, highlight);
        }
      })
      .call((t2) => {
        if (delay) {
          t2.delay(options.delay);
        }
        if (duration) {
          t2.duration(options.duration);
        }
      })
      .end();
  }

  private static highlightBars(g, targets: number[]) {
    const isHighlight = (i) => targets.includes(i);

    g.select(`.bar`)
      .transition()
      .duration(100)
      .attr(`opacity`, (d, i) => (isHighlight(i) ? 0.8 : 0.4));

    g.select(`.size-text`)
      .transition()
      .duration(100)
      .attr(`opacity`, (d, i) => (isHighlight(i) ? 0.8 : 0.4))
      .attr(`transform`, (d, i) => `scale(${isHighlight(i) ? 1 : 0.8})`);
  }

  startCompletionAnimation(items: number[]): void {
    const duration = 1000 / items.length;
    const delayFunc = (d, i) => duration * i;

    this.svg
      .selectAll(`.bar`)
      .transition()
      .delay(delayFunc)
      .duration(200)
      .attr(`opacity`, 0.8)
      .attr(`transform`, `scale(${1 + this.margin / this.maxBarHeight})`)
      .transition()
      .duration(200)
      .attr(`transform`, `scale(1)`);

    this.svg
      .selectAll(`.size-text`)
      .transition()
      .delay(delayFunc)
      .duration(200)
      .attr(`opacity`, 1)
      .attr(`transform`, `scale(1)`);
  }

  interrupt(): void {
    this.svg.interrupt();
  }
}
