import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Container = React.lazy(() => import('./container'));
const Grow = React.lazy(() => import('./Grow'));
const Upgrade = React.lazy(() => import('./Upgrade'));

const StarLayout = () => {
  return (
    <Routes>
      <Route element={<Container />}>
        <Route index element={<Grow />} />
        <Route path='child' element={<Upgrade />} />
      </Route>
    </Routes>
  );
};

export default StarLayout;
