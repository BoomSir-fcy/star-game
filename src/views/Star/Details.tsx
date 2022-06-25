import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStore, storeAction } from 'state';
import { Box } from 'uikit';
import { Api } from 'apis';

import { Steps } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import useParsedQueryString from 'hooks/useParsedQueryString';
import useBuilding from 'building/hooks/useBuilding';
import { useGuide } from 'hooks/useGuide';
import { useTranslation } from 'contexts/Localization';
import type { AreaDataItem } from './components/dragCompoents';

import {
  BarRight,
  SideLeftContent,
  SideRightBuildingInfo,
} from './components/buildings';
import { PlanetQueue } from './components/buildings/planetQueue';
import { useWorkqueue } from './components/hooks';
import { ThingDestoryModal, ThingUpgradesModal } from './components/Modal';
import { useActiveBuilder } from './detailHooks';

const Container = styled(Box)`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const Details = () => {
  const parsedQs = useParsedQueryString();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { refreshWorkQueue } = useWorkqueue();
  const { guides, setGuide } = useGuide(location.pathname);
  const [state, setState] = React.useState<AreaDataItem[]>([]);
  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [serverDiffTime, setServerDiffTime] = React.useState<number>(0);

  const steps = React.useMemo(() => {
    return [
      {
        element: '.planet_header',
        intro: t(
          'Each planet has its own production capacity and resources, which comes from the construction strategy of buildings.',
        ),
      },
      {
        element: '.common_nav',
        intro: t(
          'The left navigation can manage the upgrading, cultivation and array arrangement of the planet.',
        ),
      },
      {
        element: '.star_manager',
        intro: t(
          'Each planet has a built grid, and the number of grids is linked to the quality. Reasonable construction strategy is also one of the ways to win.',
        ),
      },
      {
        element: '.buildings',
        intro: t(
          'The construction list will show the units that can be built, including consumption, type, capacity, etc',
        ),
      },
      {
        element: '.energy_tank_0',
        intro: t(
          'This is the energy tank of the planet. It is the core building for resource management. It can supplement its resources and store the resources plundered by the stars.',
        ),
      },
      {
        element: '.building_0',
        intro: t(
          'Start to create the first building of the planet and drag the building to the right place on the chessboard.',
        ),
      },
      {
        element: '.building_1',
        intro: t('Continue to build a building.'),
      },
    ];
  }, [t]);

  const building = useBuilding({
    width: 1920,
    height: 900,
  });
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(building.view);
      building.creatTerrain([]);
      // createHandle();
    }
  }, [building, ref]);

  const activeBuilder = useActiveBuilder(building);

  const id = Number(parsedQs.id);
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
  const upgrad = useStore(p => p.buildling.upgradesBuilding);
  const destory = useStore(p => p.buildling.destroyBuilding);
  const currentTime = Number((Date.now() / 1000).toFixed(0));

  const updateGrid = React.useCallback(data => {
    setState(data);
  }, []);

  const getWorkQueue = React.useCallback(
    async (isSave?: boolean) => {
      try {
        const res = await refreshWorkQueue(id);
        if (Api.isSuccess(res)) {
          const resWorkQueue = res.data.work_queue;
          console.log(resWorkQueue);
          // let isQueue = [];
          // if (isSave) {
          //   isQueue = currentQueue.filter((item: any) => !item.planet_id);
          // }
          // setCurrentQueue([...resWorkQueue, ...isQueue]);
          setServerDiffTime(
            res.data.time - currentTime > 0
              ? -(res.data.time - currentTime)
              : res.data.time - currentTime,
          );
          // dispatch(fetchPlanetBuildingsAsync(planet_id));
          // dispatch(fetchPlanetInfoAsync([planet_id]));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [currentTime, id, refreshWorkQueue],
  );

  React.useEffect(() => {
    if (planet?.areaX > 0 && planet?.areaY > 0) {
      const data: any = [];
      for (let i = 0; i < planet.areaX; i++) {
        for (let j = 0; j < planet.areaY; j++) {
          const buildings = selfBuilding?.find(
            r => r.index === j * planet.areaX + i,
          );
          if (buildings?.building?._id) {
            data.push({
              ...buildings,
              ...buildings.building,
              x: i,
              y: j,
              index: j * planet.areaX + i,
              isbuilding: true,
              isactive: false,
            });
          } else {
            data.push({
              index: j * planet.areaX + i,
              isbuilding: false,
              propterty: {
                size: {
                  area_x: 1,
                  area_y: 1,
                },
              },
              x: i,
              y: j,
            });
          }
        }
      }
      updateGrid(data);
    }
  }, [planet, selfBuilding, updateGrid]);

  React.useEffect(() => {
    getWorkQueue();
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch, getWorkQueue]);

  return (
    <>
      <Container>
        {!guides.guideFinish &&
          guides.finish &&
          steps.length - 1 > guides.step && (
            <Steps
              enabled={stepsEnabled}
              steps={steps}
              initialStep={guides.step}
              options={{
                exitOnOverlayClick: false,
                disableInteraction: false,
              }}
              onChange={currentStep => {
                if (currentStep > guides.step) {
                  setGuide(currentStep);
                }
              }}
              onExit={step => {
                setStepsEnabled(false);
                if (step === steps.length - 1) {
                  navigate(`/star/upgrade?id=${id}`);
                  return;
                }
                if (step < steps.length - 1) {
                  dispatch(
                    storeAction.toggleVisible({
                      visible: true,
                      lastStep: steps.length,
                    }),
                  );
                }
              }}
            />
          )}
        <SideLeftContent race={planet?.race} building={building} />
        <PlanetQueue
          serverTime={currentTime + serverDiffTime}
          currentQueue={[]}
        />
        <SideRightBuildingInfo
          planet={planet}
          planet_id={id}
          buildingsId='62a6dc0252416b0eec60e970'
        />
        <Box ref={ref} />
      </Container>

      {/* 建筑升级 */}
      <ThingUpgradesModal
        visible={upgrad.visible}
        planet_id={id}
        onChange={async () => {}}
        onClose={() => {
          dispatch(
            storeAction.upgradesBuildingModal({
              visible: false,
              upgrad: {},
            }),
          );
        }}
      />

      {/* 销毁建筑 */}
      <ThingDestoryModal
        visible={destory.visible}
        planet_id={id}
        onChange={() => {}}
        onClose={() =>
          dispatch(
            storeAction.destoryBuildingModal({ visible: false, destory: {} }),
          )
        }
      />
    </>
  );
};

export default Details;
