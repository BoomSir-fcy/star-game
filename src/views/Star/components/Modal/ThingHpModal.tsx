import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import { TextList } from './TextList';
import { GameThing } from '../gameModel';

const AvatarIcon = styled(Box)`
  width: 293px;
  height: 293px;
  border: 2px solid #41b7ff;
  box-shadow: 0px 0px 9px 0px #41b7ff, inset 0px 0px 9px 0px #41b7ff;
  border-radius: ${({ theme }) => theme.radii.card};
`;

export const ThingHpModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <ModalWrapper title='HP值' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex>
          <AvatarIcon>
            <Image
              src='/images/commons/icon/avatar.png'
              width={293}
              height={293}
            />
          </AvatarIcon>
          <Flex flex='1' ml='23px' flexDirection='column'>
            <Text fontSize='34px'>神族</Text>
            <Box width='100%' mt='19px'>
              <Text color='textSubtle' small>
                1.神族经营类建筑采矿效率最高
              </Text>
              <Text color='textSubtle' small>
                2神族特色:神族建筑HP自动回复
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
