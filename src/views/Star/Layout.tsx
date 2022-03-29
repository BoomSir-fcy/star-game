import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Container = React.lazy(() => import('./container'));
const Details = React.lazy(() => import('./Details'));
const Upgrade = React.lazy(() => import('./Upgrade'));
const Grow = React.lazy(() => import('./Grow'));

const StarLayout = () => {
  return (
    <Container>
      <Routes>
        <Route index element={<Details />} />
        <Route path='upgrade' element={<Upgrade />} />
        <Route path='grow' element={<Grow />} />
      </Routes>
    </Container>
  );
};

export default StarLayout;
