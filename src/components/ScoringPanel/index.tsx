import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { Flex, FlexProps, Image, Text } from 'uikit';

const scales = {
  MD: 'md',
  SM: 'sm',
  EL: 'el',
} as const;

const scaleVariants = {
  [scales.MD]: {
    width: '436px',
    height: '80px',
    padding: '10px 10px 14px',
  },
  [scales.SM]: {
    width: '242px',
    height: '33px',
  },
  [scales.EL]: {
    width: '120px',
    height: '33px',
  },
};

const FlexStyled = styled(Flex)<{ scale: string }>`
  background: url('/images/commons/scoring-panel.png') no-repeat;
  background-size: 100% 100%;
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
  ellipsis?: boolean;
}

const ScoringPanel: React.FC<ScoringPanelProps> = ({
  total = 20,
  scale,
  count,
  ellipsis,
  ...props
}) => {
  return (
    <FlexStyled
      alignItems='center'
      justifyContent='start'
      flexWrap='wrap'
      scale={scale}
    >
      {ellipsis ? (
        <>
          <Image
            margin='0 7.5px'
            width={22}
            height={22}
            src='/images/commons/icon/star-a.png'
          />
          <Text fontSize='18px'> x {count}</Text>
        </>
      ) : (
        <>
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
        </>
      )}
    </FlexStyled>
  );
};

ScoringPanel.defaultProps = {
  scale: scales.MD,
};

export default ScoringPanel;
