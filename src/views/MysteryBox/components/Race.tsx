import React, { useMemo } from 'react';
import { RaceAvatar } from 'components';
import { Image, Text, Flex, BoxProps } from 'uikit';
import { RaceTypeColor } from 'uikit/theme/colors';
import { Races, RaceType } from 'uikit/theme/types';
import { useTranslation } from 'contexts/Localization';
import { raceData } from 'config/raceConfig';
import { RaceCardStyled, LabelText, ScrollBox } from './styled';

interface RaceProps extends BoxProps {
  info: any;
}
const Race: React.FC<RaceProps> = ({ info, ...props }) => {
  const { t } = useTranslation();
  const race = useMemo(() => {
    return info?.race as Races;
  }, [info]);
  return (
    <RaceCardStyled mt='13px' {...props}>
      <Flex width='100%'>
        <RaceAvatar race={race} />
        <Flex ml='13px' flexDirection='column'>
          <Flex>
            <LabelText>{t('Planet Race')}</LabelText>
            <Text color={RaceTypeColor[race]} ml='17px' fontSize='22px' bold>
              {race ? t(raceData[race]?.name) : ''}
            </Text>
          </Flex>
          <ScrollBox>
            <LabelText>{t('Race Features')}</LabelText>
            <LabelText>{t(raceData[race]?.desc)}</LabelText>
            <LabelText>
              {t('Features')}: {t(raceData[race]?.features)}
            </LabelText>
          </ScrollBox>
        </Flex>
      </Flex>
    </RaceCardStyled>
  );
};

export default Race;
