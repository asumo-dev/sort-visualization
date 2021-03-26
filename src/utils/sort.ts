import { Utils } from './utils';

export type SortStep = {
  isDataUpdated: boolean;
  swap?: number[];
};

export class Sort {
  static *bubbleSort(items: number[]): IterableIterator<SortStep> {
    for (let i = 0; i < items.length - 1; i += 1) {
      if (i === items.length - 1) {
        i = 0;
      }
      for (let j = 1; j < items.length - i + 1; j += 1) {
        if (items[j] < items[j - 1]) {
          Utils.swap(items, j, j - 1);

          yield {
            isDataUpdated: true,
            swap: [j, j - 1],
          };
        }

        yield {
          isDataUpdated: false,
        };
      }
    }
  }
}
