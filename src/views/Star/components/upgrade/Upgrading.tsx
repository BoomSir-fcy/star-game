import React from 'react';
import dayjs from 'dayjs';
import { CountdownTime } from 'components';
import styled from 'styled-components';
import { Box, Text, Flex, Card } from 'uikit';
import StarCom from 'components/StarCom';
import {
  MysteryBoxBaseStyled,
  MysteryBoxStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import { UpgradeCard } from './UpgradeCard';

const TimeCard = styled(Card)`
  width: 600px;
  padding: 20px 40px;
  margin-bottom: 15px;
`;
const MysteryBoxFlexStyled = styled(MysteryBoxStyled)`
  width: 320px;
  height: 366px;
  margin-right: 100px;
  margin-left: -40px;
`;

const MysteryBoxBaseNewStyled = styled(MysteryBoxBaseStyled)`
  bottom: -40px;
`;
const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
  top: 0;
`;

export const Upgrading: React.FC<{
  timePeriod?: number;
  info?: Api.Planet.PlanetInfo;
  up?: any;
}> = ({ timePeriod, info, up }) => {
  return (
    <Flex justifyContent='space-around' alignItems='center'>
      <MysteryBoxFlexStyled>
        <MysteryBoxBaseNewStyled quality={mysteryBoxQualities.SUPER}>
          <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
            <StarCom variant='none' scale='ld' />
          </MysteryBoxStarStyled>
        </MysteryBoxBaseNewStyled>
      </MysteryBoxFlexStyled>
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
            <CountdownTime timePeriod={timePeriod} />
          </Flex>
        </TimeCard>
        <UpgradeCard info={info} up={up} width='100%' />
      </Flex>
    </Flex>
  );
};
