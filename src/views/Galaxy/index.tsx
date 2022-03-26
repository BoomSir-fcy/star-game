import React from 'react';
import { BgCard, Flex, Text, Box, Card } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import Nav from 'components/Nav';
import styled from 'styled-components';
import { galaxyList } from './config';

const StyledCard = styled(Card)`
  width: 977px;
  height: 476px;
  padding: 50px;
`;
const Galaxy = () => {
  return (
    <Layout>
      <Dashboard />
      <Flex alignItems='center'>
        <Nav nav={galaxyList} mr='24px' />
        <BgCard padding='30px' variant='medium' fringe>
          <Flex alignItems='center'>
            <Box>星云</Box>
            <StyledCard>
              <Flex flexDirection='column'>
                <Text>
                  恒星数:50个（已被占领：5） 星系主:无(可竞拍获得)
                  星系奖励:10000 STAR（每UTC 24点派发） 剩余可领取奖励时间(UTC
                  24):10h:10m:10s
                </Text>
              </Flex>
            </StyledCard>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default Galaxy;
