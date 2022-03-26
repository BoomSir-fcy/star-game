import React from 'react';
import styled, { css } from 'styled-components';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { StarGrid } from 'components';

import { GameModal } from './components';

const CardTab = styled(Card)`
  width: 227px;
  padding: 6px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  background-image: linear-gradient(
    45deg,
    rgba(31, 34, 40, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(31, 34, 40, 0.5) 50%,
    rgba(31, 34, 40, 0.5) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
`;

const TabsButton = styled(Button)<{ active?: boolean }>`
  width: 213px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  line-height: 20px;
  ${({ active }) =>
    active &&
    css`
      background: url(/images/commons/btn/B4.png) no-repeat;
    `}
`;

const Upgrade = () => {
  const [state, setState] = React.useState({
    box: [
      {
        index: 1,
        row: 2,
        bgColor: 'red',
      },
      {
        index: 2,
        row: 1,
        bgColor: 'green',
      },
      {
        index: 3,
        row: 1,
        bgColor: 'blue',
      },
      {
        index: 4,
        row: 1,
        bgColor: 'yellow',
      },
      {
        index: 5,
        row: 1,
        bgColor: 'orange',
      },
      {
        index: 6,
        row: 1,
        bgColor: 'grey',
      },
    ],
  });

  console.log(state.box);

  return (
    <Box>
      <Flex>
        <StarGrid
          data={state.box}
          onLayoutChange={() => {}}
          items={9}
          cols={3}
        />
        <Box>
          <Text>111</Text>
        </Box>
      </Flex>

      <BgCard variant='long' mt='12px' padding='40px'>
        <Flex>
          <Flex flexDirection='column'>
            <CardTab>
              <TabsButton active variant='text'>
                经营类
              </TabsButton>
              <TabsButton variant='text'>战斗类</TabsButton>
            </CardTab>
            <Text mt='13px' small>
              拖动建筑到需要的格子上
            </Text>
          </Flex>
          <Box ml='40px'>
            <GameModal scale='sm' />
          </Box>
        </Flex>
      </BgCard>
    </Box>
  );
};

export default Upgrade;
