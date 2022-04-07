import React from 'react';
import styled from 'styled-components';
import { Box, Text, BoxProps, BorderCard, BorderCardProps } from 'uikit';
import { Container } from './styled';

interface PreviewProps extends BorderCardProps {
  list?: any[];
}
const Preview: React.FC<PreviewProps> = ({ list, ...props }) => {
  return (
    <BorderCard isActive width='600px' height='476px' {...props}>
      <Text>1221</Text>
    </BorderCard>
  );
};

export default Preview;
