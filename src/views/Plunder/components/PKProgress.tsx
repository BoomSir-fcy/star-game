import { useTranslation } from 'contexts/Localization';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Box, FlexProps, Text, Flex } from 'uikit';

const ProgressBox = styled(Box)<{ step: string }>`
  width: 537px;
  height: 16px;
  background: url('/images/plunder/bar.png');
  background-size: 100% 100%;
  position: relative;
  &::before {
    content: '';
    max-width: calc(100% - 10px);
    width: ${({ step }) => step};
    height: 10px;
    position: absolute;
    top: 0;
    left: 5px;
    bottom: 0;
    right: auto;
    margin: auto;
    background: linear-gradient(
      45deg,
      #d11812 25%,
      #d3514c 0,
      #d3514c 50%,
      #d11812 0,
      #d11812 75%,
      #d3514c 0
    );
    background-size: 10px;
    box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
    border-radius: 6px;
    transition: width 0.2s ease-out;
  }
`;

const positionCenter = `
  width: 32px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
`;
const Round = styled(Box)<{ win?: boolean; lose?: boolean }>`
  position: relative;
  width: 40px;
  height: 40px;
  background: url('/images/plunder/round-default.png');
  background-size: 100% 100%;
  &:not(:last-child) {
    margin-right: 15px;
  }
  ${({ win }) =>
    win &&
    `
    &::before{
      content: '';
      ${positionCenter}
      background: url('/images/plunder/round-win.png');
      background-size: 100% 100%;
    }
  `}
  ${({ lose }) =>
    lose &&
    `
    &::before{
      content: '';
      ${positionCenter}
      background: url('/images/plunder/round-lose.png');
      background-size: 100% 100%;
    }
  `}
`;
const FlexStyled = styled(Flex)<{ rotate?: boolean }>`
  flex-direction: column;
  ${({ rotate }) => rotate && `transform: rotateY(180deg)`}
`;

interface PKProgressProps extends FlexProps {
  opponent?: boolean;
  total?: number;
  current?: number;
  result: boolean[];
  isRed?: boolean;
  totalRound?: number;
}
const PKProgress: React.FC<PKProgressProps> = ({
  opponent,
  total,
  current,
  totalRound = 5,
  result,
  isRed,
  ...props
}) => {
  const { t } = useTranslation();

  const progress = useMemo(() => {
    if (total && typeof current === 'number' && current !== 0) {
      return Math.floor((current / total) * 100);
    }
    return 100;
  }, [total, current]);

  return (
    <FlexStyled alignItems={opponent ? 'flex-end' : 'flex-start'} {...props}>
      <Text
        mb='21px'
        shadow={opponent ? 'secondary' : 'primary'}
        fontSize='24px'
      >
        {opponent ? t('红色方') : t('蓝色方')}
      </Text>
      <FlexStyled rotate={opponent}>
        <ProgressBox step={`${progress}%`} />
        <Flex mt='14px'>
          {Array.from(new Array(totalRound)).map((item, index) => {
            if (index > result.length - 1) {
              return <Round />;
            }
            const win = isRed ? !result[index] : result[index];
            return <Round win={win} lose={!win} />;
          })}
        </Flex>
      </FlexStyled>
    </FlexStyled>
  );
};

export default PKProgress;
