import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { Flex, FlexProps, Image } from 'uikit';

const scales = {
  MD: 'md',
  SM: 'sm',
} as const;

const scaleVariants = {
  [scales.MD]: {
    width: '436px',
    height: '60px',
  },
  [scales.SM]: {
    width: '242px',
    height: '33px',
  },
};

const FlexStyled = styled(Flex)<{ scale: string }>`
  background: url('/images/commons/scoring-panel.png');
  background-size: 100% auto;
  align-items: center;
  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
`;

interface ScoringPanelProps extends FlexProps {
  total?: number;
  count: number;
  scale?: typeof scales[keyof typeof scales];
}

const ScoringPanel: React.FC<ScoringPanelProps> = ({
  total = 10,
  scale,
  count,
  ...props
}) => {
  return (
    <FlexStyled alignItems='center' justifyContent='center' scale={scale}>
      {Array.from(new Array(total)).map((item, index) => {
        if (index + 1 > count)
          return (
            <Image
              key={`${item}_${index}`}
              margin='0 7.5px'
              width={22}
              height={22}
              src='/images/commons/icon/star-s.png'
            />
          );
        return (
          <Image
            key={`${item}_${index}`}
            margin='0 8px'
            width={22}
            height={22}
            src='/images/commons/icon/star-a.png'
          />
        );
      })}
    </FlexStyled>
  );
};

ScoringPanel.defaultProps = {
  scale: scales.MD,
};

export default ScoringPanel;
