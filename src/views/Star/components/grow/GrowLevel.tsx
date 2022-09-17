import React from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import ScoringPanel from 'components/ScoringPanel';
import { useTranslation } from 'contexts/Localization';
import { formatDisplayApr } from 'utils/formatBalance';
import { CardStyle, TopBox1, TopBox2, TopText2, TopText1 } from './styled';

export const successRate = (nowLevel: number) => {
  if (nowLevel >= 0 && nowLevel <= 6) {
    return 'Extremely high';
  }
  if (nowLevel >= 7 && nowLevel <= 14) {
    return 'Generally';
  }
  if (nowLevel >= 15 && nowLevel <= 20) {
    return 'Lower';
  }
  return '';
};
interface GrowLevelProps {
  nowLevel: number;
  nextLevel: number;
  now_power: number;
  estimate_power: number;
  max_level: number;
}
const GrowLevel: React.FC<GrowLevelProps> = ({
  nowLevel,
  nextLevel,
  now_power,
  estimate_power,
  max_level,
}) => {
  const { t } = useTranslation();

  return (
    <CardStyle width='410px' height='320px' padding='15px'>
      <ScoringPanel count={nowLevel} total={max_level} />
      <Flex mt='19px' justifyContent='center'>
        <Text fontSize='18px'>{t('Cultivation success rate')}</Text>
        <Text ml='18px' color='textUp' fontSize='18px' bold>
          {t(successRate(nowLevel))}
        </Text>
      </Flex>
      <Flex mt='15px' justifyContent='space-between' alignItems='center'>
        <TopBox1>
          <TopText1 bold color='legendText'>
            {nowLevel === max_level
              ? 'MAX'
              : `${t('Strengthen')} + ${nowLevel}`}
          </TopText1>
        </TopBox1>
        <Box width={58}>
          <Image
            width={58}
            height={28}
            src='/images/commons/icon/upgrade.png'
          />
        </Box>
        <TopBox2>
          <TopText2 bold color='legendText'>
            {nowLevel === max_level
              ? 'MAX'
              : `${t('Strengthen')} + ${nextLevel}`}
          </TopText2>
        </TopBox2>
      </Flex>
      <Flex mt='29px' justifyContent='space-between' alignItems='center'>
        <Box>
          <Text small>{t('Power')}</Text>
          <Text fontSize='20px' fontStyle='normal' mark bold>
            {formatDisplayApr(now_power)}
          </Text>
        </Box>
        <Box width={58}>
          <Image
            width={58}
            height={28}
            src='/images/commons/icon/upgrade.png'
          />
        </Box>
        <Box>
          <Text small>{t('After lifting')}</Text>
          <Text fontSize='20px' fontStyle='normal' mark bold>
            {formatDisplayApr(estimate_power)}
          </Text>
        </Box>
      </Flex>
    </CardStyle>
  );
};

export default GrowLevel;
