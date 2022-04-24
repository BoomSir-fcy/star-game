import React from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';

import Game from 'game/core/Game';
import RunSimulation from 'game/core/RunSimulation';

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
const MiniRaceAni = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
      const run = new RunSimulation(game, {
        1: {
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
              // @ts-ignore
              firing: {
                sender_id: 'kkkk',
                receive_id: 'kkkk',
                long_round: 1,
                receive_sub_hp: 30,
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
      });
      console.log(run);
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
