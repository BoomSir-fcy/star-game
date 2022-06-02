import React from 'react';
import styled from 'styled-components';
import { Box, Text, Flex, BoxProps, Label, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { StrengthenConsumeType } from './type';

export const ExtraLabelStyled = styled(Label)`
  width: 32%;
  height: 80px;
  padding-left: 10px;
  margin-bottom: 20px;
`;

const Extra: React.FC<{
  info: StrengthenConsumeType;
}> = ({ info }) => {
  const { t } = useTranslation();
  const { estimate_buff, now_buff } = info;

  return (
    <Flex flexWrap='wrap' alignItems='center' justifyContent='space-between'>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('HP')} : {now_buff.hp}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.hp}
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('Attack')} {now_buff.attack}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.attack}
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('Hit')} {now_buff.hit}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.hit}
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('Speed')} {now_buff.speed}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.speed}
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('Miss')} {now_buff.miss}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.miss}
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('Crit')} {now_buff.critical}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.critical}
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='20px'>
            {t('Defense')} {now_buff.defense}
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='20px' color='up'>
            +{estimate_buff.defense}
          </Text>
        </Flex>
      </ExtraLabelStyled>
    </Flex>
  );
};

export default Extra;
