import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image } from 'uikit';

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
}> = ({ imgWidth, imgHeight, imgSrc, number, unit }) => {
  return (
    <Group>
      <Box width={`${imgWidth}px`} height={`${imgHeight}px`}>
        <Image src={imgSrc} width={imgWidth} height={imgHeight} />
      </Box>
      <Flex alignItems='center'>
        <Text fontSize='34px'>{number}</Text>
        <Text ml='16px' color='textSubtle' small>
          {unit}
        </Text>
      </Flex>
    </Group>
  );
};
