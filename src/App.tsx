import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ResetCSS, Spinner } from 'uikit';
import VConsole from 'vconsole';
import ScaleOrientContent from 'components/ScaleOrientContent';
import useEagerConnect from 'hooks/useEagerConnect';
import { ConnectWalletProvider } from 'contexts/ConnectWallet';
import AccountUpdater from './views/Updater/AccountUpdater';
import EventBusUpdater from './views/Updater/EventBusUpdater';

import {
  TestBgCard,
  Test,
  TestCard,
  TestButton,
  TestStar,
  TestText,
  TestLabel,
  TestDrag,
  TestDragAndPut,
} from './views/Test';

const ChangeRate = lazy(() => import('./views/Test/ChangeRate'));

const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));

const MysteryBox = lazy(() => import('./views/MysteryBoxNew'));
const MysteryBoxDetail = lazy(() => import('./views/MysteryBoxNew/Detail'));
const MysteryBoxState = lazy(() => import('./views/MysteryBoxNew/State'));
const MysteryBoxList = lazy(() => import('./views/MysteryBoxNew/List'));

const PlantLeague = lazy(() => import('./views/PlantLeague'));
const BattleReport = lazy(() => import('./views/BattleReport'));
const ChoosePlanet = lazy(() => import('./views/NewPlantLeague/ChoosePlanet'));

const Plunder = lazy(() => import('./views/Plunder'));
const PlunderPk = lazy(() => import('./views/Plunder/Pk'));
const PlunderResult = lazy(() => import('./views/Plunder/Result'));
const PlunderTest = lazy(() => import('./views/Plunder/Test'));
const Galaxy = lazy(() => import('./views/Galaxy'));
const Auction = lazy(() => import('./views/Galaxy/Auction'));
const Stars = lazy(() => import('./views/Galaxy/Stars'));

const Start = lazy(() => import('./views/Star/Layout'));
// const StartPlanet = lazy(() => import('./views/Planet'));
const StartPlanet = lazy(() => import('./views/NewPlanet'));

const UpgradeList = React.lazy(
  () => import('./views/Star/components/upgrade/SelectPlanet'),
);

const VipPage = lazy(() => import('./views/vip'));
const NewPlantLeague = lazy(() => import('./views/NewPlantLeague'));
const PlatformNews = lazy(() => import('./views/PlatformNews'));
const NewGalaxy = lazy(() => import('./views/NewGalaxy'));

// window.addEventListener('click', () => {
//   console.log(Object.keys(document.documentElement));
//   console.log((document as any).webkitRequestFullScreen);
// });

// const vConsole = new VConsole();

function App() {
  useEagerConnect(); // 自动链接钱包

  return (
    // <BrowserRouter>
    <>
      <AccountUpdater />
      <EventBusUpdater />
      <ResetCSS />
      <ScaleOrientContent>
        <ConnectWalletProvider>
          <Suspense
            fallback={
              <Box mt='36px'>
                <Spinner />
              </Box>
            }
          >
            <Routes>
              <Route path='/' element={<Login />} />
              {/* <Route path='/index' element={<Home />} /> */}

              {/* 盲盒 */}
              <Route path='/mystery-box' element={<MysteryBox />} />
              <Route
                path='/mystery-box/detail'
                element={<MysteryBoxDetail />}
              />
              {/* <Route path='/mystery-box/state' element={<MysteryBoxState />} /> */}
              <Route path='/mystery-box/list' element={<MysteryBoxList />} />

              {/* 升级星球背包 */}
              <Route path='/upgrade-list' element={<UpgradeList />} />

              {/* 我的星球 */}
              <Route path='/star/planet' element={<StartPlanet />} />
              {/* 星球 */}
              <Route path='/star/*' element={<Start />} />

              {/* 星球联盟 */}
              {/* <Route path='/plant-league' element={<PlantLeague />} /> */}
              <Route path='/plant-league' element={<NewPlantLeague />} />
              {/* <Route path='/choose-planet' element={<ChoosePlanet />} /> */}
              <Route path='/platform-News' element={<PlatformNews />} />

              <Route path='/battleReport' element={<BattleReport />} />
              {/* 星系 */}
              {/* <Route path='/galaxy' element={<Galaxy />} />
              <Route path='/galaxy/auction' element={<Auction />} />
              <Route path='/galaxy/stars' element={<Stars />} /> */}
              <Route path='/galaxy' element={<NewGalaxy />} />

              {/* 掠夺 */}
              <Route path='/plunder' element={<Plunder />} />
              <Route path='/plunder-test' element={<PlunderTest />} />
              <Route path='/plunder-pk' element={<PlunderPk />} />
              <Route path='/plunder-result' element={<PlunderResult />} />

              <Route path='/vip' element={<VipPage />} />

              <Route path='/change-rate' element={<ChangeRate />} />

              <Route path='/test' element={<Test />}>
                <Route path='drag-put' element={<TestDragAndPut />} />
                <Route path='drag' element={<TestDrag />} />
                <Route path='card' element={<TestCard />} />
                <Route path='bg-card' element={<TestBgCard />} />
                <Route path='button' element={<TestButton />} />
                <Route path='star' element={<TestStar />} />
                <Route path='text' element={<TestText />} />
                <Route path='label' element={<TestLabel />} />
              </Route>
            </Routes>
          </Suspense>
        </ConnectWalletProvider>
      </ScaleOrientContent>
    </>
    // </BrowserRouter>
  );
}

export default App;
