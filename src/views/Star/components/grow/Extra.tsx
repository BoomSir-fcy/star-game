import React from 'react';
import styled from 'styled-components';
import { Box, Text, Flex, BoxProps, Label, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { StrengthenConsumeType } from './type';

export const ExtraLabelStyled = styled(Label)`
  width: 342px;
  height: 69px;
  padding: 18px 20px;
  margin-bottom: 13px;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
const ImageStyle = styled(Image)`
  transform: rotate(90deg);
`;
const Extra: React.FC<{
  info: StrengthenConsumeType;
}> = ({ info }) => {
  const { t } = useTranslation();
  const { estimate_buff, now_buff } = info;

  return (
    <Flex
      maxWidth='703px'
      flexWrap='wrap'
      alignItems='center'
      justifyContent='space-between'
    >
      <LabelInfo
        label={t('HP')}
        now={now_buff.hp}
        up={estimate_buff.hp - now_buff.hp}
        after={estimate_buff.hp}
      />
      <LabelInfo
        label={t('Attack')}
        now={now_buff.attack}
        up={estimate_buff.attack - now_buff.attack}
        after={estimate_buff.attack}
      />
      <LabelInfo
        label={t('Defense')}
        now={now_buff.defense}
        up={estimate_buff.defense - now_buff.defense}
        after={estimate_buff.defense}
      />
      <LabelInfo
        label={t('Hit')}
        now={now_buff.hit}
        up={estimate_buff.hit - now_buff.hit}
        after={estimate_buff.hit}
      />
      <LabelInfo
        label={t('Speed')}
        now={now_buff.speed}
        up={estimate_buff.speed - now_buff.speed}
        after={estimate_buff.speed}
      />
      <LabelInfo
        label={t('Miss')}
        now={now_buff.miss}
        up={estimate_buff.miss - now_buff.miss}
        after={estimate_buff.miss}
      />
      <LabelInfo
        label={t('Crit')}
        now={now_buff.critical}
        up={estimate_buff.critical - now_buff.critical}
        after={estimate_buff.critical}
      />
    </Flex>
  );
};

const LabelInfo: React.FC<{
  label: string;
  now: number;
  up: number;
  after: number;
}> = ({ label, now, up, after }) => {
  return (
    <ExtraLabelStyled alignItems='flex-end' justifyContent='space-between'>
      <Box>
        <Text bold>{label}</Text>
        <Text bold>{now}</Text>
      </Box>
      <Box>
        <Text color='up'>{`+(${up})`}</Text>
        <ImageStyle width={33} height={33} src='/images/commons/icon/up.png' />
      </Box>
      <Box>
        <Text bold>&nbsp;</Text>
        <Text bold>{after}</Text>
      </Box>
    </ExtraLabelStyled>
  );
};
export default Extra;
