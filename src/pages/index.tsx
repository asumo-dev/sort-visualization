import React, { useState } from 'react';
import { PageProps } from 'gatsby';

import SortAnimation from '@/components/SortAnimation';
import { Sort } from '@/utils/sort';
import SortSelect from '@/components/SortSelect';

const Home: React.FC<PageProps> = () => {
  const [sort, setSort] = useState({
    func: Sort.bubbleSort,
    name: `Bubble Sort`,
  });

  const onSelect = (e) => {
    const sel = e.target;
    if (!Object.prototype.hasOwnProperty.call(Sort, sel.value)) {
      return;
    }

    setSort({
      func: Sort[sel.value],
      name: sel.options[sel.selectedIndex].text,
    });
  };

  return (
    <main>
      <h1>{sort.name}</h1>
      <div>
        <SortSelect onChange={onSelect} />
      </div>
      <SortAnimation sortMethod={sort.func} itemCount={15} />
    </main>
  );
};

export default Home;
