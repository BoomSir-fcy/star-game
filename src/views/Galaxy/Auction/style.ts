import styled from 'styled-components';
import { Flex, Box, Text } from 'uikit';

export const LeftFlex = styled(Flex)`
  flex-direction: column;
  flex: 3;
`;
export const RightFlex = styled(Flex)`
  flex-direction: column;
  flex: 2;
`;
export const Line = styled(Box)`
  width: 3px;
  height: 314px;
  margin: 0 50px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0),
    #ffffff,
    rgba(255, 255, 255, 0)
  );
`;
export const PriceText = styled(Text).attrs({
  shadow: 'tertiary',
  fontSize: '63px',
  bold: true,
})``;
