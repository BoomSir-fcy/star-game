import styled from 'styled-components';
import { Card, Flex, Text } from 'uikit';

export const CardStyle = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
const CardBox = styled(Flex)`
  position: relative;
  width: 61px;
  height: 73px;
  align-items: center;
  justify-content: center;
`;
export const TopBox1 = styled(CardBox)`
  background: url('/images/grow/left.png') center left no-repeat;
  background-size: 100%;
  text-align: left;
`;
export const TopBox2 = styled(CardBox)`
  background: url('/images/grow/right.png') center right no-repeat;
  background-size: 100%;
  text-align: right;
`;
export const TopText1 = styled(Text)`
  position: absolute;
  left: 20px;
  white-space: nowrap;
`;
export const TopText2 = styled(Text)`
  position: absolute;
  right: 20px;
  white-space: nowrap;
`;
