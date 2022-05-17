import {
  MysteryBoxStyled,
  MysteryBoxBoxStyled,
} from 'components/MysteryBoxCom';
import styled from 'styled-components';
import { Box, Card, Label, Text, Flex } from 'uikit';

export const LabelStyled = styled(Label)`
  width: 232px;
  height: 60px;
  padding-left: 26px;
`;

export const ExtraLabelStyled = styled(Label)`
  width: 500px;
  height: 60px;
  padding-left: 10px;
`;

export const RaceCardStyled = styled(Card)`
  width: 726px;
  height: 234px;
  padding-top: 20px;
  padding-left: 17px;
`;

export const LabelText = styled(Text).attrs({ small: true })`
  font-size: 18px;
`;
export const AttrText = styled(LabelText)`
  margin-left: 5px;
  flex: 1;
  font-size: 18px;
`;

export const ScrollBox = styled(Box)`
  max-height: 150px;
  overflow-y: auto;
`;

export const MysteryBoxStaticStyled = styled(MysteryBoxStyled)`
  width: 293px;
  height: 293px;
`;
export const MysteryBoxBoxStaticStyled = styled(MysteryBoxBoxStyled)`
  top: 0;
  bottom: 0;
`;
export const VideoBox = styled(Flex)`
  justify-content: center;
  align-items: center;
`;
