import React from 'react';
import styled from 'styled-components';
import { EmptyProps, scales, Scales } from './types';
import { useTranslation } from 'contexts/Localization';
import { Flex, Text, Image } from 'uikit';

export const scaleIconVariants = {
  [scales.LG]: {
    width: '496px',
    height: '700px',
  },
  [scales.MD]: {
    width: '248px',
    height: '350.8px',
  },
  [scales.SM]: {
    width: '128px',
    height: '175.4px',
  },
};

const Empty: React.FC<EmptyProps> = ({ scale, title }) => {
  const { t } = useTranslation();
  // const { width, height } = scaleIconVariants[scale || 'sm'];
  return (
    <Flex
      width='100%'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <img alt='' src='/images/no-data.png' />
      <Text>{title || t('No Data')}</Text>
    </Flex>
  );
};

Empty.defaultProps = {
  scale: scales.SM,
};

export default Empty;
