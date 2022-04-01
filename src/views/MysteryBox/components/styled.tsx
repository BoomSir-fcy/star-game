import styled from 'styled-components';
import { Card, Label, Text } from 'uikit';

export const LabelStyled = styled(Label)`
  width: 232px;
  height: 60px;
  padding-left: 26px;
`;

export const ExtraLabelStyled = styled(Label)`
  width: 500px;
  height: 60px;
  padding-left: 26px;
`;

export const RaceCardStyled = styled(Card)`
  width: 726px;
  height: 234px;
  padding-top: 20px;
  padding-left: 17px;
`;

export const LabelText = styled(Text).attrs({ small: true })``;
export const AttrText = styled(LabelText)`
  margin-left: 5px;
`;
