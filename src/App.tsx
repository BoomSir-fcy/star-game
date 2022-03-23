import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResetCSS } from 'uikit';
import ScaleOrientContent from 'components/ScaleOrientContent';
import Providers from './Providers';

const Home = lazy(() => import('./views/Home'));
const Test = lazy(() => import('./views/Test'));
const Login = lazy(() => import('./views/Login'));

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ResetCSS />
        <ScaleOrientContent>
          <Suspense fallback='loading...'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              {/* <Route path='/login/next' element={<Login />} /> */}
              <Route path='/test' element={<Test />} />
            </Routes>
          </Suspense>
        </ScaleOrientContent>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
