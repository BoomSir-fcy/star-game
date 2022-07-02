import React from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStore, storeAction, AppDispatch } from 'state';
import { Box, Button } from 'uikit';
import { Api } from 'apis';

import { Steps } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import useParsedQueryString from 'hooks/useParsedQueryString';
import useBuilding from 'building/hooks/useBuilding';
import { useToast } from 'contexts/ToastsContext';
import { useGuide } from 'hooks/useGuide';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { setNavZIndex } from 'state/userInfo/reducer';
import { useBuildingOperate } from './components/gameModel/hooks';
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
  const { toastSuccess, toastError } = useToast();
  const { refreshWorkQueue } = useWorkqueue();
  const { destory: destoryHook } = useBuildingOperate();
  const { guides, setGuide } = useGuide(location.pathname);
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

  const activeBuilder = useActiveBuilder(building);

  const id = Number(parsedQs.id);
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
  const upgrad = useStore(p => p.buildling.upgradesBuilding);
  const destory = useStore(p => p.buildling.destroyBuilding);

  const [stateBuilding, setStateBuilding] = useImmer({
    visible: false,
    building: {} as Api.Building.Building,
    workQueue: [],
  });

  const [areaX, areaY] = React.useMemo(() => {
    return [planet?.areaX, planet?.areaY];
  }, [planet]);

  React.useEffect(() => {
    if (ref.current && areaX && areaY) {
      ref.current.appendChild(building.view);
      building.creatTerrain(areaX, areaY);
    }
  }, [building, ref, areaX, areaY]);

  const initBuilder = React.useCallback(() => {
    building.initBuilder(selfBuilding);
  }, [building, selfBuilding]);

  React.useEffect(() => {
    if (building.boardsCreated) {
      initBuilder();
    }
    building.addEventListener('boardsCreated', initBuilder);
    return () => {
      building.removeEventListener('boardsCreated', initBuilder);
    };
  }, [initBuilder, building]);

  const initBuildingBuilder = React.useCallback(() => {
    console.log(stateBuilding.workQueue, building);
    const createWorks = stateBuilding.workQueue.filter(
      item => item.work_type === 1,
    );
    building.initBuildingBuilder(createWorks);
  }, [building, stateBuilding.workQueue]);

  React.useEffect(() => {
    if (building.boardsCreated) {
      initBuildingBuilder();
    }
    building.addEventListener('boardsCreated', initBuildingBuilder);
    return () => {
      building.removeEventListener('boardsCreated', initBuildingBuilder);
    };
  }, [initBuildingBuilder, building]);

  const getWorkQueue = React.useCallback(async () => {
    try {
      const res = await refreshWorkQueue(id);
      if (Api.isSuccess(res)) {
        const workQueueBase = res.data.base;
        const resWorkQueue = res.data.work_queue;
        const queueList = resWorkQueue.map(item => {
          const buildings = workQueueBase.find(
            ({ buildings_number }) => buildings_number === item.building_number,
          );
          return { ...item, building: buildings };
        });
        setStateBuilding(p => {
          p.workQueue = queueList;
        });
        setServerDiffTime(res.data.time);
        dispatch(storeAction.resetModal());
        dispatch(fetchPlanetBuildingsAsync(id));
        dispatch(fetchPlanetInfoAsync([id]));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, id, refreshWorkQueue, setStateBuilding]);

  // 保存到队列
  const saveWorkQueue = React.useCallback(
    async (val: Api.Building.Building) => {
      const current = [];
      if (!val.isbuilding) {
        current.push({
          work_type: 1,
          building_create_param: {
            buildings_id: val._id,
            building_number: val.buildings_number,
            position: val.position,
            index: 0,
          },
        });
      } else {
        current.push({
          work_type: 2,
          building_upgrade_param: {
            buildings_id: val._id,
            building_number: val.buildings_number,
          },
        });
      }
      try {
        const res = await Api.BuildingApi.createQueueBuilding({
          planet_id: id,
          work_queue_params: current,
        });
        if (Api.isSuccess(res)) {
          activeBuilder?.setIsBuilding(true);
          getWorkQueue();
          toastSuccess(t('planetTipsSaveSuccess'));
        } else if (activeBuilder) {
          building?.removeBuilder(activeBuilder);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, t, toastSuccess, activeBuilder],
  );

  // 销毁建筑
  const destoryBuilding = React.useCallback(async () => {
    if (!activeBuilder?.builded) {
      setStateBuilding(p => {
        p.visible = false;
      });
      dispatch(setNavZIndex(true));
      dispatch(storeAction.resetModal());
      building?.removeBuilder(activeBuilder);
      return;
    }
    try {
      const res = await destoryHook({
        planet_id: id,
        build_type: destory?.destory?.type,
        building_setting: [destory?.destory?._id],
      });
      if (Api.isSuccess(res)) {
        toastSuccess(t('planetDestroyedSuccessfully'));
        setStateBuilding(p => {
          p.visible = false;
        });
        dispatch(setNavZIndex(true));
        dispatch(storeAction.resetModal());
        building?.removeBuilder(activeBuilder);
      } else {
        toastError(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    activeBuilder,
    building,
    destory,
    destoryHook,
    dispatch,
    id,
    setStateBuilding,
    t,
    toastError,
    toastSuccess,
  ]);

  React.useEffect(() => {
    if (activeBuilder?.option?.id) {
      setStateBuilding(p => {
        p.visible = true;
        p.building = {
          ...activeBuilder?.option?.building,
          position: activeBuilder.position,
          isbuilding: activeBuilder?.builded,
        };
      });
      setTimeout(() => {
        dispatch(setNavZIndex(false));
      }, 100);
    }
  }, [activeBuilder, dispatch, setStateBuilding]);

  React.useEffect(() => {
    if (id) {
      getWorkQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
      dispatch(storeAction.resetModal());
    };
  }, [dispatch]);

  return (
    <>
      <Container>
        {/* {!guides.guideFinish &&
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
          )} */}
        <SideLeftContent race={planet?.race} building={building} />
        <PlanetQueue
          serverTime={serverDiffTime}
          currentQueue={stateBuilding.workQueue}
          onComplete={() => getWorkQueue()}
        />
        {stateBuilding.visible && (
          <SideRightBuildingInfo
            visible={stateBuilding.visible}
            planet={planet}
            planet_id={id}
            workQueue={stateBuilding.workQueue}
            buildingsId={stateBuilding.building?._id}
            itemData={stateBuilding?.building}
            onCreateBuilding={async val => {
              setStateBuilding(p => {
                p.visible = false;
              });
              await saveWorkQueue(val);
            }}
            onClose={bool => {
              if (bool && activeBuilder) {
                building?.removeBuilder(activeBuilder);
              }
              building?.removeActiveSolider();
              dispatch(setNavZIndex(true));
              setStateBuilding(p => {
                p.visible = false;
              });
            }}
          />
        )}

        <Box ref={ref} />
      </Container>

      {/* 建筑升级 */}
      <ThingUpgradesModal
        visible={upgrad.visible}
        planet_id={id}
        onChange={async val => {
          setStateBuilding(p => {
            p.visible = false;
          });
          await saveWorkQueue(val);
        }}
        onClose={() => {
          dispatch(setNavZIndex(true));
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
        onChange={destoryBuilding}
        onClose={() => {
          // dispatch(setNavZIndex(true));
          dispatch(
            storeAction.destoryBuildingModal({ visible: false, destory: {} }),
          );
        }}
      />
    </>
  );
};

export default Details;
