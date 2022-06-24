import React from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Flex, Box, Button, MarkText, Text, Image } from 'uikit';

import { useTranslation } from 'contexts/Localization';

const Container = styled(Box)`
  position: relative;
  height: auto;
  padding: 45px 20px 40px;
  border-top: 2px solid #4ffffb;
  background: linear-gradient(0deg, #1f5758 0%, #102426 100%);
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
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
    background-size: 7px 7px;
  }
`;
const Content = styled(Box)`
  position: relative;
  z-index: 2;
`;
const Items = styled(Flex)`
  width: 50%;
`;

export const BuildingUpgrade: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  const { t } = useTranslation();
  const planetAssets = useStore(p => p.buildling.planetAssets);
  const balanceList = useStore(p => p.userInfo.userBalance);

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}h:${min}m:${sec}s`;
  };

  const TokenBlance = React.useCallback(
    (Token: string) => {
      const balance = balanceList.filter(item => {
        return item.symbol === Token;
      });
      return balance[0];
    },
    [balanceList],
  );

  return (
    <Container>
      <Content>
        <Flex width='100%' justifyContent='space-between' alignItems='center'>
          <Flex alignItems='center'>
            <MarkText bold fontSize='18px' fontStyle='normal'>
              {t('upgradeRequirements')}
            </MarkText>
            <Flex alignItems='center' ml='30px' mt='4px'>
              <Text shadow='primary' bold fontSize='14px'>
                Lv {currnet_building?.propterty?.levelEnergy}
              </Text>
              <>
                <Box width='21px' height='17px' margin='0 5px'>
                  <Image
                    src='/images/commons/icon/icon-upgrade.png'
                    width={47}
                    height={40}
                  />
                </Box>
                <Text shadow='primary' bold fontSize='14px'>
                  Lv {currnet_building?.propterty?.levelEnergy + 1}
                </Text>
              </>
            </Flex>
          </Flex>
          <Text textAlign='right'>
            {t('TimeCnsumingBuild', {
              time: formatTime(currnet_building?.upgrade_need?.upgrade_time),
            })}
          </Text>
        </Flex>
        <Flex width='100%' mt='20px' flexDirection='column'>
          <Flex
            alignItems='center'
            justifyContent='space-between'
            width='100%'
            mb='13px'
          >
            <Items alignItems='center'>
              <Text>{t('EnergyRequiredBuild')}</Text>
              <Text
                color={`${
                  planetAssets?.energy <
                  currnet_building?.upgrade_need?.upgrade_energy
                    ? 'warning'
                    : 'progressGreenBar'
                }`}
              >
                {currnet_building?.upgrade_need?.upgrade_energy}
              </Text>
              <Text>/{planetAssets?.energy}</Text>
            </Items>
            <Items alignItems='center' justifyContent='flex-end'>
              <Text>{t('OreRequiredConstruction')}</Text>
              <Text
                color={`${
                  planetAssets?.stone <
                  currnet_building?.upgrade_need?.upgrade_stone
                    ? 'warning'
                    : 'progressGreenBar'
                }`}
              >
                {currnet_building?.upgrade_need?.upgrade_stone}
              </Text>
              <Text>/{planetAssets?.stone}</Text>
            </Items>
          </Flex>

          <Flex alignItems='center' justifyContent='space-between' width='100%'>
            <Items alignItems='center'>
              <Text>{t('SpicesNeededToBuild')}</Text>
              <Text
                color={`${
                  planetAssets?.population <
                  currnet_building?.upgrade_need?.upgrade_population
                    ? 'warning'
                    : 'progressGreenBar'
                }`}
              >
                {currnet_building?.upgrade_need?.upgrade_population}
              </Text>
              <Text>/{planetAssets?.population}</Text>
            </Items>
            <Items alignItems='center' justifyContent='flex-end'>
              <Text>{t('BuildRequiredBOX')}</Text>
              <Text
                color={`${
                  planetAssets?.stone <
                  currnet_building?.upgrade_need?.upgrade_box
                    ? 'warning'
                    : 'progressGreenBar'
                }`}
              >
                {currnet_building?.upgrade_need?.upgrade_box}
              </Text>
              <Text>/{TokenBlance('BOX')?.amount}</Text>
            </Items>
          </Flex>
        </Flex>
        <Flex justifyContent='center' mt='34px'>
          <Button width='226px' height='53px' variant='purple'>
            <Text bold fontSize='16px' color='#4FFFFB'>
              建筑升级
            </Text>
          </Button>
        </Flex>
      </Content>
    </Container>
  );
};
