import React from 'react';
import StyledProgress, { Bar } from './StyledProgress';
import ProgressBunnyWrapper from './ProgressBunnyWrapper';
import { ProgressProps, variants, scales } from './types';
import { ProgressBunny } from '../Svg';

const stepGuard = (step: number) => {
  if (step < 0) {
    return 0;
  }

  if (step > 100) {
    return 100;
  }

  return step;
};

const Progress: React.FC<ProgressProps> = ({
  variant = variants.ROUND,
  scale = scales.MD,
  primaryStep = 0,
  secondaryStep = null,
  showProgressBunny = false,
  color,
  linear,
}) => {
  return (
    <StyledProgress variant={variant} scale={scale} linear={linear}>
      {showProgressBunny && (
        <ProgressBunnyWrapper style={{ left: `${stepGuard(primaryStep)}%` }}>
          <ProgressBunny />
        </ProgressBunnyWrapper>
      )}
      <Bar
        primary
        color={color}
        style={{ width: `${stepGuard(primaryStep)}%` }}
      />
      {secondaryStep ? (
        <Bar style={{ width: `${stepGuard(secondaryStep)}%` }} />
      ) : null}
    </StyledProgress>
  );
};

export default Progress;
