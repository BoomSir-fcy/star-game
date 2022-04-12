import React, { useMemo } from 'react';
import { RaceAvatar } from 'components';
import { Image, Text, Flex, BoxProps } from 'uikit';
import { RaceTypeColor } from 'uikit/theme/colors';
import { Races, RaceType } from 'uikit/theme/types';
import { useTranslation } from 'contexts/Localization';
import { RaceCardStyled, LabelText } from './styled';

interface RaceProps extends BoxProps {
  info: any;
}
const Race: React.FC<RaceProps> = ({ info, ...props }) => {
  const { t } = useTranslation();
  const race = useMemo(() => {
    return info?.race as Races;
  }, [info]);
  return (
    <RaceCardStyled mt='13px'>
      <Flex width='100%'>
        <RaceAvatar
          race={
            race === RaceType.PROTOSS
              ? 'protoss'
              : race === RaceType.HUMAN
              ? 'human'
              : 'zerg'
          }
        />
        <Flex ml='13px' flexDirection='column'>
          <Flex>
            <LabelText>{t('Planet race')}</LabelText>
            <Text color={RaceTypeColor[race]} ml='17px' fontSize='22px' bold>
              {race ? t(`race-${race}`) : ''}
            </Text>
          </Flex>
          <LabelText>{t('Ethnicity')}</LabelText>
          <LabelText>
            {t(
              '1.The collection ability of Zerg management buildings is in the middle among the three major races',
            )}
          </LabelText>
          <LabelText>
            {t(
              '2. The Zerg attack class has the shortest hand, but the most damage BT. No AOE damage',
            )}
          </LabelText>
          <LabelText>
            {t('3. The Zerg attack building occupies the smallest area')}
          </LabelText>
        </Flex>
      </Flex>
    </RaceCardStyled>
  );
};

export default Race;
