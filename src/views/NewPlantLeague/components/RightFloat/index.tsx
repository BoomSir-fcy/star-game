import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import AllianceResources from './AllianceResources';
import RightFloatBar from './RightFloatBar';

const FloatBox = styled(Box)`
  position: fixed;
  right: 0;
  top: 20%;
`;

const RightFloatBox: React.FC<{ Booting: boolean; setGuide: (e) => void }> = ({
  Booting,
  setGuide,
}) => {
  return (
    <FloatBox>
      <RightFloatBar Booting={Booting} setGuide={setGuide} />
      <AllianceResources />
    </FloatBox>
  );
};

export default RightFloatBox;
