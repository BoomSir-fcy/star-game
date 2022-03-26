import React from 'react';
import dayjs from 'dayjs';
import { CountdownTime } from 'components';
import styled from 'styled-components';
import { Box, Text, Flex, Card } from 'uikit';
import { UpgradeCard } from '.';

const TimeCard = styled(Card)`
  width: 600px;
  padding: 20px 40px;
  margin-bottom: 15px;
`;
export const Upgrading = () => {
  return (
    <Flex justifyContent='space-around' alignItems='center'>
      <Box width='320px' mr='50px'>
        <Text>漂浮的星球</Text>
      </Box>
      <Flex flexDirection='column'>
        <TimeCard>
          <Flex flexDirection='column' justifyContent='space-between'>
            <Flex mb='35px' justifyContent='space-between'>
              <Text fontSize='28px' shadow='primary'>
                星球升级中
              </Text>
              <Text fontSize='24px' color='textTips'>
                Countdown Time
              </Text>
            </Flex>
            <CountdownTime endTime={dayjs('2022-03-26 18:00:00').unix()} />
          </Flex>
        </TimeCard>
        <UpgradeCard width='100%' />
      </Flex>
    </Flex>
  );
};
