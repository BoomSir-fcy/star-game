import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ResetCSS, Flex, Box } from 'uikit';
import StarrySky from 'components/StarrySky';
import Providers from './Providers';

const Home = lazy(() => import('./views/Home'));
const Test = lazy(() => import('./views/Test'));
const Login = lazy(() => import('./views/Login'));

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ResetCSS />
        <StarrySky />
        <Suspense fallback='loading...'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/test' element={<Test />} />
          </Routes>
        </Suspense>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
