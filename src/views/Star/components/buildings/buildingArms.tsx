import React from 'react';
import styled from 'styled-components';
import { Flex, Box, MarkText, Text } from 'uikit';

const ArmsBox = styled(Box)`
  width: 92px;
  height: 93px;
  border: 1px solid #4ffffb;
  background: linear-gradient(0deg, #1f5758 0%, #102426 100%);
  box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
  border-radius: 10px;
`;

const ArmsPreview = () => {
  return (
    <Box>
      <ArmsBox>1</ArmsBox>
      <Text mt='11px' textAlign='center'>
        虐夺者
      </Text>
    </Box>
  );
};

const ArmsPanel = () => {
  return <Box>111</Box>;
};

export const BuildingArms: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  return (
    <Box>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
        兵种详情
      </MarkText>
      <Flex>
        <ArmsPreview />
      </Flex>
    </Box>
  );
};
