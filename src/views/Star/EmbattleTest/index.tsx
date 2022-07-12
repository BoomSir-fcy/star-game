import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Flex } from 'uikit';
import { Api } from 'apis';
import { isAppAndVerticalScreen } from 'utils/detectOrient';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
  useFetchGamePlanetUnitsTest,
  useFetchGameTerrain,
  useFetchTestUnitList,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { OptionProps, Select } from 'components/Select';
import { useStore } from 'state';
import useGame from 'game/hooks/useGame';
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard, { SortSoldier } from './components/SortBoard';
import useUpdatePos from './hooks/useUpdatePos';
import useActiveSoldier from './hooks/useActiveSoldier';
import useSimulation from './hooks/useSimulation';
import { ArmsInfo } from '../components/arms';

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const game = useGame({ test: true });

  const navigate = useNavigate();

  // const race = Number(parsedQs.race) as Api.Game.race;
  useFetchGameTerrain();
  useFetchGamePK();
  useFetchGamePlanetUnits(planetId);
  useFetchGamePlanetUnitsTest(planetId);

  const { setSimulation } = useSimulation();

  const { TerrainInfo, plantUnits } = useStore(p => p.game);
  const testPlantUnits = useStore(p => p.game.testPlantUnits);
  const planetInfo = useStore(p => p.planet.planetInfo);

  const terrainSelect: OptionProps[] = useMemo(() => {
    if (TerrainInfo?.length) {
      return TerrainInfo.map((item, index) => ({
        value: index,
        label: item.map_name,
        id: item.map_id,
      }));
    }
    return [];
  }, [TerrainInfo]);

  const [activeTerrain, setActiveTerrain] = useState(terrainSelect[0]);

  const info = useMemo(() => {
    return planetInfo[planetId];
  }, [planetInfo, planetId]);

  const race = info?.race as Api.Game.race;
  // useFetchUnitList(race, info?.id);
  useFetchTestUnitList(race);

  const baseUnits = useStore(p => p.game.baseUnits);

  const unitMaps = useMemo(() => {
    if (baseUnits[race]) return baseUnits[race];
    return null;
  }, [baseUnits, race]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && game.view) {
      ref.current.appendChild(game.view);
    }
  }, [ref, game.view]);

  const { gameSoldiers, setSortSoldiers } = useUpdatePos(planetId, game);

  const activeSoldier = useActiveSoldier(game);

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[], isEnemy?: boolean) => {
      poses.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${unitMaps?.[item.base_unit_id]?.index}`,
          race,
          id: item.base_unit_id,
          unique_id: item.base_unit_id,
          unitInfo: unitMaps?.[item.base_unit_id],
          isEnemy,
          test: true,
        });
      });
    },
    [unitMaps, race, game],
  );

  useEffect(() => {
    if (
      testPlantUnits[`t-${planetId}`] &&
      unitMaps &&
      game.soldiers.length === 0
    ) {
      createSoldiers(testPlantUnits[`t-${planetId}`].units1, false);
      createSoldiers(testPlantUnits[`t-${planetId}`].units2, true);
      setSortSoldiers(game.soldiers);
    }
  }, [
    testPlantUnits,
    planetId,
    unitMaps,
    createSoldiers,
    setSortSoldiers,
    game,
  ]);

  useEffect(() => {
    if (ref.current && isAppAndVerticalScreen()) {
      ref.current.style.transform = 'rotate(-90deg)';
      ref.current.style.touchAction = 'none';
      game.boards.container.rotation = Math.PI / 2;
    }
    if (TerrainInfo?.length) {
      game.creatTerrain();
    } else {
      game.creatTerrain();
    }
  }, [activeTerrain, ref, TerrainInfo, game]);

  const removeHandle = useCallback(() => {
    if (activeSoldier) {
      game.removeSoldier(activeSoldier);
    }
  }, [activeSoldier, game]);

  return (
    <Box position='relative' width='100%'>
      <Box ref={ref} />
      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        right='18px'
      >
        {/* <Preview game={game} activeSoldier={activeSoldier} /> */}
        {/* <SortBoard
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
      <ArmsInfo
        armsData={{ game_base_unit: activeSoldier?.options?.unitInfo }}
        sid={activeSoldier?.options?.unitInfo?.number}
        right='0'
        removeHandle={removeHandle}
      />
      <Box
        style={{ userSelect: 'none' }}
        position='absolute'
        top='490px'
        left='0'
      >
        <Flex alignItems='center' position='absolute' top='-80px'>
          <Button onClick={() => game.clearSoldier()} padding={0} width='50px'>
            <Text fontSize='20px'>清空</Text>
          </Button>
          <Button
            onClick={() =>
              navigate(
                `/plunder-test?pid0=${planetId}&terrain=${
                  activeTerrain?.id
                    ? JSON.stringify(activeTerrain)
                    : JSON.stringify(
                        terrainSelect[0] || {
                          label: '',
                          value: 0,
                          id: 0,
                        },
                      )
                }`,
              )
            }
            padding={0}
            width='50px'
          >
            <Text fontSize='20px'>战斗测试</Text>
          </Button>
          <Button
            padding={0}
            width='50px'
            onClick={() => setSimulation(gameSoldiers)}
          >
            <Text fontSize='20px'>动画模拟</Text>
          </Button>
          <Select
            options={terrainSelect}
            defaultId={0}
            onChange={option => {
              setActiveTerrain(option);
            }}
          />
        </Flex>
        <PreviewList race={race} game={game} activeSoldier={activeSoldier} />
      </Box>
    </Box>
  );
};

export default Embattle;
