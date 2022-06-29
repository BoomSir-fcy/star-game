import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { PlanetBall } from 'components';
import { Text } from '../Text';
import { Flex } from '../Box';
import { EmptyProps, scales } from './types';

const DataBox = styled.div`
  width: max-content;
`;

const Empty: React.FC<EmptyProps> = ({ scale, title }) => {
  const { t } = useTranslation();
  return (
    <Flex
      width='100%'
      height='100%'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <PlanetBall rotate url='/images/star/01.jpg' />
      <Text mt='20px'>{title || t('No Data')}</Text>
    </Flex>
  );
};

Empty.defaultProps = {
  scale: scales.MD,
};

export default Empty;
