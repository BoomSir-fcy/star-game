import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Container = React.lazy(() => import('./container'));
const Details = React.lazy(() => import('./Details'));
const Upgrade = React.lazy(() => import('./Upgrade'));

const StarLayout = () => {
  return (
    <Container>
      <Routes>
        <Route index element={<Details />} />
        <Route path='upgrade' element={<Upgrade />} />
      </Routes>
    </Container>
  );
};

export default StarLayout;
