import React from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';

const Addition = () => {
  const AdditionList = [
    {
      type: 1,
      total: 10,
      capacity: '0.32',
      speed: '1.5',
    },
    {
      type: 2,
      total: 10,
      capacity: '0.32',
      speed: '1.5',
    },
    {
      type: 3,
      total: 10,
      capacity: '0.32',
      speed: '1.5',
    },
  ];

  return (
    <Flex
      flex='1'
      flexDirection='column'
      justifyContent='space-between'
      padding='30px'
    >
      {AdditionList.map(item => (
        <ItemRow info={item} />
      ))}
    </Flex>
  );
};

interface AdditionInfo {
  type: number;
  total: number;
  capacity: string;
  speed: string;
}

const ItemRow: React.FC<{
  info: AdditionInfo;
}> = ({ info }) => {
  return (
    <Flex alignItems='flex-end'>
      <Flex flex='1'>
        <Image
          src={`/images/commons/icon/${
            info.type === 1 ? 'ore' : info.type === 2 ? 'population' : 'energy'
          }.png`}
          width={60}
          height={62}
        />
        <Box ml='24px'>
          <Text fontSize='22px'>总矿石:{info.total}</Text>
          <Text fontSize='22px'>总产能:{info.capacity}%</Text>
        </Box>
      </Flex>
      <Text fontSize='22px' color='profit'>
        +{info.speed}/s
      </Text>
    </Flex>
  );
};

export default Addition;
