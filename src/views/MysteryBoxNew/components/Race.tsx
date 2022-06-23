import React, { useMemo } from 'react';
import { RaceAvatar } from 'components';
import { Text, Flex, BoxProps, Box } from 'uikit';
import { RaceTypeColor } from 'uikit/theme/colors';
import { Races } from 'uikit/theme/types';
import { useTranslation } from 'contexts/Localization';
import { raceData } from 'config/raceConfig';
import { ScrollBox } from './styled';

interface RaceProps extends BoxProps {
  info: any;
}
const Race: React.FC<RaceProps> = ({ info, ...props }) => {
  const { t } = useTranslation();
  const race = useMemo(() => {
    return info?.race as Races;
  }, [info]);
  return (
    <Box {...props}>
      <Text color={RaceTypeColor[race]} fontSize='28px' bold>
        {race ? t(raceData[race]?.name) : ''}
      </Text>
      <Flex mt='24px' width='100%'>
        <RaceAvatar race={race} />
        <ScrollBox ml='37px'>
          <Text fontSize='20px'>{t('Race Features')}</Text>
          <Text>{t(raceData[race]?.desc)}</Text>
          <Text>
            {t('Features')}: {t(raceData[race]?.features)}
          </Text>
        </ScrollBox>
      </Flex>
    </Box>
  );
};

export default Race;
