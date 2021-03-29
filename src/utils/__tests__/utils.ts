import { Utils } from '@/utils/utils';

test(`kebabToCamelCase works`, () => {
  expect(Utils.kebabToCamelCase(`odd-even-sort`)).toEqual(`oddEvenSort`);
});

test(`trimStart works`, () => {
  expect(Utils.trimStart(`abcdefg`, `abc`)).toEqual(`defg`);

  expect(Utils.trimStart(`?sort=abc`, `?`)).toEqual(`sort=abc`);
});
