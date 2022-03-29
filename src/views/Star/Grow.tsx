import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Card, BgCard, Text, Button, Label } from 'uikit';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import ScoringPanel from 'components/ScoringPanel';
import StarCom from 'components/StarCom';
import InfoPlane from './components/grow/InfoPlane';
import Extra from './components/grow/Extra';

const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;

const TopBox = styled(Box)`
  height: 81px;
`;

const Grow = () => {
  return (
    <Box>
      <BgCard variant='big' padding='50px 33px'>
        <Flex>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality={mysteryBoxQualities.SUPER} />
            <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
              <StarCom variant='none' scale='ld' />
            </MysteryBoxStarStyled>
          </MysteryBoxStyled>
          <Flex>
            <Box>
              <TopBox>
                <ScoringPanel count={2} />
              </TopBox>
              <InfoPlane />
            </Box>
            <Box ml='27px'>
              <TopBox>
                <Button>开始培育</Button>
              </TopBox>
              <Extra />
            </Box>
          </Flex>
        </Flex>
      </BgCard>
    </Box>
  );
};

export default Grow;
