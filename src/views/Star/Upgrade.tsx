import StarAddBtn from 'components/StarAddBtn';
import React from 'react';
import styled from 'styled-components';
import { Image, Flex, Text, BgCard, FlexProps, Card, Heading } from 'uikit';
import { GradeBox, UpgradeCard } from './components/upgrade';

const Upgrade = () => {
  return (
    <BgCard variant='big' padding='40px 68px'>
      <Flex flexDirection='column'>
        <Flex alignItems='center'>
          <Flex width='320px' alignItems='center'>
            <GradeBox>
              <Text bold shadow='primary'>
                Lv 1
              </Text>
            </GradeBox>
            <Image
              width={82}
              height={42}
              margin='0 28px'
              src='/images/commons/icon/upgrade.png'
            />
            <GradeBox>
              <Text bold color='legend' shadow='secondary'>
                Lv 2
              </Text>
            </GradeBox>
          </Flex>
          <Flex ml='50px'>
            <StarAddBtn />
            <StarAddBtn />
            <StarAddBtn />
            <StarAddBtn />
            <StarAddBtn />
          </Flex>
        </Flex>
        <Flex>
          <UpgradeCard />
        </Flex>
      </Flex>
    </BgCard>
  );
};

export default Upgrade;
