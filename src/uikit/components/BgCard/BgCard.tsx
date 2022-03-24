import React from 'react';
import StyledCard from './StyledGgCard';
import { BgCardProps } from './types';

const BgCard: React.FC<BgCardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};
export default BgCard;
