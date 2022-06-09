import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';

const ConfirnButton = styled(Button)`
  display: block;
  width: 270px;
  height: 70px;
  margin: 120px auto 0;
  border-radius: 20px;
  text-align: center;
`;

export const CancelModal: React.FC<{
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onComplete: () => void;
}> = ({ visible, title, content, onClose, onComplete }) => {
  return (
    <ModalWrapper title={title} visible={visible} setVisible={onClose}>
      <Box padding='65px' width='100%'>
        <Text>{content}</Text>
        <ConfirnButton onClick={onComplete}>确定</ConfirnButton>
      </Box>
    </ModalWrapper>
  );
};
