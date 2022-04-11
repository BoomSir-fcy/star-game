import React, { useMemo } from 'react';
import { Fringe } from '../Fringe';
import StyledCard from './StyledGgCard';
import { BgCardProps, variants } from './types';

const widths = {
  [variants.SMALL]: 320,
  // [variants.MEDIUM]: 320,
};

const BgCard: React.FC<BgCardProps> = ({ children, fringe, ...props }) => {
  const { variant } = props;

  return (
    <StyledCard {...props}>
      {fringe && (
        <Fringe
          position='absolute'
          width={(widths as any)[variant || 'medium']}
          left={0}
          top={0}
        />
      )}
      {children}
    </StyledCard>
  );
};

BgCard.defaultProps = {
  variant: variants.MEDIUM,
};

export default BgCard;
