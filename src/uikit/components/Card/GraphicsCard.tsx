import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { Box } from '../Box';
import { GraphicsCardProps } from './types';

const GraphicsBox = styled(Box) <GraphicsCardProps>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  max-width: 100%;
  padding: 20px;
  border: ${({ theme, borderWidth }) =>
    `${borderWidth}px solid ${theme.colors.borderPrimary}`};
  box-shadow: inset 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
  ${({ theme, isRadius }) => isRadius && `border-radius: ${theme.radii.card};`}
  z-index: 1;
  ${({ theme, stripe }) =>
    stripe &&
    `
      background: ${theme.colors.gradients.stripe};
      background-size: 10px 10px;
    `}

  ${space}
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
    stripe ? theme.colors.gradients.stripeBg : theme.colors.gradients.card};
    ${({ theme, isRadius }) =>
    isRadius && `border-radius: ${theme.radii.card};`}
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
  isRadius: false,
};

export default GraphicsCard;
