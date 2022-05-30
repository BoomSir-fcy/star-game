import React, { useRef, useEffect, useState, useCallback } from 'react';
import Game from 'game/core/Game';
import PreSoldier from 'game/core/PreSoldier';
import { background, border, layout, position, space } from 'styled-system';
import { Box, Image, BoxProps } from 'uikit';
import Soldier from 'game/core/Soldier';
import styled from 'styled-components';

interface PreviewSoldierProps extends BoxProps {
  game?: Game;
  src?: string;
  customDrag?: boolean;
  sid: number;
  disableDrag?: boolean;
}

const SoldierImg = styled.img<{ disableDrag?: boolean }>`
  ${layout}
  ${({ disableDrag }) => disableDrag && `pointer-events: none`}
`;

const PreviewSoldier: React.FC<PreviewSoldierProps> = ({
  src = '/assets/modal/m0-1.png',
  sid,
  game,
  customDrag,
  disableDrag,
  ...props
}) => {
  return (
    <Box width={122} height={122} {...props}>
      <SoldierImg
        width={122}
        height={122}
        src={src}
        disableDrag={disableDrag}
      />
    </Box>
  );
};

export default React.memo(PreviewSoldier);
