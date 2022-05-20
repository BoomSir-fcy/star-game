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
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Flex, Image } from 'uikit';
import { useGuide } from 'hooks/useGuide';
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
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard, { SortSoldier } from './components/SortBoard';
import useUpdatePos from './hooks/useUpdatePos';
import useActiveSoldier from './hooks/useActiveSoldier';

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
  transform: translate(100px, -100px);
  opacity: 0.5;    
  
    
  }
`;

const ArrowBox = styled(Box)`
  animation: ${moveKeyframes} 2s linear infinite;
  & img {
    transform: rotate(-45deg);
  }
`;

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const game = useGame({ width: 1600, offsetStartX: -330 });

  useEffect(() => {
    game.creatTerrain(); // 创建地形
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
  useFetchUnitList(race);

  const baseUnits = useStore(p => p.game.baseUnits);

  const unitMaps = useMemo(() => {
    if (baseUnits[race]) return baseUnits[race];
    return null;
  }, [baseUnits, race]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref, game]);

  const { gameSoldiers, setSortSoldiers } = useUpdatePos(planetId, game);

  const activeSoldier = useActiveSoldier(game);

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[]) => {
      poses.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${item.base_unit_id}`,
          race,
          id: item.base_unit_id,
          unique_id: item.base_unit_id,
          unitInfo: unitMaps?.[item.base_unit_id],
        });
      });
    },
    [unitMaps, race, game],
  );

  useEffect(() => {
    if (plantUnits[planetId] && unitMaps && game.soldiers.length === 0) {
      createSoldiers(plantUnits[planetId]);
      setSortSoldiers(game.soldiers);
    }
  }, [plantUnits, planetId, unitMaps, createSoldiers, setSortSoldiers, game]);

  const { guides, setGuide } = useGuide('star-embattle');

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
          'All right, deployment is over! Here is the order of attack in combat.',
        ),
      },
    ],
    [t],
  );

  const [arrowShow, setArrowShow] = useState(false);

  return (
    <Box className='star-embattle-step5' position='relative'>
      <GlobalStyle
        interactive={steps[activeStep]?.interactive && stepsEnabled}
      />
      {guides.finish && steps.length - 1 > guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={activeStep}
          ref={stepRef}
          options={{
            exitOnOverlayClick: false,
            tooltipPosition: 'top',
          }}
          onBeforeChange={event => {
            setActiveStep(event);
          }}
          onChange={event => {
            if (event === 5) {
              setArrowShow(true);
            }
          }}
          onExit={index => {
            setStepsEnabled(false);
            if (index < steps.length) {
              dispatch(storeAction.toggleVisible({ visible: true }));
            }
          }}
        />
      )}
      <Box position='absolute' top={0} left={0} width={200}>
        <Button onClick={() => game.clearSoldier()}>
          <Text fontSize='20px'>Clear All</Text>
        </Button>
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
      <Box ref={ref} />
      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        left='824px'
      >
        <Preview game={game} activeSoldier={activeSoldier} />
        <SortBoard
          className='star-embattle-step6'
          sortSoldiers={gameSoldiers}
          activeSoldier={activeSoldier}
          setSortSoldiers={(newItems, update) => {
            setSortSoldiers(newItems);
            if (update) {
              game.setSolders(newItems);
            }
          }}
        />
      </Flex>
      <Box
        style={{ userSelect: 'none' }}
        position='absolute'
        top='490px'
        left='0'
      >
        <Box position='absolute' top='-80px'>
          <Button
            onClick={() => navigate(`/plunder-pk?pid0=${planetId}`)}
            padding={0}
            width='50px'
          >
            <Text fontSize='20px'>战斗测试</Text>
          </Button>
        </Box>
        <PreviewList
          race={race}
          game={game}
          disableClick={activeStep === 5 && stepsEnabled}
          disableDrag={activeStep === 2 && stepsEnabled}
          activeSoldier={activeSoldier}
          onDrag={() => {
            console.log(121221);
            setArrowShow(false);
          }}
        />
      </Box>
      {arrowShow && (
        <ArrowBox
          position='absolute'
          top={400}
          left={100}
          width={200}
          height={200}
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
