import { Utils } from './utils';

export type SortStep = {
  isDataUpdated: boolean;
  swapped?: number[];
  compared?: number[];
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
            swapped: [j, j - 1],
            compared: [j, j - 1],
          };
        }

        yield {
          isDataUpdated: false,
          compared: [j, j - 1],
        };
      }
    }
  }

  static *cocktailSort(items: number[]): IterableIterator<SortStep> {
    let isSwapped: boolean;

    function* step(i) {
      if (items[i] > items[i + 1]) {
        Utils.swap(items, i, i + 1);
        isSwapped = true;

        yield {
          isDataUpdated: true,
          swapped: [i, i + 1],
          compared: [i, i + 1],
        };
      }

      yield {
        isDataUpdated: false,
        compared: [i, i + 1],
      };
    }

    do {
      isSwapped = false;

      for (let i = 0; i < items.length - 1; i += 1) {
        yield* step(i);
      }

      if (!isSwapped) {
        return;
      }

      for (let i = items.length - 2; i >= 0; i -= 1) {
        yield* step(i);
      }
    } while (isSwapped);
  }
}
