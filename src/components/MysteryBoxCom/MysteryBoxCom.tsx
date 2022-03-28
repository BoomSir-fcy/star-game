import React, { useMemo } from 'react';
import { Box, Text, Flex } from 'uikit';
import { qualities, MysteryBoxComProps } from './types';
import { mysteryConfig } from './config';
import { BoxStyled, BoxBgStyled, BoxBaseStyled, BoxBoxStyled } from './styled';

const MysteryBoxCom: React.FC<MysteryBoxComProps> = ({ quality, ...props }) => {
  const info = useMemo(() => {
    if (mysteryConfig[quality]) {
      return mysteryConfig[quality];
    }
    return mysteryConfig[qualities.ORDINARY];
  }, [quality]);
  return (
    <BoxStyled {...props}>
      <Flex
        alignItems='center'
        justifyContent='space-between'
        flexDirection='column'
        position='relative'
        height='100%'
        padding='30px 0 72px'
        zIndex={5}
      >
        <Box width='100%'>
          <Text color='navy' textAlign='center' width='255px'>
            {info.label}
          </Text>
        </Box>
        <Box>
          <Text textAlign='center' fontSize='22px' color='textTips'>
            有几率获得
          </Text>
          <Text mt='8px'>{info.tips}</Text>
        </Box>
      </Flex>
      <BoxBgStyled quality={quality} />
      <BoxBaseStyled quality={quality} />
      <BoxBoxStyled quality={quality} />
    </BoxStyled>
  );
};

export default MysteryBoxCom;
