import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, PrimaryInput, Button, Text, Dots } from 'uikit';
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
      <Box mt='120px' padding='30px 25px'>
        <Flex justifyContent='center'>
          <StarCom scale='ld' />
          <Flex ml='35px' justifyContent='space-between' flexDirection='column'>
            <Box>
              <Text mt='-6px'>星球昵称</Text>
              <PrimaryInput
                width={387}
                height={65}
                mt='26px'
                value={value}
                onChange={event => {
                  setValue(event.target.value);
                }}
                placeholder='请输入星球昵称'
              />
              <Text mt='8px'>限制5-20个字符</Text>
            </Box>
            <Button
              disabled={handleLoading}
              onClick={onHandleOpen}
              width={270}
              height={70}
            >
              {handleLoading ? <Dots>确定中</Dots> : '确定'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};

export default OpenModal;
