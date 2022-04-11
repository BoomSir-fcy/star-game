import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResetCSS } from 'uikit';
import ScaleOrientContent from 'components/ScaleOrientContent';
import useEagerConnect from 'hooks/useEagerConnect';
import Toast from 'components/Toast';
import AccountUpdater from './views/Updater/AccountUpdater';

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
const PlunderTest = lazy(() => import('./views/Plunder/Test'));
const Galaxy = lazy(() => import('./views/Galaxy'));
const Auction = lazy(() => import('./views/Galaxy/Auction'));
const Stars = lazy(() => import('./views/Galaxy/Stars'));

const Start = lazy(() => import('./views/Star/Layout'));
const StartPlanet = lazy(() => import('./views/Star/planet'));

const UpgradeList = React.lazy(
  () => import('./views/Star/components/upgrade/SelectPlanet'),
);

function App() {
  useEagerConnect(); // 自动链接钱包

  return (
    // <BrowserRouter>
    <>
      <AccountUpdater />
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

            {/* 升级星球背包 */}
            <Route path='/upgrade-list' element={<UpgradeList />} />

            {/* 我的星球 */}
            <Route path='/star/planet' element={<StartPlanet />} />
            {/* 星球 */}
            <Route path='/star/*' element={<Start />} />

            {/* 星球联盟 */}
            <Route path='/plant-league' element={<PlantLeague />} />

            {/* 星系 */}
            <Route path='/galaxy' element={<Galaxy />} />
            <Route path='/galaxy/auction' element={<Auction />} />
            <Route path='/galaxy/stars' element={<Stars />} />

            {/* 掠夺 */}
            <Route path='/plunder' element={<Plunder />} />
            <Route path='/plunder-test' element={<PlunderTest />} />

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
        <Toast />
      </ScaleOrientContent>
    </>
    // </BrowserRouter>
  );
}

export default App;
