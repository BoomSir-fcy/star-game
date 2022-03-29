import React from 'react';
import styled from 'styled-components';
import { Flex, FlexProps, Image } from 'uikit';

const FlexStyled = styled(Flex)`
  background: url('/images/commons/scoring-panel.png');
`;

interface ScoringPanelProps extends FlexProps {
  total?: number;
  count: number;
}

const ScoringPanel: React.FC<ScoringPanelProps> = ({
  total = 10,
  count,
  ...props
}) => {
  return (
    <FlexStyled
      alignItems='center'
      justifyContent='center'
      width={436}
      height={60}
    >
      {Array.from(new Array(total)).map((item, index) => {
        if (index > count)
          return (
            <Image
              margin='0 7.5px'
              width={22}
              height={22}
              src='/images/commons/icon/star-s.png'
            />
          );
        return (
          <Image
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

export default ScoringPanel;
