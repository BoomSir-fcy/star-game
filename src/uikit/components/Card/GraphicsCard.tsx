import React from 'react';
import styled from 'styled-components';
import { Box } from '../Box';
import { GraphicsCardProps } from './types';

const GraphicsBox = styled(Box)<GraphicsCardProps>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  max-width: 100%;
  /* min-height: 200px; */
  padding: 20px;
  border: ${({ theme, borderWidth }) =>
    `${borderWidth}px solid ${theme.colors.borderPrimary}`};
  box-shadow: inset 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
  ${({ theme, radius }) => radius && `border-radius: ${theme.radii.card};`}
  z-index: 1;
  ${({ stripe }) =>
    stripe &&
    `
      background: linear-gradient(
      45deg,
      #29595b 25%,
      #275253 0,
      #275253 50%,
      #29595b 0,
      #29595b 75%,
      #275253 0
    );
    background-size: 10px 10px;
    `}

  ::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    background: ${({ theme, stripe }) =>
      stripe
        ? `linear-gradient(
      to bottom,
      rgb(16 36 38 / 70%) 0%,
      rgb(31 87 88 / 0%) 100%
    )`
        : theme.colors.gradients.card};
    ${({ theme, radius }) => radius && `border-radius: ${theme.radii.card};`}
    z-index: -1;
  }
`;

const GraphicsCard: React.FC<GraphicsCardProps> = ({ children, ...props }) => {
  return <GraphicsBox {...props}>{children}</GraphicsBox>;
};

GraphicsCard.defaultProps = {
  width: '682px',
  height: '264px',
  stripe: false,
  borderWidth: 1,
};

export default GraphicsCard;
