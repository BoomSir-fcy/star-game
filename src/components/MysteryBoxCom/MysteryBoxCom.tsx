import React, { useMemo } from 'react';
import { Box, Text, Flex } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { qualities, MysteryBoxComProps } from './types';
import { mysteryConfig } from './config';
import { BoxStyled, BoxBgStyled, BoxBaseStyled, BoxBoxStyled } from './styled';

const MysteryBoxCom: React.FC<MysteryBoxComProps> = ({ quality, ...props }) => {
  const { t } = useTranslation();
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
        padding='30px 22px 80px 0'
        zIndex={5}
      >
        <Box mt='4px' width='100%'>
          <Text fontSize='24px' color='navy' textAlign='center' width='270px'>
            {t(info.label)}
          </Text>
        </Box>
        <Box>
          <Text textAlign='center' fontSize='20px' color='textSecondary'>
            {t('You will have a chance to get')}
          </Text>
          <Text fontSize='22px' maxWidth='360px' ellipsis mt='8px'>
            {t(info.tips)}
          </Text>
        </Box>
      </Flex>
      <BoxBgStyled quality={quality} />
      <BoxBaseStyled quality={quality} />
      <BoxBoxStyled quality={quality} />
    </BoxStyled>
  );
};

export default MysteryBoxCom;
