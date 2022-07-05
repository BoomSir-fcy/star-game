import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import AllianceResources from './AllianceResources';
import RightFloatBar from './RightFloatBar';

const FloatBox = styled(Box)`
  position: fixed;
  right: 0;
  top: 14%;
`;

const RightFloatBox: React.FC = () => {
  return (
    <FloatBox>
      <RightFloatBar />
      <AllianceResources />
    </FloatBox>
  );
};

export default RightFloatBox;
