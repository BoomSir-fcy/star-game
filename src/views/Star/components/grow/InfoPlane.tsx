import React from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Image, Text } from 'uikit';

const TopBox = styled(Flex)`
  width: 160px;
  height: 109px;
  align-items: center;
  justify-content: center;
`;
const TopBox1 = styled(TopBox)`
  background: url('/images/grow/left.png') center left no-repeat;
  text-align: left;
  margin-left: 16px;
`;
const TopBox2 = styled(TopBox)`
  background: url('/images/grow/right.png') center right no-repeat;
  text-align: right;
  margin-right: 16px;
`;

const RightBox = styled(Flex)`
  width: 180px;
  height: 97px;
  align-items: center;
  margin-left: 30px;
`;

const InfoPlane = () => {
  return (
    <Card pt='8px' width={434} height={490}>
      <Flex justifyContent='space-between' alignItems='center'>
        <TopBox1>
          <Text bold fontSize='24px'>
            强化 +3
          </Text>
        </TopBox1>
        <Box width={82}>
          <Image
            width={82}
            height={42}
            src='/images/commons/icon/upgrade.png'
          />
        </Box>
        <TopBox2>
          <Text bold fontSize='24px'>
            强化 +3
          </Text>
        </TopBox2>
      </Flex>
      <Flex margin='12px 0' alignItems='center' justifyContent='center'>
        <Flex flex={1} justifyContent='center'>
          <Text fontSize='20px'>掠夺速度 10</Text>
        </Flex>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <Flex flex={1} justifyContent='center'>
          <Text fontSize='20px'>掠夺速度 10</Text>
        </Flex>
      </Flex>
      <Flex alignItems='flex-end' justifyContent='center'>
        <RightBox>
          <Image width={85} height={85} src='/images/commons/icon/ore.png' />
          <Box>
            <Text color='textTips' fontSize='20px'>
              矿石产能
            </Text>
            <Text fontSize='22px'>0.1/s</Text>
          </Box>
        </RightBox>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <RightBox>
          <Box>
            <Text fontSize='20px'>矿石产能</Text>
            <Flex>
              <Image width={33} height={33} src='/images/commons/icon/up.png' />
              <Text fontSize='22px' color='up'>
                1.1/s
              </Text>
            </Flex>
          </Box>
        </RightBox>
      </Flex>
      <Flex alignItems='flex-end' justifyContent='center'>
        <RightBox>
          <Image width={85} height={85} src='/images/commons/icon/ore.png' />
          <Box>
            <Text color='textTips' fontSize='20px'>
              矿石产能
            </Text>
            <Text fontSize='22px'>0.1/s</Text>
          </Box>
        </RightBox>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <RightBox>
          <Box>
            <Text fontSize='20px'>矿石产能</Text>
            <Flex>
              <Image width={33} height={33} src='/images/commons/icon/up.png' />
              <Text fontSize='22px' color='up'>
                1.1/s
              </Text>
            </Flex>
          </Box>
        </RightBox>
      </Flex>
      <Flex alignItems='flex-end' justifyContent='center'>
        <RightBox>
          <Image width={85} height={85} src='/images/commons/icon/ore.png' />
          <Box>
            <Text color='textTips' fontSize='20px'>
              矿石产能
            </Text>
            <Text fontSize='22px'>0.1/s</Text>
          </Box>
        </RightBox>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <RightBox>
          <Box>
            <Text fontSize='20px'>矿石产能</Text>
            <Flex>
              <Image width={33} height={33} src='/images/commons/icon/up.png' />
              <Text fontSize='22px' color='up'>
                1.1/s
              </Text>
            </Flex>
          </Box>
        </RightBox>
      </Flex>
    </Card>
  );
};

export default InfoPlane;
