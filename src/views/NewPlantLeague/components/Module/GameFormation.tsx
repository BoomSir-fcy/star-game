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
  LoadPlanet: Api.Planet.PlanetInfo[];
  addLoadPlanet: () => void;
}> = ({ planetInfo, LoadPlanet, addLoadPlanet }) => {
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const { screenMode } = useStore(p => p.user);
  const { plantUnits } = useStore(p => p.game);

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

  useFetchGamePK();
  useFetchGamePlanetUnits(planetInfo.id);

  const race = useMemo(() => {
    return planetInfo?.race as Api.Game.race;
  }, [planetInfo]);

  useFetchUnitList(race, planetInfo?.id);

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
        item?.barracks === 1 && item?.probability === -1 ? '6' : item?.count
      }`;
    },
    [activeNum],
  );

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[]) => {
      poses.forEach(item => {
        game.createSoldier(
          item.pos.x,
          item.pos.y,
          {
            srcId: `${item?.base_unit.index}`,
            race,
            id: item.base_unit_id,
            unique_id: item.base_unit_id,
            unitInfo: { ...item?.base_unit },
            activeCountText: UseSoldierNum(item?.base_unit),
            noHp: true,
          },
          false,
        );
      });
    },
    [race, game, UseSoldierNum],
  );

  useEffect(() => {
    // 更新棋盘上显示的士兵可摆放数量
    if (gameSoldiers.length && plantUnits[planetInfo.id]) {
      gameSoldiers.forEach(item => {
        const unitInfoObj = plantUnits[planetInfo.id].filter(
          obj => obj?.base_unit?.unique_id === item?.soldier?.unique_id,
        );

        item.soldier.upDateActiveCountText(
          UseSoldierNum(unitInfoObj[0].base_unit),
        );
      });
    }
  }, [plantUnits, planetInfo.id, gameSoldiers, UseSoldierNum]);

  useEffect(() => {
    if (plantUnits[planetInfo.id] && game.soldiers.length === 0 && CanCreate) {
      createSoldiers(plantUnits[planetInfo.id]);
      setSortSoldiers(game.soldiers);

      addLoadPlanet();
    }
  }, [
    plantUnits,
    planetInfo.id,
    createSoldiers,
    setSortSoldiers,
    game,
    CanCreate,
    addLoadPlanet,
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
