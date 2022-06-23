import styled from 'styled-components';
import { Box, Card, Label, Text, Flex } from 'uikit';

export const LabelStyled = styled(Label)`
  width: 297px;
  height: 60px;
  padding: 0 24px;
`;

export const LabelText = styled(Text).attrs({ small: true })`
  font-size: 16px;
`;
export const AttrText = styled(LabelText)`
  margin-left: 5px;
  flex: 1;
  font-size: 16px;
`;

export const ScrollBox = styled(Box)`
  max-height: 130px;
  overflow-y: auto;
`;
