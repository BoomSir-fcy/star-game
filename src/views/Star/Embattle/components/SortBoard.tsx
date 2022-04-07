import React from 'react';
import styled from 'styled-components';
import { Box, Text, BoxProps, BorderCard, BorderCardProps } from 'uikit';
import { Container } from './styled';

interface SortBoardProps extends BorderCardProps {
  list?: any[];
}
const SortBoard: React.FC<SortBoardProps> = ({ ...props }) => {
  return (
    <BorderCard isActive width='183px' height='476px' {...props}>
      <Text>攻击顺序</Text>
    </BorderCard>
  );
};

export default SortBoard;
