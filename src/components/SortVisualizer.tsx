import { SortRenderer } from '@/components/SortRenderer';
import { Utils } from '@/utils/utils';
import { SortStep } from '@/utils/sort';

type State = 'sorting' | 'stopping' | 'stopped';

export class SortVisualizer {
  private renderer: SortRenderer;

  private items: number[];

  private state: State = `stopped`;

  private itemCount: number;

  constructor(
    svgElement: SVGSVGElement,
    width: number,
    height: number,
    itemCount = 20,
    marginRatio = 0.1,
    barSpaceRatio = 0.5,
  ) {
    this.renderer = new SortRenderer(
      svgElement,
      width,
      height,
      itemCount,
      marginRatio,
      barSpaceRatio,
    );

    this.itemCount = itemCount;
  }

  private createSortedItems(): void {
    if (this.state === `sorting`) {
      this.items = Array.from(Array(this.itemCount)).map((e, i) => i + 1);
    }
  }

  private resetBars(): void {
    if (this.state === `sorting`) {
      this.renderer.createBars(this.items); // or update
    }
  }

  private shuffleItems(): void {
    if (this.state === `sorting`) {
      Utils.shuffleArray(this.items);
    }
  }

  private async updateBars(): Promise<void> {
    if (this.state === `sorting`) {
      await this.renderer.updateBars(this.items, {
        duration: 1000,
        delay: 1000,
      });
    }
  }

  private async startSort(sortMethod): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const sortStep of sortMethod(this.items)) {
      if (this.state !== `sorting`) {
        return;
      }

      if (sortStep.isDataUpdated) {
        // eslint-disable-next-line no-await-in-loop
        await this.renderer.updateBars(this.items, {
          duration: 500,
          highlight: sortStep.compared,
        });
      }

      // eslint-disable-next-line no-await-in-loop
      await this.renderer.updateBars(this.items, {
        duration: 100,
        highlight: sortStep.compared,
      });
    }
  }

  playCompletionAnimation(): void {
    if (this.state === `sorting`) {
      this.renderer.startCompletionAnimation(this.items);
    }
  }

  start(sortMethod: (items: number[]) => IterableIterator<SortStep>): void {
    (async () => {
      await this.stop();

      this.state = `sorting`;

      this.createSortedItems();
      this.resetBars();

      this.shuffleItems();
      await this.updateBars();

      await this.startSort(sortMethod);

      this.playCompletionAnimation();

      this.state = `stopped`;
      this.renderer.interrupt();
    })();
  }

  stop(): Promise<void> {
    if (this.state !== `sorting`) {
      return Promise.resolve();
    }

    this.state = `stopping`;

    return new Promise((resolve, reject) => {
      const wait = () => {
        if (this.state === `stopped`) {
          resolve(undefined);
        } else if (this.state === `sorting`) {
          reject();
        }

        setTimeout(wait, 100);
      };

      setTimeout(wait, 100);
    });
  }
}
