import React from 'react';
import styled from 'styled-components';
import { Box, Image, Text, Flex, BorderCard, BorderCardProps } from 'uikit';
import PreviewSoldier from 'views/Star/Embattle/components/PreviewSoldier';

const WaitPlunderList: React.FC<BorderCardProps> = ({ ...props }) => {
  return (
    <BorderCard padding='16px 24px' width='430px'>
      <Text mb='14px' small>
        等待上阵
      </Text>
      <Flex>
        <BorderCard
          width={100}
          height={100}
          borderWidth={2}
          borderRadius='10px'
          position='relative'
          padding='5px 10px'
          mr='13px'
          isActive
        >
          <Text textAlign='right' small>
            1
          </Text>
          <Image
            src='/assets/modal/m0-1.png'
            width={70}
            height={70}
            mt='-15px'
            ml='6px'
          />
        </BorderCard>
        <BorderCard
          width={100}
          height={100}
          borderWidth={2}
          borderRadius='10px'
          position='relative'
          padding='5px 10px'
          isActive
        >
          <Text textAlign='right' small>
            1
          </Text>
          {/* <PreviewSoldier sid={1} width='70px' height='70px' /> */}
          <Image
            src='/assets/modal/m0-1.png'
            width={70}
            height={70}
            mt='-15px'
            ml='6px'
          />
        </BorderCard>
      </Flex>
    </BorderCard>
  );
};

export default WaitPlunderList;
