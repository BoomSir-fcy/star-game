import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, GraphicsCard } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state';
import useGame from 'game/hooks/useGame';
import {
  useFetchGamePK,
  useFetchGamePlanetUnits,
  useFetchUnitList,
} from 'state/game/hooks';
import useUpdatePos from 'views/Star/Embattle/hooks/useUpdatePos';
import { useDispatch } from 'react-redux';
import { setEmptyUnits } from 'state/game/reducer';

const GameFormation: React.FC<{
  planetInfo: Api.Planet.PlanetInfo;
}> = ({ planetInfo }) => {
  useFetchGamePK();
  useFetchGamePlanetUnits(planetInfo.id);
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const { screenMode } = useStore(p => p.user);
  const { plantUnits } = useStore(p => p.game);
  const baseUnits = useStore(p => p.game.baseUnits);

  const [CanCreate, setCanCreate] = useState(false);

  const game = useGame({
    width: 316,
    height: 276,
    enableDrag: false,
    scale: 0.5,
    offsetStartX: 250,
    offsetStartY: -50,
  });

  useEffect(() => {
    dispatch(setEmptyUnits({}));
    setTimeout(() => {
      setCanCreate(true);
    }, 100);
  }, [dispatch]);

  useEffect(() => {
    game.creatTerrain(4, 8); // 创建地形
  }, [game]);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref, game]);

  const { gameSoldiers, setSortSoldiers, handleUpdate } = useUpdatePos(
    planetInfo.id,
    game,
  );

  const activeNum = useCallback(
    id => {
      return gameSoldiers.filter(item => item.soldier.id === id)?.length || 0;
    },
    [gameSoldiers],
  );

  const UseSoldierNum = useCallback(
    (item: Api.Game.UnitInfo) => {
      return `${activeNum(item?.unique_id)}/${
        item?.default_unit ? '6' : item?.count
      }`;
    },
    [activeNum],
  );

  const race = useMemo(() => {
    return planetInfo?.race as Api.Game.race;
  }, [planetInfo]);

  useFetchUnitList(race, planetInfo?.id);

  const unitMaps = useMemo(() => {
    if (baseUnits[race]) return baseUnits[race];
    return null;
  }, [baseUnits, race]);

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[]) => {
      poses.forEach(item => {
        game.createSoldier(
          item.pos.x,
          item.pos.y,
          {
            srcId: `${unitMaps?.[item.base_unit_id]?.index}`,
            race,
            id: item.base_unit_id,
            unique_id: item.base_unit_id,
            unitInfo: { ...unitMaps?.[item.base_unit_id], hp: 0 },
            activeCountText: UseSoldierNum(unitMaps?.[item.base_unit_id]),
          },
          false,
        );
      });
    },
    [unitMaps, race, game, UseSoldierNum],
  );

  useEffect(() => {
    // 更新棋盘上显示的士兵可摆放数量
    if (gameSoldiers.length && plantUnits[planetInfo.id] && unitMaps) {
      gameSoldiers.forEach(item => {
        item.soldier.upDateActiveCountText(
          UseSoldierNum(unitMaps?.[item.soldier.unique_id]),
        );
      });
    }
  }, [plantUnits, planetInfo.id, gameSoldiers, unitMaps, UseSoldierNum]);

  useEffect(() => {
    if (
      plantUnits[planetInfo.id] &&
      unitMaps &&
      game.soldiers.length === 0 &&
      CanCreate
    ) {
      createSoldiers(plantUnits[planetInfo.id]);
      setSortSoldiers(game.soldiers);
    }
  }, [
    plantUnits,
    planetInfo.id,
    unitMaps,
    createSoldiers,
    setSortSoldiers,
    game,
    CanCreate,
  ]);

  return (
    <Box position='relative' width={316} height={276}>
      <Box
        position='absolute'
        top={screenMode ? 0 : (276 - 316) / 2}
        left={screenMode ? 0 : (316 - 276) / 2}
        className={screenMode ? '' : 'reverse-rotate'}
        ref={ref}
      />
    </Box>
  );
};

export default GameFormation;
