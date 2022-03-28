import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import { GameThing } from '../gameModel';

export const ThingDestoryModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <ModalWrapper title='摧毁建筑' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex>
          <GameThing scale='lg' border />
          <Flex ml='23px' justifyContent='space-between' flexDirection='column'>
            <Box>
              <Text shadow='primary' bold>
                矿石建筑
              </Text>
              <Text color='textSubtle' mt='22px' small>
                作用：储存星球建筑产出的所有资源
              </Text>
            </Box>
            <Button>确认摧毁</Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
