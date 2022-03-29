import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import StarCom from 'components/StarCom';

const OpenModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOpen: (name: string) => Promise<void>;
}> = ({ visible, onClose, onOpen }) => {
  const [handleLoading, setHandleLoading] = useState(false);
  const [value, setValue] = useState('');

  const onHandleOpen = useCallback(async () => {
    setHandleLoading(true);
    await onOpen(value);
    setHandleLoading(false);
  }, [onOpen, setHandleLoading, value]);

  return (
    <ModalWrapper title='星球命名' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex>
          <Flex ml='23px' justifyContent='space-between'>
            <StarCom />
            <Box>
              <Text>星球昵称</Text>
              <Input primary />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};

export default OpenModal;
