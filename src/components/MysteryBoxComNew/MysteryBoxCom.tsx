import React, { useMemo } from 'react';
import { Box, Text, Flex } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { GlobalVideo } from 'components/Video';
import { useStore } from 'state';
import styled from 'styled-components';
import BlindInfo from 'views/MysteryBoxNew/BlindInfo';
import { qualities, MysteryBoxComProps } from './types';

const TextStyled = styled(Text)<{ scale?: number }>`
  position: absolute;
  left: ${({ scale }) => `${405 * scale}px`};
  top: ${({ scale }) => `${250 * scale}px`};
  font-size: ${({ scale }) => `${16 * scale}px`};
`;

// const BlindInfoBox = styled(Box)<{ scale?: number }>`
//   position: absolute;
//   left: 100px;
//   bottom: -200px;
//   width: 60%;
// `;

const MysteryBoxCom: React.FC<MysteryBoxComProps> = ({
  quality,
  text,
  rotate = -30,
  width = 900,
  height = 500,
  handleClick,
  ...props
}) => {
  const { scale } = useStore(p => p.user);
  const { left, top, bottom, right, ...rest } = props;
  return (
    <GlobalVideo
      width={width}
      height={height}
      src={`/video/mbox${quality}.mp4`}
      loop
      left={left}
      top={top}
      bottom={bottom}
      right={right}
      margin='auto'
      rotate={rotate}
      onClick={() => {
        if (handleClick) handleClick();
      }}
      {...rest}
    >
      <TextStyled shadow='primary' scale={scale} bold>
        {text}
      </TextStyled>
      {/* <BlindInfoBox scale={scale}>
        
      </BlindInfoBox> */}
    </GlobalVideo>
  );
};

export default MysteryBoxCom;
