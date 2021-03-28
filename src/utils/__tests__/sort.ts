import { Sort } from '../sort';

test(`bubble sort`, () => {
  const items = [3, 1, 6, 4, 7, 2, 5, 8, 9, 0];
  const iterator = Sort.bubbleSort(items);

  Array.from(iterator);

  expect(items).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test(`cocktail sort`, () => {
  const items = [3, 1, 6, 4, 7, 2, 5, 8, 9, 0];
  const iterator = Sort.cocktailSort(items);

  Array.from(iterator);

  expect(items).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test(`gnome sort`, () => {
  const items = [3, 1, 6, 4, 7, 2, 5, 8, 9, 0];
  const iterator = Sort.gnomeSort(items);

  Array.from(iterator);

  expect(items).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
