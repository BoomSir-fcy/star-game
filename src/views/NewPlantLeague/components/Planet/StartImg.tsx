import React, { useState, useCallback } from 'react';
import { BoxProps, Box, Image } from 'uikit';
import { Scale } from 'components/StarCom/types';
import { Globe } from 'components';
import styled from 'styled-components';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';

const IconUnion = styled(Image)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export interface StartImgProps extends BoxProps {
  url: string;
  scale?: Scale;
  shadow?: number;
  rotate?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  showIcon?: boolean;
}
export const StartImg: React.FC<StartImgProps> = ({
  shadow = '#FFF',
  scale = 'xl',
  url,
  iconWidth = 60,
  iconHeight = 58,
  showIcon = true,
  ...props
}) => {
  return (
    <Box position='relative'>
      <Globe
        showUnion={showIcon}
        zIndex={0}
        scale={scale}
        shadow={QualityColor[shadow]}
        url={url}
      />
      {/* {showIcon && (
        <IconUnion
          width={iconWidth}
          height={iconHeight}
          src='/images/commons/icon/union.png'
        />
      )} */}
    </Box>
  );
};
