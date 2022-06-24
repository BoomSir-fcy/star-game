import React from 'react';
import { Box, MarkText } from 'uikit';

export const BuildingBuff: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  return (
    <Box pb='40px'>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='25px'>
        产能详情
      </MarkText>
    </Box>
  );
};
