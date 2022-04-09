import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, Flex } from 'uikit';
import { Api } from 'apis';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import {
  RoundInfo,
  RoundDescMove,
  RoundDescAttack,
  MapBaseUnits,
} from 'state/types';

const sleep = (handle: any, delay: number) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      handle();
      res(0);
    }, delay);
  });
};

interface GamePKProps {
  planetId: number;
}
const game = new Game();

const GamePK: React.FC<GamePKProps> = ({ planetId }) => {
  const plantUnits = useStore(p => p.game.plantUnits);
  const PKInfo = useStore(p => p.game.PKInfo);

  useFetchGamePK();
  useFetchUnitList();
  useFetchGamePlanetUnits(planetId);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log(1211);
      ref.current.appendChild(game.view);
    }
  }, [ref]);

  const handleUpdate = useCallback(
    async (soldiers: Soldier[]) => {
      console.log(soldiers);
      const units = soldiers.map((item, index) => {
        return {
          pos: {
            x: item.axisPoint?.chequer?.axisX || 0,
            y: item.axisPoint?.chequer?.axisY || 0,
          },
          speed: index, // 出手顺序
          unit_id: item.id,
        };
      });

      const res = await Api.GameApi.gameUnitSetting({
        units,
        planet_id: planetId,
      });

      console.log(res);
    },
    [planetId],
  );

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', (event: any) => {
      handleUpdate(event.detail.soldiers);
    });
  }, [handleUpdate]);

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[], base: MapBaseUnits, isEnemy: boolean) => {
      poses.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          textureRes: '/assets/flowerTop.png',
          id: item.base_unit_id,
          hp: base[item.base_unit_id].hp,
          isEnemy,
          // attackId: base[item.base_unit_id].unique_id
        });
      });
    },
    [],
  );

  const sleepHandle = useCallback(async (pro: any[], i: number) => {
    sleep(pro[i].handle, pro[i].sleep).then(() => {
      // sleep(pro[1].handle, pro[1].sleep);
      if (i < pro.length - 1) {
        sleepHandle(pro, i + 1);
      }
    });

    // pro.forEach(async item => {
    //   console.log(1);
    //   await sleep(item.handle, item.sleep);
    // });
  }, []);

  const moveHandle = useCallback((track: RoundDescMove) => {
    const axis = game.getAxis(track.starting_point.x, track.starting_point.y);
    if (!axis) return [];
    const soldier = game.findSoldierByAxis(axis);
    if (!soldier) return [];
    const axises = track.dest.map(item => {
      return game.getAxis(item.x, item.y);
    });
    const pro: any[] = [];
    const t = 500;
    axises.forEach(item => {
      if (item) {
        const handle = () => {
          soldier.run();
          soldier.moveTo(item, t);
        };
        pro.push({
          handle,
          sleep: t,
        });
      }
    });

    // sleepHandle(pro, 0);
    return pro;
  }, []);

  const attHandle = useCallback((track: RoundDescAttack) => {
    const handle = () => {
      const senderAxis = game.getAxis(
        track.sender_point.x,
        track.sender_point.y,
      );
      const receiveAxis = game.getAxis(
        track.receive_point.x,
        track.receive_point.y,
      );

      console.log(senderAxis, receiveAxis);
      console.log(game.soldiers);
      console.log(track, 'track');

      if (senderAxis && receiveAxis) {
        const sendSoldier = game.findSoldierByAxis(senderAxis);
        const receiveSoldier = game.findSoldierByAxis(receiveAxis);

        console.log(sendSoldier, 'sendSoldier');
        console.log(receiveSoldier, 'receiveSoldier');
        if (sendSoldier && receiveSoldier) {
          sendSoldier.run();
          sendSoldier.attack();
          receiveSoldier.run();
        }
      }
    };
    return [
      {
        handle,
        sleep: 3000,
      },
    ];
  }, []);

  const runHandle = useCallback(
    (info: RoundInfo[]) => {
      console.log(info, '=info');
      let pro: any[] = [];
      info.forEach(item => {
        // const handle = () => {
        //   // 移动
        //   if (item.desc_type === 2) {
        //     console.log('移动');
        //     // game.soldiers[0].moveTo();
        //     moveHandle(item.move);
        //   }
        //   // 攻击
        //   if (item.desc_type === 3) {
        //     console.log('攻击');
        //   }
        // };
        if (item.desc_type === 2) {
          console.log('移动');
          const handles = moveHandle(item.move);
          pro = [...pro, ...handles];
        }
        if (item.desc_type === 3) {
          console.log('攻击');
          const handles = attHandle(item.attack);
          pro = [...pro, ...handles];
        }
        // pro.push({
        //   handle,
        //   sleep: 1000,
        // })
      });
      sleepHandle(pro, 0);
      // await sleep(process[round].handle, process[round].sleep);

      // process.forEach(async item => {
      //   await sleep(item.handle, item.sleep);
      // });
    },
    [sleepHandle],
  );

  useEffect(() => {
    console.log(PKInfo, 'PKInfo');
    if (PKInfo && game.soldiers.length === 0) {
      createSoldiers(PKInfo.init.blue_units, PKInfo.init.base_unit, false);
      createSoldiers(PKInfo.init.red_units, PKInfo.init.base_unit, true);
      runHandle(PKInfo.slot[1].data);
    }
  }, [PKInfo, createSoldiers, runHandle]);

  console.log(12122121);

  const testHandle = useCallback(() => {
    const axis = game.getAxis(5, 5);
    console.log(axis, game.soldiers[0]);
    if (axis) {
      game.soldiers[0].run();
      game.soldiers[0].moveTo(axis);
    }
  }, []);
  return (
    <Box position='relative'>
      {/* <Button onClick={testHandle}>Test</Button> */}
      <Box ref={ref} />
    </Box>
  );
};

export default React.memo(GamePK);
