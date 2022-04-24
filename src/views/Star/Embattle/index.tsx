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
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
  useFetchGameTerrain,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard, { SortSoldier } from './components/SortBoard';
import useUpdatePos from './hooks/useUpdatePos';
import useActiveSoldier from './hooks/useActiveSoldier';

const game = new Game();

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const navigate = useNavigate();

  // const race = Number(parsedQs.race) as Api.Game.race;
  useFetchGameTerrain();
  useFetchGamePK();
  useFetchGamePlanetUnits(planetId);

  const planetInfo = useStore(p => p.planet.planetInfo);
  const { TerrainInfo, plantUnits } = useStore(p => p.game);

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
  }, [ref]);

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
    [unitMaps, race],
  );

  useEffect(() => {
    if (plantUnits[planetId] && unitMaps && game.soldiers.length === 0) {
      createSoldiers(plantUnits[planetId]);
      setSortSoldiers(game.soldiers);
    }
  }, [plantUnits, planetId, unitMaps, createSoldiers, setSortSoldiers]);

  useEffect(() => {
    if (TerrainInfo?.length) {
      game.creatTerrain(TerrainInfo[0].terrains);
    } else {
      game.creatTerrain([]);
    }
  }, [TerrainInfo]);

  return (
    <Box position='relative'>
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
          <Button onClick={() => game.clearSoldier()} padding={0} width='50px'>
            <Text fontSize='20px'>清空</Text>
          </Button>
          <Button
            onClick={() => navigate(`/plunder-test?pid0=${planetId}`)}
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
