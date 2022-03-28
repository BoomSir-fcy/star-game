import React from 'react';
import { variant } from 'styled-system';
import styled from 'styled-components';
import { Box } from 'uikit';
import { KingAvatarProps, Sex, sexImages, sexs } from './types';

export const AvatarBox = styled(Box)<{ width?: string; height?: string }>`
  position: relative;
  width: ${({ width }) => width || '129px'};
  height: ${({ height }) => height || '129px'};
`;
const positionCenter = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;

export const AvatarBorder = styled.img<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '129px'};
  height: ${({ height }) => height || '129px'};
  ${positionCenter}
  z-index: 2;
`;

export const AvatarImage = styled.img<{ sex?: Sex }>`
  width: 85%;
  height: 85%;
  ${positionCenter}
  z-index: 1;
`;

const KingAvatar: React.FC<KingAvatarProps> = ({
  sex = 'man',
  width,
  height,
  ...props
}) => {
  return (
    <AvatarBox width={width} height={height} {...props}>
      <AvatarImage sex={sex} src={sexImages[sex]} />
      <AvatarBorder
        width={width}
        height={height}
        src='/images/login/a-b-woman.png'
      />
    </AvatarBox>
  );
};

export default KingAvatar;
