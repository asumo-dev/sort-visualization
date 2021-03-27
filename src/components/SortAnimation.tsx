import React, { useEffect, useRef } from 'react';
import { SortStep } from '@/utils/sort';
import { SortVisualizer } from './SortVisualizer';

type SortAnimationProps = {
  itemCount: number;
  sortMethod: (items: number[]) => IterableIterator<SortStep>;
};

const SortAnimation: React.FC<SortAnimationProps> = ({
  itemCount,
  sortMethod,
}) => {
  const ref = useRef<SVGSVGElement>();
  const visualizerRef = useRef<SortVisualizer | null>(null);

  const width = 400;
  const height = 400;
  const marginRatio = 0.05;
  const barSpaceRatio = 0.5; // the ratio of space between bars to a bar width

  useEffect(() => {
    visualizerRef.current = new SortVisualizer(
      ref.current,
      width,
      height,
      itemCount,
      marginRatio,
      barSpaceRatio,
    );

    return () => {
      visualizerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    visualizerRef.current?.start(sortMethod);
  }, [sortMethod]);

  return <svg ref={ref} width={width} height={height} />;
};

export default SortAnimation;
