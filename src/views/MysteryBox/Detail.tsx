import React from 'react';
import styled from 'styled-components';
import { Box, Text, Flex, BgCard, Label, Button } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
} from 'components/MysteryBoxCom';
import StarCom from 'components/StarCom';
import Attributes from './components/Attributes';
import Extra from './components/Extra';

const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;

const MysteryBoxDetail = () => {
  return (
    <Layout>
      <Dashboard />
      <Flex>
        <MysteryBoxStyled>
          <MysteryBoxBaseStyled quality='super' />
          <MysteryBoxStarStyled quality='super'>
            <StarCom variant='none' scale='ld' />
          </MysteryBoxStarStyled>
        </MysteryBoxStyled>
        <BgCard variant='sFull'>
          <Flex pt='38px' pl='53px'>
            <Attributes>
              <Flex mt='32px' justifyContent='center'>
                <Button>管理星球</Button>
              </Flex>
            </Attributes>
            <Extra ml='70px' />
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default MysteryBoxDetail;
