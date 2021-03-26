import React from 'react';
import { PageProps } from 'gatsby';

import Title from '@/components/Title';
import SortAnimation from '@/components/SortAnimation';
import { Sort } from '@/utils/sort';

const Home: React.FC<PageProps> = () => (
  <main>
    <Title />
    <SortAnimation sortMethod={Sort.bubbleSort} itemCount={20} />
  </main>
);

export default Home;
