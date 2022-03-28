import React from 'react';
import { Box, Text, BgCard, Flex, TweenText } from 'uikit';
import { Link } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { MysteryBoxCom } from 'components/MysteryBoxCom';

const MysteryBox = () => {
  return (
    <Layout>
      <Dashboard>
        <BgCard variant='short'>
          <Flex alignItems='center' height='100%' width='100%'>
            <TweenText
              width='100%'
              textAlign='center'
              fontSize='22px'
              to='您还没有一个星球，请先获得一个星球开始星球之旅'
              shadow='primary'
            />
          </Flex>
        </BgCard>
      </Dashboard>
      <Flex margin='auto' width='80%' justifyContent='space-between'>
        <Link to={`/mystery-box/state?q=${'ordinary'}`}>
          <MysteryBoxCom quality='ordinary' />
        </Link>
        <Link to={`/mystery-box/state?q=${'advanced'}`}>
          <MysteryBoxCom quality='advanced' />
        </Link>
        <Link to={`/mystery-box/state?q=${'super'}`}>
          <MysteryBoxCom quality='super' />
        </Link>
      </Flex>
    </Layout>
  );
};

export default MysteryBox;
