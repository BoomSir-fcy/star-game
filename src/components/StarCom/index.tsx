import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Image } from 'uikit';
import StyledStar, { getVariantsSize } from './StyledStar';
import { StarProps, variants } from './types';

const ImageStyled = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const IconUnion = styled(Image)`
  position: absolute;
  bottom: -12px;
  right: -12px;
`;

const StarCom: React.FC<StarProps> = ({
  children,
  showUnion,
  picture = '/images/commons/36.png',
  ...props
}) => {
  const { scale } = props;
  const { width, height } = React.useMemo(() => {
    return getVariantsSize(variants.NONE, scale);
  }, [scale]);
  return (
    <StyledStar {...props}>
      <ImageStyled width={width} height={height} src={picture} />
      {showUnion && (
        <IconUnion
          width={50}
          height={50}
          src='/images/commons/icon/union.png'
        />
      )}
    </StyledStar>
  );
};
export default StarCom;
