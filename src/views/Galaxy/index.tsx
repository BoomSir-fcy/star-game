import React from 'react';
import { Link } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import Nav from 'components/Nav';
import { BgCard, Flex, Text, Button, Card, Image } from 'uikit';
import styled from 'styled-components';
import { galaxyList } from './config';

const StyledCard = styled(Card)`
  width: 977px;
  height: 476px;
  margin-left: 40px;
  padding: 56px 67px;
`;
const Galaxy = () => {
  return (
    <Layout>
      <Dashboard />
      <Flex alignItems='center'>
        <Nav nav={galaxyList} mr='24px' />
        <BgCard padding='30px' variant='medium' fringe>
          <Flex alignItems='center'>
            <Image width={516} height={516} src='/images/commons/star/1.png' />
            <StyledCard>
              <Flex flexDirection='column' justifyContent='space-between'>
                <Flex flexDirection='column'>
                  <Text fontSize='24px'>恒星数:50个（已被占领：5） </Text>
                  <Text mt='10px' fontSize='24px'>
                    星系主:无(可竞拍获得)
                  </Text>
                  <Text mt='10px' fontSize='24px'>
                    星系奖励:10000 STAR（每UTC 24点派发）{' '}
                  </Text>
                  <Text mt='10px' fontSize='24px'>
                    剩余可领取奖励时间(UTC 24):10h:10m:10s
                  </Text>
                </Flex>
                <Flex mt='100px' justifyContent='space-between'>
                  <Button as={Link} to='/galaxy/auction'>
                    星系竞拍
                  </Button>
                  <Button as={Link} to='/galaxy/stars'>
                    占领恒星
                  </Button>
                </Flex>
              </Flex>
            </StyledCard>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default Galaxy;
