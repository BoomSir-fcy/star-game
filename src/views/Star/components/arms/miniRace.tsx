import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'uikit';
import useGame from 'game/hooks/useGame';
import { MapBaseUnits } from 'game/types';

import Running, { RoundsProps } from 'game/core/Running';
import { useStore } from 'state';

const Container = styled(Box)<{ show: boolean }>`
  position: absolute;
  border: 4px solid #f9feff;
  box-shadow: 0px 0px 10px 2px #41b7ff;
  background-color: #161920;
  width: 250px;
  height: 250px;
  /* top: 0; */
  transition: 0.3s all;
  transform: translateX(-254px);
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`;

const GridWidth = 240;
const GridHeight = 240;

interface MiniRaceAniProps extends BoxProps {
  mock: any;
  show: boolean;
  scale?: number;
}

const MiniRaceAni: React.FC<MiniRaceAniProps> = ({
  scale,
  mock,
  show,
  ...props
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const game = useGame({
    width: GridWidth,
    height: GridHeight,
    enableDrag: false,
    scale: 0.5,
    offsetStartX: 100,
    offsetStartY: 100,
  });

  const [running, setRunning] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [resLoaded, setResLoaded] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     game.app.stage.scale.set(0.8);
  //   }, 2000);
  // }, [game]);

  const createSoldiers = React.useCallback(
    (
      poses: Api.Game.UnitPlanetPos[],
      base: MapBaseUnits,
      ids: { [xy: string]: string },
      isEnemy: boolean,
    ) => {
      poses?.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${base[item.base_unit_id]?.index}`,
          race: base[item.base_unit_id]?.race || 1,
          id: item.base_unit_id,
          sid: ids[`${item.pos.x}${item.pos.y}`],
          hp: base[item.base_unit_id]?.hp,
          isEnemy,
          enableDrag: false,
          unique_id: item.base_unit_id,
          unitInfo: base[item.base_unit_id],

          // attackId: base[item.base_unit_id].unique_id
        });
      });
    },
    [game],
  );

  const runGame = useCallback(
    (slot: RoundsProps) => {
      const run = new Running(game, slot);
      setRunning(run);
      run.run();
    },
    [game, setRunning],
  );

  const initSoldiers = React.useCallback(
    _mock => {
      const ids: { [xy: string]: string } = {};

      if (_mock?.init) {
        Object.keys(_mock?.init?.ids).forEach(id => {
          const { x, y } = _mock?.init?.ids[id];
          ids[`${x}${y}`] = id;
        });
        game.once('lastSoldierCreated', () => {
          runGame({ round: _mock.slot });
        });
        createSoldiers(_mock.init.blue_units, _mock.init.base_unit, ids, false);
        createSoldiers(_mock.init.red_units, _mock.init.base_unit, ids, true);
      }
    },
    [createSoldiers, runGame, game],
  );

  const getCenterByAxis = useCallback(
    (x: number, y: number) => {
      const axis = game.getAxis(x, y);
      if (axis) {
        game.boards.setPosiotion(-axis.x - 30, -axis.y + 60);
      }
    },
    [game],
  );

  const initHandle = useCallback(() => {
    // running?.pause();
    game.clearSoldier();
    initSoldiers(mock);
    getCenterByAxis(
      mock?.init?.blue_units[0].pos.x,
      mock?.init?.blue_units[0].pos.y,
    );
  }, [mock, getCenterByAxis, initSoldiers, game]);

  React.useEffect(() => {
    if (ref.current && !loaded) {
      ref.current.appendChild(game.view);
      game.creatTerrain();
      setLoaded(true);
    }
  }, [ref, game, setLoaded, loaded]);

  React.useEffect(() => {
    const loaders = game.loadResources();
    loaders.addEventListener('complete', () => {
      setResLoaded(true);
    });
  }, [setResLoaded, game]);

  React.useEffect(() => {
    if (loaded && mock?.init && resLoaded) {
      initHandle();
    }
  }, [mock, loaded, game, resLoaded, initHandle]);

  // 更新
  const onRunningUpdate = useCallback(event => {
    // console.log(event);
    // if (event.detail?.currentAxisPoint) {
    //   getCenterByAxis(
    //     event.detail?.currentAxisPoint.x,
    //     event.detail?.currentAxisPoint.y,
    //   );
    // }
  }, []);
  const [timer, setTimer] = useState(null);

  // 结束
  const onRunEnd = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        initHandle();
      }, 1000),
    );
  }, [initHandle, timer]);

  React.useEffect(() => {
    if (running) {
      // running.addEventListener('updateTrack', onRunningUpdate);
      running.addEventListener('runEnd', onRunEnd);
    }
    return () => {
      if (running) {
        // running.removeEventListener('updateTrack', onRunningUpdate);
        running.removeEventListener('runEnd', onRunEnd);
      }
    };
  }, [running, onRunEnd]);

  // React.useEffect(() => {
  //   return () => {
  //     game.clearSoldier();
  //   };
  // }, [mock, game]);
  const { screenMode } = useStore(p => p.user);

  return (
    <Container show={show} className='star-embattle-step3' {...props}>
      <Box className={screenMode ? '' : 'reverse-rotate'} ref={ref} />
    </Container>
  );
};

export default React.memo(MiniRaceAni);
