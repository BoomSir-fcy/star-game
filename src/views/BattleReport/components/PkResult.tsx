import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const ImgFlex = styled(Flex)<{ result: boolean }>`
  width: 133px;
  height: 166px;
  background: ${({ result }) =>
      `url('/images/battleReport/${result ? 'victory' : 'failed'}.png')`}
    no-repeat;
  background-size: 100% 100%;
  padding-top: 56px;
`;

export const PkResult: React.FC<{
  result: boolean;
}> = ({ result }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <ImgFlex result={result} justifyContent='center'>
        {result ? (
          <Text fontSize='22px' bold fontStyle='italic' shadow='green'>
            {t('胜利')}
          </Text>
        ) : (
          <Text fontSize='22px' bold fontStyle='italic' shadow='secondary'>
            {t('失败')}
          </Text>
        )}
      </ImgFlex>
      <Text mt='6px' textAlign='center' fontSize='18px' shadow='primary'>
        NO.1
      </Text>
    </Box>
  );
};
