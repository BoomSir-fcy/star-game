import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResetCSS } from 'uikit';
import ScaleOrientContent from 'components/ScaleOrientContent';
import Providers from './Providers';

import {
  Star,
  StarBuild,
  StarGrow,
  StarUpgrade,
  StarSearch,
} from './views/Star';
import {
  TestBgCard,
  Test,
  TestCard,
  TestButton,
  TestStar,
  TestText,
} from './views/Test';

const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));

const MysteryBox = lazy(() => import('./views/MysteryBox'));
const MysteryBoxDetail = lazy(() => import('./views/MysteryBox/Detail'));
const MysteryBoxState = lazy(() => import('./views/MysteryBox/State'));

const PlantLeague = lazy(() => import('./views/PlantLeague'));

const Plunder = lazy(() => import('./views/Plunder'));

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ResetCSS />
        <ScaleOrientContent>
          <Suspense fallback='loading...'>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/index' element={<Home />} />

              {/* 盲盒 */}
              <Route path='/mystery-box' element={<MysteryBox />} />
              <Route
                path='/mystery-box/detail'
                element={<MysteryBoxDetail />}
              />
              <Route path='/mystery-box/state' element={<MysteryBoxState />} />

              {/* 星球 */}
              <Route path='/star' element={<Star />}>
                <Route path='build' element={<StarBuild />} />
                <Route path='grow' element={<StarGrow />} />
                <Route path='upgrade' element={<StarUpgrade />} />
              </Route>
              <Route path='/star/search' element={<StarSearch />} />

              {/* 星球联盟 */}
              <Route path='/plant-league' element={<PlantLeague />} />

              {/* 掠夺 */}
              <Route path='/plunder' element={<Plunder />} />

              <Route path='/test' element={<Test />}>
                <Route path='card' element={<TestCard />} />
                <Route path='bg-card' element={<TestBgCard />} />
                <Route path='button' element={<TestButton />} />
                <Route path='star' element={<TestStar />} />
                <Route path='text' element={<TestText />} />
              </Route>
            </Routes>
          </Suspense>
        </ScaleOrientContent>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
