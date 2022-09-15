import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  Flex,
  Image,
  GraphicsCard,
  BalanceText,
} from 'uikit';
import { useGuide } from 'hooks/useGuide';
import config from 'game/config';
import { Api } from 'apis';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
  useFetchGameTerrain,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useTranslation } from 'contexts/Localization';
import useGame from 'game/hooks/useGame';
import { useStore, storeAction } from 'state';
import { useDispatch } from 'react-redux';
import {
  fetchGamePlanetUnitsAsync,
  fetchUnitListAsync,
  setEmptyPlantUnits,
  setEmptyUnits,
} from 'state/game/reducer';
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard, { SortSoldier } from './components/SortBoard';
import useUpdatePos from './hooks/useUpdatePos';
import useActiveSoldier from './hooks/useActiveSoldier';
import { ArmsInfo } from '../components/arms';

// const game = new Game();

const GlobalStyle = createGlobalStyle<{ interactive?: boolean }>`
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

const moveKeyframes = keyframes`
  0% {
    transform: translate(0, -0);
    opacity: 0.5;    
    
  }
  50% {
    opacity:1;    
  }
  100% {
  transform: translate(-155px, -100px);
  opacity: 0.5;    
  
    
  }
`;

const ArrowBox = styled(Box)`
  animation: ${moveKeyframes} 2s linear infinite;
  & img {
    transform: rotate(-155deg);
  }
`;

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const game = useGame({ width: 1600, offsetStartX: -330 });

  const [CanCreate, setCanCreate] = useState(false);

  useEffect(() => {
    dispatch(setEmptyUnits({}));
    setTimeout(() => {
      setCanCreate(true);
    }, 100);
  }, [dispatch]);

  useEffect(() => {
    game.creatTerrain(4, 8); // 创建地形
  }, [game]);

  // const race = Number(parsedQs.race) as Api.Game.race;
  // useFetchGameTerrain();
  useFetchGamePK();
  useFetchGamePlanetUnits(planetId);

  const planetInfo = useStore(p => p.planet.planetInfo);
  const { plantUnits } = useStore(p => p.game);

  const info = useMemo(() => {
    return planetInfo[planetId];
  }, [planetInfo, planetId]);

  const race = info?.race as Api.Game.race;
  useFetchUnitList(race, info?.id);

  // const baseUnits = useStore(p => p.game.baseUnits);

  // const unitMaps = useMemo(() => {
  //   if (baseUnits[race]) return baseUnits[race];
  //   return null;
  // }, [baseUnits, race]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref, game]);

  const { gameSoldiers, setSortSoldiers, handleUpdate, OneClickDeployment } =
    useUpdatePos(planetId, game);

  const activeSoldier = useActiveSoldier(game);

  const activeNum = useCallback(
    id => {
      return gameSoldiers.filter(item => item.soldier.id === id)?.length || 0;
    },
    [gameSoldiers],
  );

  const UseSoldierNum = useCallback(
    (item: Api.Game.UnitInfo) => {
      // return `${activeNum(item?.unique_id)}/${
      //   item?.barracks === 1 && item?.probability === -1 ? '6' : item?.count
      // }`;
      return `${gameSoldiers.length}/6`;
    },
    [gameSoldiers],
  );

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[]) => {
      poses.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${item?.base_unit.index}`,
          race,
          id: item.base_unit_id,
          unique_id: item.base_unit_id,
          unitInfo: { ...item?.base_unit },
          activeCountText: UseSoldierNum(item?.base_unit),
          noHp: true,
        });
      });
    },
    [race, game, UseSoldierNum],
  );

  useEffect(() => {
    // 更新棋盘上显示的士兵可摆放数量
    if (gameSoldiers.length && plantUnits[planetId]) {
      gameSoldiers.forEach(item => {
        const unitInfoObj = plantUnits[planetId].filter(
          obj => obj?.base_unit?.unique_id === item?.soldier?.unique_id,
        );

        item.soldier.upDateActiveCountText(
          UseSoldierNum(unitInfoObj[0]?.base_unit),
        );
      });
    }
  }, [plantUnits, planetId, gameSoldiers, UseSoldierNum]);

  useEffect(() => {
    if (
      plantUnits[planetId] &&
      game.soldiers.length === 0 &&
      CanCreate &&
      race
    ) {
      createSoldiers(plantUnits[planetId]);
      setSortSoldiers(game.soldiers);
    }
  }, [
    plantUnits,
    race,
    planetId,
    createSoldiers,
    setSortSoldiers,
    game,
    CanCreate,
  ]);

  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);

  const stepRef = useRef(null);
  const [updaterStep, setUpdaterStep] = useState<Steps | null>(null);
  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);
  const steps = useMemo(
    () => [
      {
        element: '.star-embattle-step0',
        intro: t(
          'In the battle array interface, the enemy and ourselves are divided into two battle areas, and the combat units are deployed strategically to achieve victory.',
        ),
      },
      {
        element: '.star-embattle-step1',
        intro: t('This is the list of combat units you can fight now.'),
      },
      {
        element: '.star-embattle-step2',
        intro: t('Click to learn more about combat units.'),
      },
      {
        element: '.star-embattle-step3',
        intro: t(
          'The operation animation of the current combat unit can understand its operation mode.',
        ),
      },
      {
        element: '.star-embattle-step4',
        intro: t(
          'The basic attributes and capability cobweb of the current combat unit can be upgraded to improve the capability.',
        ),
      },
      {
        element: '.star-embattle-step5',
        intro: t(
          'Now start to arrange the formation, drag the combat units and place them in our combat area, and the reasonable deployment position is the only key',
        ),
        interactive: true,
      },
      {
        element: '.star-embattle-step6',
        intro: t(
          'Well, the latest combat effectiveness will be displayed after deployment! Click and finish to end the deployment.',
        ),
      },
    ],
    [t],
  );

  const [arrowShow, setArrowShow] = useState(false);

  const totalPower = useMemo(() => {
    return gameSoldiers.reduce((prev, curr) => {
      return prev + (curr.soldier.options?.unitInfo?.power || 0);
    }, 0);
  }, [gameSoldiers]);

  const removeHandle = useCallback(async () => {
    if (activeSoldier) {
      if (game.soldiers.length === 1) {
        dispatch(setEmptyPlantUnits({}));
      }
      game.removeSoldier(activeSoldier);
      if (game.soldiers.length === 1) {
        dispatch(fetchGamePlanetUnitsAsync(planetId));
        dispatch(fetchUnitListAsync(race, info?.id));
      }
      // handleUpdate();
    }
  }, [activeSoldier, game, planetId, race, info?.id, dispatch]);

  const { screenMode } = useStore(p => p.user);

  return (
    <Box className='star-embattle-step5' position='relative'>
      {!guides.guideFinish && guides.finish && steps.length - 1 > guides.step && (
        <>
          <GlobalStyle
            interactive={steps[activeStep]?.interactive && stepsEnabled}
          />
          <Steps
            enabled={stepsEnabled}
            steps={steps}
            initialStep={guides.step}
            ref={stepRef}
            options={{
              exitOnOverlayClick: false,
              tooltipPosition: 'top',
            }}
            onChange={currentStep => {
              if (currentStep === 5) {
                setArrowShow(true);
              } else if (currentStep > 5) {
                setArrowShow(false);
              }
              if (currentStep > guides.step) {
                setGuide(currentStep);
              }
            }}
            onBeforeChange={event => {
              setActiveStep(event);
            }}
            onExit={index => {
              setStepsEnabled(false);
              if (index < steps.length - 1) {
                dispatch(
                  storeAction.toggleVisible({
                    visible: true,
                    lastStep: steps.length,
                  }),
                );
              }
            }}
          />
        </>
      )}
      {/* <Box position='absolute' top={0} left={0} width={200}>
        <Button onClick={() => game.clearSoldier()}>
          <Text fontSize='20px'>Clear All</Text>
        </Button>
        <Flex>
          <Text>人口:</Text>
          <Text>
            {gameSoldiers.length}/{config.MAX_SOLDIER_COUNT}
          </Text>
        </Flex>
      </Box> */}
      <Box position='absolute' bottom={0} left={0}>
        <GraphicsCard
          className='star-embattle-step6'
          width='740px'
          height='75px'
          padding={0}
        >
          <Flex
            alignItems='center'
            justifyContent='space-between'
            height='100%'
            width='100%'
          >
            <Flex alignItems='center'>
              <Text margin='0 32px'>{t('Total Power')}</Text>
              <Text bold fontSize='34px' paddingRight={10} mark>
                {totalPower}
              </Text>
            </Flex>
            <Flex>
              <Button
                onClick={() => handleUpdate()}
                width='130px'
                height='45px'
                variant='purple'
              >
                <Text fontSize='18px' color='textPrimary' bold>
                  {t('Complete')}
                </Text>
              </Button>
              <Button
                onClick={() => OneClickDeployment(race)}
                ml='10px'
                width='180px'
                height='45px'
                variant='purple'
                padding='0 10px'
                mr='16px'
              >
                <Text color='textPrimary' bold>
                  {t('Smart Deployment')}
                </Text>
              </Button>
            </Flex>
          </Flex>
        </GraphicsCard>
      </Box>
      <Box
        position='absolute'
        top={0}
        left={0}
        width={900}
        height={500}
        className='star-embattle-step0'
        zIndex={-1}
      />
      <Box position='relative' width={1600} height={720}>
        <Box
          position='absolute'
          top={screenMode ? 0 : (720 - 1600) / 2}
          left={screenMode ? 0 : (1600 - 720) / 2}
          className={screenMode ? '' : 'reverse-rotate'}
          ref={ref}
        />
      </Box>
      <ArmsInfo
        className='star-embattle-step4'
        armsData={{ game_base_unit: activeSoldier?.options?.unitInfo }}
        sid={activeSoldier?.options?.unitInfo?.number}
        right='0'
        removeHandle={removeHandle}
      />

      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        right='18px'
      >
        {/* <Preview game={game} activeSoldier={activeSoldier} /> */}
        {/* <SortBoard
          className='star-embattle-step6'
          sortSoldiers={gameSoldiers}
          activeSoldier={activeSoldier}
          setSortSoldiers={(newItems, update) => {
            setSortSoldiers(newItems);
            if (update) {
              game.setSolders(newItems);
            }
          }}
        /> */}
      </Flex>
      <Box
        style={{ userSelect: 'none' }}
        position='absolute'
        bottom='0'
        right='0'
      >
        {/* <Box position='absolute' top='-80px'>
          <Button
            onClick={() => navigate(`/plunder-pk?pid0=${planetId}`)}
            padding={0}
            width='50px'
          >
            <Text fontSize='20px'>战斗测试</Text>
          </Button>
        </Box> */}
        <PreviewList
          race={race}
          game={game}
          gameSoldiers={gameSoldiers}
          disableClick={activeStep === 5 && stepsEnabled}
          disableDrag={activeStep === 2 && stepsEnabled}
          activeSoldier={activeSoldier}
          onDrag={() => {
            setArrowShow(false);
          }}
        />
      </Box>
      {arrowShow && (
        <ArrowBox
          position='absolute'
          top={480}
          left={800}
          width={200}
          height={200}
          zIndex={99}
        >
          <Image
            width={200}
            height={200}
            src='/images/commons/icon/to-arrow.png'
          />
        </ArrowBox>
      )}
    </Box>
  );
};

export default Embattle;
