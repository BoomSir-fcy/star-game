import React from 'react';
import { Box, Flex, Button, Text } from 'uikit';
import ModalWrapper from 'components/Modal';
import { TextList } from './TextList';
import { GameThing } from '../gameModel';

export const ThingRepairModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <ModalWrapper title='修复耐久' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex>
          <GameThing scale='lg' border />
          <Flex
            flex='1'
            ml='23px'
            justifyContent='space-between'
            alignItems='flex-start'
            flexDirection='column'
          >
            <Box width='100%'>
              <Text small>修复所有耐久需支付</Text>

              <TextList
                imgWidth={50}
                imgHeight={50}
                imgSrc='/images/commons/dsg-1.png'
                number='100'
                unit='DSG'
              />

              <TextList
                imgWidth={50}
                imgHeight={50}
                imgSrc='/images/commons/star/durability.png'
                number='50/100'
                unit='耐久度'
              />
            </Box>
            <Button>确认修复</Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};