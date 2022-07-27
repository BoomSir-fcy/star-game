import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import classNames from 'classnames';
import { useImmer } from 'use-immer';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStore, storeAction } from 'state';
import { Box } from 'uikit';
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
import { eventsType } from 'building/core/event';
import { useCallbackPrompt } from 'hooks/useCallbackPrompt';
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
  height: 100%;
`;

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
  disabled?: boolean;
  backDisabled?: boolean;
}>`

  ${({ disabled }) => {
    return disabled
      ? `
    .introjs-nextbutton {
      pointer-events: none !important;
      color: #9e9e9e !important;
      cursor: default !important;
    }
    `
      : '';
  }};

  ${({ backDisabled }) => {
    return backDisabled
      ? `
    .introjs-prevbutton {
      pointer-events: none !important;
      color: #9e9e9e !important;
      cursor: default !important;
    }
    `
      : '';
  }};

  ${({ interactive }) => {
    return interactive
      ? `
    *{
      pointer-events: none;
    }
    .introjs-showElement, .introjs-showElement *, .introjs-tooltip, .introjs-tooltip *{
      pointer-events: auto;
    }
    `
      : '';
  }};
  
`;

const Details = () => {
  const building = useBuilding({
    width: 1920,
    height: 900,
  });

  const parsedQs = useParsedQueryString();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = Number(parsedQs.id);
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
  const upgrad = useStore(p => p.buildling.upgradesBuilding);
  const destory = useStore(p => p.buildling.destroyBuilding);
  const { activeSolider: activeBuilder, ActiveCheqer } =
    useActiveBuilder(building);
  const { t } = useTranslation();
  const { toastSuccess, toastError } = useToast();
  const { refreshWorkQueue } = useWorkqueue();
  const { destory: destoryHook } = useBuildingOperate();
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(guides.step);
  const [serverDiffTime, setServerDiffTime] = React.useState<number>(0);
  const { screenMode } = useStore(p => p.user);
  const guideRef = React.useRef(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const [toUpdate, setToUpdate] = React.useState(false);

  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog);

  const [stateBuilding, setStateBuilding] = useImmer({
    visible: false,
    building: {} as Api.Building.Building,
    workQueue: [],
  });

  const [areaX, areaY] = React.useMemo(() => {
    return [planet?.areaX, planet?.areaY];
  }, [planet]);

  const steps = React.useMemo(() => {
    return [
      {
        element: '.guide_step_1',
        intro: t('guidePlanetStep_1'),
      },
      {
        element: '.guide_step_2',
        intro: t('guidePlanetStep_2'),
        interactive: true,
        backDisabled: true,
        disabled: true,
      },
      {
        element: '.guide_step_3',
        intro: t('guidePlanetStep_3'),
        backDisabled: true,
      },
      {
        element: '.guide_step_4',
        intro: t('guidePlanetStep_4'),
        interactive: true,
        backDisabled: true,
        disabled: true,
      },
      {
        element: '.guide_step_5',
        intro: t('guidePlanetStep_5'),
        interactive: true,
        backDisabled: true,
        disabled: true,
      },
      {
        element: '.guide_step_6',
        intro: t('guidePlanetStep_6'),
        interactive: true,
        backDisabled: true,
        disabled: true,
      },
      {
        element: '.guide_step_7',
        intro: t('guidePlanetStep_7'),
        backDisabled: true,
        interactive: true,
      },
      {
        element: '.guide_step_8',
        intro: t('guidePlanetStep_8'),
        backDisabled: true,
      },
      {
        element: '.guide_step_9',
        intro: t('guidePlanetStep_9'),
        interactive: true,
      },
    ];
  }, [t]);

  const beforeStepChange = (nextStepIndex, nextElement) => {
    if (nextStepIndex === 3) {
      dispatch(setNavZIndex(false));
      guideRef?.current?.updateStepElement(nextStepIndex);
    }
    setGuide(nextStepIndex);
    setActiveStep(nextStepIndex);
  };

  React.useEffect(() => {
    if (ref.current && areaX && areaY) {
      ref.current.appendChild(building.view);
      building.creatTerrain(areaX, areaY);
    }
  }, [building, ref, areaX, areaY]);

  const initBuilder = React.useCallback(() => {
    building.initBuilder(selfBuilding);
    // setToUpdate(true);
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
    const createWorks = stateBuilding.workQueue.filter(
      item => item.work_type === 1,
    );
    building.initBuildingBuilder(createWorks);
    const Upgrade = stateBuilding.workQueue.filter(
      item => item.work_type === 2,
    );
    if (Upgrade.length) {
      setTimeout(() => {
        building.upgradeBuildingBuilder(Upgrade, true);
      }, 1000);
    }
    // if (toUpdate) {
    //   setToUpdate(false);
    // }
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
        const sortList = queueList.sort(
          (a, b) => a?.work_status - b?.work_status,
        );
        setStateBuilding(p => {
          p.workQueue = sortList;
        });
        setServerDiffTime(res.data.time);
        dispatch(storeAction.resetModal());
        dispatch(storeAction.queueVisbleSide(false));
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
          getWorkQueue();
          dispatch(fetchPlanetBuildingsAsync(id));
          dispatch(fetchPlanetInfoAsync([id]));
          toastSuccess(t('planetTipsSaveSuccess'));
          return true;
        }
        if (activeBuilder) {
          building?.removeBuilder(activeBuilder);
        }
        return false;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, t, toastSuccess],
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
    toastSuccess,
  ]);

  const createBuilding = React.useCallback(
    async event => {
      if (event?.detail?.builders?.id) {
        const params = {
          ...event?.detail?.builders?.option?.building,
          position: event?.detail?.builders?.position,
        };
        const res = await saveWorkQueue(params);
        if (res) {
          building?.removeActiveSolider();
          dispatch(setNavZIndex(true));
          setStateBuilding(p => {
            p.visible = false;
          });
        }
      }
    },
    [building, dispatch, saveWorkQueue, setStateBuilding],
  );

  const cancelBuilding = React.useCallback(() => {
    if (activeBuilder) {
      building?.removeBuilder(activeBuilder);
    }
    setStateBuilding(p => {
      p.visible = false;
    });
    dispatch(setNavZIndex(true));
  }, [activeBuilder, building, dispatch, setStateBuilding]);

  const onClickGuide = () => {
    const nextButton = document.querySelector('.introjs-nextbutton');
    nextButton?.dispatchEvent(new Event('click'));
  };

  // 上阵
  const handleGoIntoBattle = (item: Api.Building.Building) => {
    const option = {
      src: `${item.index}`,
      id: `${item._id}`,
      building: item,
      race: planet?.race,
      areaX: item.propterty.size.area_x,
      areaY: item.propterty.size.area_y,
      isBuilding: false,
      enableDrag: true,
      Lv: item.propterty.levelEnergy,
    };
    building?.addDragPreBuilderApp(option);
  };

  React.useEffect(() => {
    if (activeBuilder?.option?.id) {
      // 解决升级后id变化 建筑id不对的情况
      const activeInfo = selfBuilding.filter(item => {
        return (
          item.building._id === activeBuilder?.option?.id ||
          item.building._id === activeBuilder?.option?.building._id
        );
      });
      const buildingObj = {
        ...activeBuilder?.option?.building,
        // _id: activeBuilder?.option?.id,
        position: activeBuilder.position,
        isbuilding: activeBuilder?.builded,
        isqueue: activeBuilder?.isBuilding,
      };
      if (activeInfo.length) {
        buildingObj._id = activeInfo[0].building._id;
      }
      setStateBuilding(p => {
        p.visible = true;
        p.building = buildingObj;
      });
      setTimeout(() => {
        dispatch(setNavZIndex(false));
      }, 100);
    }
  }, [selfBuilding, activeBuilder, dispatch, setStateBuilding]);

  React.useEffect(() => {
    if (id) {
      getWorkQueue();
    }
    dispatch(fetchPlanetBuildingsAsync(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    building.addEventListener(eventsType.CONFIRM_BUILDER, createBuilding);
    building.addEventListener(eventsType.CANCEL_BUILDER, cancelBuilding);
    return () => {
      building.removeEventListener(eventsType.CONFIRM_BUILDER, createBuilding);
      building.removeEventListener(eventsType.CANCEL_BUILDER, cancelBuilding);
    };
  }, [building, cancelBuilding, createBuilding]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.resetModal());
      dispatch(storeAction.resetSelfBuildings());
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  // 单独处理每个新手引导的操作
  React.useEffect(() => {
    if (stateBuilding.visible && stepsEnabled && activeStep === 1) {
      setActiveStep(activeStep + 1);
      setGuide(activeStep + 1);
      onClickGuide();
    }
  }, [
    steps,
    activeStep,
    dispatch,
    guides.guideFinish,
    setGuide,
    setStateBuilding,
    stateBuilding.visible,
    stepsEnabled,
  ]);

  React.useEffect(() => {
    if (stepsEnabled && guides.step === 5) {
      onClickGuide();
    }
  }, [stepsEnabled, guides.step]);

  React.useEffect(() => {
    if (stepsEnabled && (guides.step === 2 || guides.step === 3)) {
      setActiveStep(4);
      setGuide(4);
      onClickGuide();
    }

    if (guides.guideFinish || steps.length - 1 === guides.step) {
      setStepsEnabled(false);
    }

    const bullets = document.getElementsByClassName('introjs-bullets');
    if (bullets.length > 0) {
      bullets[0].setAttribute('style', 'opacity:0');
    }
    return () => {
      if (guides.step === 2 || activeStep === 2) {
        setGuide(4);
      }
    };
  }, [activeStep, steps, guides, setGuide, stepsEnabled, dispatch]);

  // React.useEffect(() => {
  //   setGuide(0);
  // }, [setGuide]);

  return (
    <>
      <Container>
        {guides.finish &&
          !guides.guideFinish &&
          steps.length - 1 > guides.step && (
            <>
              <GlobalStyle
                interactive={steps[activeStep]?.interactive && stepsEnabled}
                disabled={steps[activeStep]?.disabled}
                backDisabled={steps[activeStep]?.backDisabled}
              />
              <Steps
                ref={guideRef}
                enabled={stepsEnabled}
                steps={steps}
                initialStep={activeStep || guides.step}
                options={{
                  exitOnOverlayClick: false,
                  disableInteraction: false,
                }}
                onBeforeChange={beforeStepChange}
                onExit={step => {
                  setStepsEnabled(false);
                  if (step < steps.length - 1) {
                    dispatch(
                      storeAction.toggleVisible({
                        visible: true,
                        lastStep: steps.length,
                      }),
                    );
                  }
                  if (step === steps.length - 1) {
                    setActiveStep(0);
                  }
                  if (step === steps.length - 1) {
                    setGuide(step);
                  }
                }}
              />
            </>
          )}
        <SideLeftContent
          race={planet?.race}
          building={building}
          sideRightStatus={stateBuilding.visible}
          animation={!stepsEnabled}
          handleGoIntoBattle={val => handleGoIntoBattle(val)}
          onPreview={val => {
            setStateBuilding(p => {
              p.visible = true;
              p.building = {
                ...val,
                isqueue: true,
              };
            });
          }}
          onChangeGuide={() => {
            setTimeout(() => {
              if (stepsEnabled) {
                building?.removeActiveSolider();
                setActiveStep(6);
                setGuide(6);
                onClickGuide();
                setStateBuilding(p => {
                  p.visible = false;
                });
              }
            }, 100);
          }}
        />
        <PlanetQueue
          ActiveCheqer={ActiveCheqer}
          serverTime={serverDiffTime}
          currentQueue={stateBuilding.workQueue}
          onChangeGuide={() => {
            setTimeout(() => {
              if (stepsEnabled) {
                building?.removeActiveSolider();
                setActiveStep(5);
                setGuide(5);
                onClickGuide();
                setStateBuilding(p => {
                  p.visible = false;
                });
              }
            }, 100);
          }}
          onComplete={async () => {
            await getWorkQueue();
            dispatch(fetchPlanetBuildingsAsync(id));
            dispatch(fetchPlanetInfoAsync([id]));
          }}
        />
        <Box
          className='guide_step_3'
          width='547px'
          height='100%'
          style={{
            position: 'fixed',
            right: '-18px',
            top: 0,
            zIndex: stateBuilding.visible && 199,
          }}
        >
          {stateBuilding.visible && (
            <SideRightBuildingInfo
              visible={stateBuilding.visible}
              planet={planet}
              planet_id={id}
              workQueue={stateBuilding.workQueue}
              buildingsId={stateBuilding.building?._id}
              itemData={stateBuilding?.building}
              animation={!stepsEnabled}
              OnAddBuildings={val => {
                handleGoIntoBattle(val);
                setStateBuilding(p => {
                  p.visible = true;
                  p.building = {
                    ...val,
                    // isPreview: false,
                    isqueue: true,
                  };
                });
                setTimeout(() => {
                  if (stepsEnabled) {
                    console.log(123123);

                    building?.removeActiveSolider();
                    setActiveStep(6);
                    setGuide(6);
                    onClickGuide();
                    setStateBuilding(p => {
                      p.visible = false;
                    });
                  }
                }, 100);
                dispatch(setNavZIndex(true));
                dispatch(storeAction.queueVisbleSide(false));
              }}
              onCreateBuilding={async val => {
                const res = await saveWorkQueue(val);
                if (res) {
                  setStateBuilding(p => {
                    p.visible = false;
                  });
                  dispatch(setNavZIndex(true));
                }
              }}
              onClose={bool => {
                if (bool && activeBuilder) {
                  building?.removeBuilder(activeBuilder);
                }
                building?.removeActiveSolider();
                if (activeStep === 3) {
                  setActiveStep(activeStep + 1);
                  setGuide(activeStep + 1);
                  onClickGuide();
                }
                dispatch(setNavZIndex(true));
                setStateBuilding(p => {
                  p.visible = false;
                });
              }}
            />
          )}
        </Box>
        <Box position='relative' width={1920} height={900}>
          <Box
            className={classNames(
              'guide_step_1',
              'guide_step_2',
              'guide_step_7',
            )}
            width='700px'
            height='700px'
            margin='0 auto 0'
            style={{
              position: 'static',
            }}
          >
            <Box
              // background='red'
              position='absolute'
              top={screenMode ? 0 : (900 - 1920) / 2}
              left={screenMode ? 0 : (1920 - 900) / 2}
              className={screenMode ? '' : 'reverse-rotate'}
              ref={ref}
            />
          </Box>
        </Box>
      </Container>

      {/* 建筑升级 */}
      <ThingUpgradesModal
        visible={upgrad.visible}
        planet_id={id}
        onChange={async val => {
          await saveWorkQueue(val);
          setStateBuilding(p => {
            p.visible = false;
          });
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
