import React from 'react';
import { Flex, Box, Text, Button } from 'uikit';
import { useGuide } from 'hooks/useGuide';

import { useLocation } from 'react-router-dom';
import ModalWrapper from '.';

export const GuideModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const location = useLocation();
  const { setGuide } = useGuide(location.pathname);
  console.log(location.pathname);

  const closeGuide = async () => {
    await setGuide(-1, false);
    onClose();
  };

  return (
    <ModalWrapper title='温馨提示' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Text>下次登录是否继续上次的教程？ </Text>
        <Flex justifyContent='space-between' mt='50px'>
          <Button onClick={onClose}>确定</Button>
          <Button onClick={closeGuide}>永久关闭</Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
