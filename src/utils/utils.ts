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

  static camelToTitleCase(text: string): string {
    return (
      text[0].toUpperCase() + text.substr(1).replace(/([a-z])([A-Z])/g, `$1 $2`)
    );
  }

  static kebabToCamelCase(text: string): string {
    return text.replace(/-(.)/g, (m, p1) => p1.toUpperCase());
  }

  static trimStart(text: string, trimText: string): string {
    return text.substr(0, trimText.length) === trimText
      ? text.slice(trimText.length)
      : text;
  }
}
