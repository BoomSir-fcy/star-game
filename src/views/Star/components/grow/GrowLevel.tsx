import React from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import ScoringPanel from 'components/ScoringPanel';
import { useTranslation } from 'contexts/Localization';
import { CardStyle, TopBox1, TopBox2, TopText2, TopText1 } from './styled';

interface GrowLevelProps {
  nowLevel: number;
  nextLevel: number;
  now_power: number;
  estimate_power: number;
}
const GrowLevel: React.FC<GrowLevelProps> = ({
  nowLevel,
  nextLevel,
  now_power,
  estimate_power,
}) => {
  const { t } = useTranslation();
  const successRate = React.useMemo(() => {
    if (nowLevel >= 1 && nowLevel <= 6) {
      return t('Extremely high');
    }
    if (nowLevel >= 7 && nowLevel <= 14) {
      return t('Generally');
    }
    if (nowLevel >= 15 && nowLevel <= 20) {
      return t('Lower');
    }
    return '';
  }, [nowLevel, t]);
  return (
    <CardStyle width='380px' height='299px' padding='15px'>
      <ScoringPanel count={nowLevel} />
      <Flex mt='19px' justifyContent='center'>
        <Text fontSize='18px'>{t('Cultivation success rate')}</Text>
        <Text ml='18px' color='textUp' fontSize='18px' bold>
          {successRate}
        </Text>
      </Flex>
      <Flex justifyContent='space-between' alignItems='center'>
        <TopBox1>
          <TopText1 bold color='legendText'>
            {nowLevel === 20 ? 'MAX' : `${t('Strengthen')} + ${nowLevel}`}
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
            {nowLevel === 20 ? 'MAX' : `${t('Strengthen')} + ${nextLevel}`}
          </TopText2>
        </TopBox2>
      </Flex>
      <Flex mt='29px' justifyContent='space-between' alignItems='center'>
        <Box>
          <Text small>{t('Power')}</Text>
          <Text fontSize='20px' fontStyle='normal' mark bold>
            {now_power}
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
            {estimate_power}
          </Text>
        </Box>
      </Flex>
    </CardStyle>
  );
};

export default GrowLevel;
