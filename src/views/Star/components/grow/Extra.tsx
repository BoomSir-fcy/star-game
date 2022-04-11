import React from 'react';
import styled from 'styled-components';
import { Box, Text, Flex, BoxProps, Label, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';

export const ExtraLabelStyled = styled(Label)`
  width: 592px;
  height: 80px;
  padding-left: 44px;
`;

const Extra: React.FC<BoxProps> = props => {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='22px'>{t('Defense bonus')}:</Text>
          <Text fontSize='22px'>{t('All building defenses')}+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>{t('Attack bonus')}:</Text>
          <Text fontSize='22px'>{t('Attack building damage')}+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>{t('HP bonus')}:</Text>
          <Text fontSize='22px'>{t('All buildings HP')}+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>{t('Capacity bonus')}:</Text>
          <Text fontSize='22px'>{t('All throughput speeds')}+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>{t('The cost of building')}:</Text>
          <Text fontSize='22px'>
            {t('All building construction costs')}-10%
          </Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            -2%
          </Text>
        </Flex>
      </ExtraLabelStyled>
    </Box>
  );
};

export default Extra;
