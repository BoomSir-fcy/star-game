import BigNumber from 'bignumber.js';
import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image } from 'uikit';
import { formatLocalisedCompactBalance } from 'utils/formatBalance';

const Group = styled(Flex)`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  border: 1px solid #393b40;
  border-radius: ${({ theme }) => theme.radii.card};
`;

export const TextList: React.FC<{
  imgWidth: number;
  imgHeight: number;
  imgSrc: string;
  number: string;
  unit: string;
  color?: string;
  alreadyNumber?: number;
}> = ({
  imgWidth,
  imgHeight,
  imgSrc,
  number,
  unit,
  color = 'textSubtle',
  alreadyNumber = null,
}) => {
  return (
    <Group>
      <Box width={`${imgWidth}px`} height={`${imgHeight}px`}>
        <Image src={imgSrc} width={imgWidth} height={imgHeight} />
      </Box>
      <Flex alignItems='center'>
        {alreadyNumber !== null && (
          <>
            <Text
              fontSize='24px'
              color={
                new BigNumber(alreadyNumber).isLessThan(number)
                  ? 'redText'
                  : '#fff'
              }
            >
              {formatLocalisedCompactBalance(alreadyNumber)}
            </Text>
            <Text fontSize='24px'>&nbsp;/&nbsp;</Text>
          </>
        )}
        <Text fontSize={alreadyNumber !== null ? '24px' : '30px'}>
          {formatLocalisedCompactBalance(Number(number))}
        </Text>
        <Text ml='16px' color={color} small>
          {unit}
        </Text>
      </Flex>
    </Group>
  );
};
