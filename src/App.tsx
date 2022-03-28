import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResetCSS } from 'uikit';
import ScaleOrientContent from 'components/ScaleOrientContent';
import useEagerConnect from 'hooks/useEagerConnect';
import Providers from './Providers';

import {
  TestBgCard,
  Test,
  TestCard,
  TestButton,
  TestStar,
  TestText,
  TestLabel,
} from './views/Test';

const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));

const MysteryBox = lazy(() => import('./views/MysteryBox'));
const MysteryBoxDetail = lazy(() => import('./views/MysteryBox/Detail'));
const MysteryBoxState = lazy(() => import('./views/MysteryBox/State'));

const PlantLeague = lazy(() => import('./views/PlantLeague'));

const Plunder = lazy(() => import('./views/Plunder'));
const Galaxy = lazy(() => import('./views/Galaxy'));

const Start = lazy(() => import('./views/Star/Layout'));

function App() {
  useEagerConnect(); // 自动链接钱包

  return (
    // <BrowserRouter>
    <>
      <ResetCSS />
      <ScaleOrientContent>
        <Suspense fallback='loading...'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/index' element={<Home />} />

            {/* 盲盒 */}
            <Route path='/mystery-box' element={<MysteryBox />} />
            <Route path='/mystery-box/detail' element={<MysteryBoxDetail />} />
            <Route path='/mystery-box/state' element={<MysteryBoxState />} />

            {/* 星球 */}
            <Route path='/star/*' element={<Start />} />

            {/* 星球联盟 */}
            <Route path='/plant-league' element={<PlantLeague />} />

            {/* 星系 */}
            <Route path='/galaxy' element={<Galaxy />} />

            {/* 掠夺 */}
            <Route path='/plunder' element={<Plunder />} />

            <Route path='/test' element={<Test />}>
              <Route path='card' element={<TestCard />} />
              <Route path='bg-card' element={<TestBgCard />} />
              <Route path='button' element={<TestButton />} />
              <Route path='star' element={<TestStar />} />
              <Route path='text' element={<TestText />} />
              <Route path='label' element={<TestLabel />} />
            </Route>
          </Routes>
        </Suspense>
      </ScaleOrientContent>
    </>
    // </BrowserRouter>
  );
}

export default App;
