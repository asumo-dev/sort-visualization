export class Utils {
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static swap(items, i, j) {
    // eslint-disable-next-line no-param-reassign
    [items[i], items[j]] = [items[j], items[i]];
  }
}
