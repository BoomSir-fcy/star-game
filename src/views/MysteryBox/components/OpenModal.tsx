import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, PrimaryInput, Button, Text, Dots } from 'uikit';
import ModalWrapper from 'components/Modal';
import StarCom from 'components/StarCom';
import { useTranslation } from 'contexts/Localization';

const OpenModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOpen: (name: string) => Promise<void>;
}> = ({ visible, onClose, onOpen }) => {
  const { t } = useTranslation();
  const [handleLoading, setHandleLoading] = useState(false);
  const [value, setValue] = useState('');

  const onHandleOpen = useCallback(async () => {
    setHandleLoading(true);
    await onOpen(value);
    setHandleLoading(false);
  }, [onOpen, setHandleLoading, value]);

  return (
    <ModalWrapper
      title={t('Planet naming')}
      visible={visible}
      setVisible={onClose}
    >
      <Box mt='120px' padding='30px 25px'>
        <Flex justifyContent='center'>
          <StarCom scale='ld' />
          <Flex ml='35px' justifyContent='space-between' flexDirection='column'>
            <Box>
              <Text mt='-6px'>{t('Planet nickname')}</Text>
              <PrimaryInput
                width={387}
                height={65}
                mt='26px'
                value={value}
                onChange={event => {
                  setValue(event.target.value);
                }}
                placeholder={t('Please enter planet nickname')}
              />
              <Text mt='8px'>{t('Limit 5-20 characters')}</Text>
            </Box>
            <Button
              disabled={handleLoading}
              onClick={onHandleOpen}
              width={270}
              height={70}
            >
              {handleLoading ? <Dots>{t('Confirming')}</Dots> : t('Confirm')}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};

export default OpenModal;
