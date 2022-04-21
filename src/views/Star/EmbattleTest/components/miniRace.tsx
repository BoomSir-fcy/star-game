import React from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';

import Game from 'game/core/Game';
import Running, { RoundsProps } from 'game/core/Running';

const Container = styled(Box)`
  position: absolute;
  border: 4px solid #f9feff;
  box-shadow: 0px 0px 10px 2px #41b7ff;
  background-color: #161920;
  width: 208px;
  height: 208px;
  top: 0;
  transition: 0.3s all;
  transform: translateX(-215px);
`;

// 种族动画预览
const game = new Game({
  width: 200,
  height: 200,
  test: true,
  enableDrag: false,
});
const running = new Running(
  game,
  {
    1: {
      data: [
        // @ts-ignore
        {
          round: 1,
          desc_type: 2,
          move: {
            id: 'aaaa',
            starting_point: {
              x: 2,
              y: 3,
            },
            dest: [
              {
                x: 5,
                y: 5,
              },
              {
                x: 5,
                y: 4,
              },
            ],
          },
        },
      ],
    },
    2: {
      data: [
        // @ts-ignore
        {
          round: 1,
          desc_type: 7,
          add_firing: {
            sender_id: 'aaaa',
            receive_id: 'kkkk',
            sender_point: {
              x: 4,
              y: 5,
            },
            receive_point: {
              x: 5,
              y: 4,
            },
            firing_hp: 40,
            around: [
              // @ts-ignore
              {
                receive_id: 'kkkk',
                receive_point: {
                  x: 5,
                  y: 4,
                },
              },
            ],
          },
        },
        {
          round: 1,
          desc_type: 8,
          firing: {
            sender_id: 'kkkk',
            receive_id: 'kkkk',
            long_round: 1,
            receive_sub_hp: 40,
            receive_point: {
              x: 5,
              y: 4,
            },
            // @ts-ignore
            now_hp: 960,
          },
        },
      ],
    },
  },
  true,
);
const MiniRaceAni = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
      game.createSoldier(4, 5, {
        srcId: '2',
        race: 2,
        id: 1,
        unique_id: 3,
        hp: 100,
        isEnemy: false,
        enableDrag: false,
        sid: 'aaaa',
      });
      game.createSoldier(4, 4, {
        srcId: '1',
        race: 1,
        id: 1,
        unique_id: 1,
        hp: 100,
        isEnemy: true,
        enableDrag: false,
        sid: 'kkkk',
      });
      // const [s0, s1] = game.soldiers;
      // if (s0 && s1) {
      //   s0.attackParabolaEffect(s1, 'ice');
      // }
      running?.changePlayCount(-1);
    }
  }, [ref]);

  React.useEffect(() => {
    return () => {
      game.clearSoldier();
    };
  });

  return (
    <Container>
      <Box ref={ref} />
    </Container>
  );
};

export default MiniRaceAni;
