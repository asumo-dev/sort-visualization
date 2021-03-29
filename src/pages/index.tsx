import React, { useState } from 'react';
import { PageProps } from 'gatsby';

import SortAnimation from '@/components/SortAnimation';
import { Sort } from '@/utils/sort';
import SortSelect from '@/components/SortSelect';
import queryString from 'querystring';
import { Utils } from '@/utils/utils';
import { useLocation } from '@reach/router';

const getSortName = (query) => {
  if (!query) {
    return null;
  }

  const a = Utils.trimStart(query, `?`);
  let { sort } = queryString.parse(a);
  if (typeof sort !== `string`) {
    return null;
  }

  sort = Utils.kebabToCamelCase(sort);

  return sort;
};

const createSort = (sortName) => {
  if (Object.prototype.hasOwnProperty.call(Sort, sortName)) {
    return {
      func: Sort[sortName],
      id: sortName,
      name: Utils.camelToTitleCase(sortName),
    };
  }

  return {
    func: Sort.bubbleSort,
    id: `bubbleSort`,
    name: `Bubble Sort`,
  };
};

const Home: React.FC<PageProps> = () => {
  const location = useLocation();
  const defaultSortName =
    (location.search && getSortName(location.search)) || `bubbleSort`;

  const [sort, setSort] = useState(createSort(defaultSortName));

  const onSelect = (e) => {
    const sel = e.target;
    if (!Object.prototype.hasOwnProperty.call(Sort, sel.value)) {
      return;
    }

    setSort({
      func: Sort[sel.value],
      id: sel.value,
      name: sel.options[sel.selectedIndex].text,
    });
  };

  return (
    <main>
      <h1>{sort.name}</h1>
      <div>
        <SortSelect onChange={onSelect} defaultValue={sort.id} />
      </div>
      <SortAnimation sortMethod={sort.func} itemCount={15} />
    </main>
  );
};

export default Home;
