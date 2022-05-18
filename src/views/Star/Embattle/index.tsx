import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Flex } from 'uikit';
import { useGuide } from 'hooks/useGuide';
import { Api } from 'apis';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
  useFetchGameTerrain,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import useGame from 'game/hooks/useGame';
import { useStore } from 'state';
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard, { SortSoldier } from './components/SortBoard';
import useUpdatePos from './hooks/useUpdatePos';
import useActiveSoldier from './hooks/useActiveSoldier';

// const game = new Game();

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const navigate = useNavigate();

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

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [steps, setSteps] = useState([
    {
      element: '.star-embattle-step0',
      intro:
        '战斗布阵界面，敌我双方分为两个作战区域，用策略部署战斗单位，达到胜利。',
    },
    {
      element: '.star-embattle-step1',
      intro: '这是你当前可以上阵的战斗单位列表。',
    },
    {
      element: '.star-embattle-step2',
      intro: '点击了解战斗单位详情。',
    },
    {
      element: '.star-embattle-step3',
      intro: '当前战斗单位的作战示意动画，可以了解其作战方式。',
    },
    {
      element: '.star-embattle-step4',
      intro: '当前战斗单位的基础属性和能力蛛网图， 可以通过升级提升能力。',
    },
    {
      element: '.star-embattle-step5',
      intro:
        '现在开始布阵，拖住战斗单位放置我方作战区域上，合理的部署位置才是只剩关键。',
    },
    {
      element: '.star-embattle-step6',
      intro: '好了，部署结束!这里是作战时的攻击顺序。',
    },
  ]);

  return (
    <Box position='relative'>
      {guides.finish && steps.length - 1 > guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
            tooltipPosition: 'top',
          }}
          onBeforeChange={event => {
            console.log(event);
          }}
          onExit={() => {
            setStepsEnabled(false);
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
        <PreviewList race={race} game={game} activeSoldier={activeSoldier} />
      </Box>
    </Box>
  );
};

export default Embattle;
