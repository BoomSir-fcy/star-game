import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Image } from 'uikit';
import StyledStar from './StyledStar';
import { StarProps } from './types';

const ImageStyled = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StarCom: React.FC<StarProps> = ({ children, ...props }) => {
  return (
    <StyledStar {...props}>
      <ImageStyled width={100} height={100} src='/images/star/btc.png' />
    </StyledStar>
  );
};
export default StarCom;
