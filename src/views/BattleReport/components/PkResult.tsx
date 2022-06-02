import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const ImgFlex = styled(Flex)`
  width: 133px;
  height: 166px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-top: 56px;
`;

export const PkResult: React.FC<{
  result: boolean;
}> = ({ result }) => {
  const { t } = useTranslation();

  const background = useMemo(() => {
    return `url('/images/battleReport/${result ? 'victory' : 'failed'}.png')`;
  }, [result]);

  return (
    <Box>
      <ImgFlex justifyContent='center' backgroundImage={background}>
        {result ? (
          <Text fontSize='22px' bold fontStyle='italic' shadow='green'>
            {t('Victory')}
          </Text>
        ) : (
          <Text fontSize='22px' bold fontStyle='italic' shadow='secondary'>
            {t('Fail')}
          </Text>
        )}
      </ImgFlex>
      <Text mt='6px' textAlign='center' fontSize='18px' shadow='primary'>
        NO.1
      </Text>
    </Box>
  );
};
