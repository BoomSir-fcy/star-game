import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import { ThingaddBlood, GameThing, ThingRepair } from '..';

const UpgradeItem: React.FC<{
  moreButton?: React.ReactNode;
}> = ({ moreButton }) => {
  return (
    <Flex alignItems='center'>
      <Box width='50px' height='50px'>
        <Image width={50} height={50} src='/images/commons/star/HP.png' />
      </Box>
      <Box ml='9px'>
        <Flex alignItems='center'>
          <Text color='textSubtle' small>
            HP值
          </Text>
          {moreButton}
        </Flex>
        <Flex alignItems='center'>
          <Text small>10/80</Text>
          <Text ml='14px' color='textDanger' small>
            +1
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export const ThingUpgradesModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <ModalWrapper title='建筑升级' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex alignItems='center'>
          <Text shadow='primary'>矿石建筑</Text>
          <Text ml='27px' small>
            2x2
          </Text>
        </Flex>
        <Flex>
          <UpgradeItem moreButton={<ThingaddBlood />} />
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
