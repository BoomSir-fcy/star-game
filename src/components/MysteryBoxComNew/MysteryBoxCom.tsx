import React, { useMemo } from 'react';
import { Box, Text, Flex } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { GlobalVideo } from 'components/Video';
import { useStore } from 'state';
import styled from 'styled-components';
import { qualities, MysteryBoxComProps } from './types';

const TextStyled = styled(Text)<{ scale?: number }>`
  position: absolute;
  left: ${({ scale }) => `${405 * scale}px`};
  top: ${({ scale }) => `${250 * scale}px`};
  font-size: ${({ scale }) => `${16 * scale}px`};
`;

const MysteryBoxCom: React.FC<MysteryBoxComProps> = ({
  quality,
  text,
  rotate = -30,
  handleClick,
  ...props
}) => {
  const { scale } = useStore(p => p.user);
  const { width, height, left, top, bottom, right, ...rest } = props;
  return (
    <GlobalVideo
      width={900}
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
    </GlobalVideo>
  );
};

export default MysteryBoxCom;
