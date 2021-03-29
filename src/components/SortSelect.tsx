import React, { SelectHTMLAttributes } from 'react';
import { Sort } from '@/utils/sort';
import { Utils } from '@/utils/utils';

type SortSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const SortSelect: React.FC<SortSelectProps> = (props) => {
  const sortMethods = Object.keys(Sort).filter((n) => n.endsWith(`Sort`));

  return (
    <select data-testid="select" {...props}>
      {sortMethods.map((n) => (
        <option value={n} key={n}>
          {Utils.camelToTitleCase(n)}
        </option>
      ))}
    </select>
  );
};

export default SortSelect;
