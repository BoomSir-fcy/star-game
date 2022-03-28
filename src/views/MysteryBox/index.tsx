import React from 'react';
import { Box, Text, BgCard, Flex, TweenText } from 'uikit';
import { Link } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { MysteryBoxCom, mysteryBoxQualities } from 'components/MysteryBoxCom';
import { useFetchBoxView } from 'state/mysteryBox/hooks';

const MysteryBox = () => {
  useFetchBoxView();
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
        <Link to={`/mystery-box/state?q=${mysteryBoxQualities.ORDINARY}`}>
          <MysteryBoxCom quality={mysteryBoxQualities.ORDINARY} />
        </Link>
        <Link to={`/mystery-box/state?q=${mysteryBoxQualities.ADVANCED}`}>
          <MysteryBoxCom quality={mysteryBoxQualities.ADVANCED} />
        </Link>
        <Link to={`/mystery-box/state?q=${mysteryBoxQualities.SUPER}`}>
          <MysteryBoxCom quality={mysteryBoxQualities.SUPER} />
        </Link>
      </Flex>
    </Layout>
  );
};

export default MysteryBox;
