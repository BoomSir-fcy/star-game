import { useTranslation } from 'contexts/Localization';
import React from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { BoxProps, Card, CardProps, Flex, Image, Text } from 'uikit';

const StyledCard = styled(Card)<{ width?: string }>`
  width: ${({ width }) => width || '300px'};
  max-height: 463px;
  justify-content: center;
  align-items: center;
  padding: 46px 20px;
`;
const ItemFlex = styled(Flex)`
  margin-top: 23px;
`;
const ItemInfoFlex = styled(Flex)`
  flex-direction: column;
  margin-left: 23px;
  flex: 1;
`;
const LevelText = styled(Text)`
  flex: 1;
`;
const UpFlex = styled(Flex)`
  flex: 1;
  /* margin-left: 25px; */
`;
const StyledImage = styled(Image)`
  flex-shrink: 0;
`;

interface UpgradeCardProps extends CardProps {
  info: Api.Planet.PlanetInfo;
  width?: string;
  up?: any;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  info,
  width,
  up,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <StyledCard width={width} {...props}>
      <Flex flexDirection='column'>
        <Text bold fontSize='22px' shadow='primary'>
          {!up
            ? t('Current Lv%value% effect', { value: info?.level || '' })
            : t('Lv%value% effect after upgrade', { value: info?.level || '' })}
        </Text>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/star/LV.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              {t('Building grade up limit')}
            </Text>
            <Flex
              width='130px'
              justifyContent='space-between'
              alignItems='center'
            >
              <LevelText fontSize='22px'>Lv {info?.level}</LevelText>
              {up && <UpBox value={up?.build_level} />}
            </Flex>
          </ItemInfoFlex>
        </ItemFlex>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/star/HP.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              {t("All buildings' HP")}
            </Text>
            <Flex
              width='130px'
              justifyContent='space-between'
              alignItems='center'
            >
              <LevelText fontSize='22px'>+{info?.hp}</LevelText>
              {up && <UpBox value={up?.hp} />}
            </Flex>
          </ItemInfoFlex>
        </ItemFlex>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/star/defense.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              {t("All buildings' defenses")}
            </Text>
            <Flex
              width='130px'
              justifyContent='space-between'
              alignItems='center'
            >
              <LevelText fontSize='22px'>+{info?.defense}</LevelText>
              {up && <UpBox value={up?.defense} />}
            </Flex>
          </ItemInfoFlex>
        </ItemFlex>
      </Flex>
    </StyledCard>
  );
};

const UpBox: React.FC<{ value?: number }> = ({ value }) => {
  return (
    <UpFlex>
      <StyledImage width={33} height={33} src='/images/commons/icon/up.png' />
      <Text fontSize='22px' color='up'>
        {value || '0'}
      </Text>
    </UpFlex>
  );
};
