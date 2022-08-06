import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import { useTranslation } from 'contexts/Localization';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { storeAction } from 'state';

export const UpUnsuccessfulModal: React.FC<{
  planetId: number;
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose, planetId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <ModalWrapper title={t('Tips')} visible={visible} setVisible={onClose}>
      <Box padding='65px 40px 0' width='100%'>
        <Text mb='40px' bold fontSize='18px' width='100%' textAlign='center'>
          {t('UpErr1')}
        </Text>
        <Text mb='10px' fontSize='16px'>
          {t('UpErr2')}
        </Text>
        <Text mb='50px' fontSize='16px'>
          {t('UpErr3')}
        </Text>
        <Box margin='0 auto' width='max-content'>
          <Button
            variant='purple'
            width='max-content'
            height='45px'
            padding='0 15px'
            onClick={() => {
              onClose();
              dispatch(storeAction.setUpgradeUnsuccessful(true));
              navigate(`/star?id=${planetId}`, { replace: true });
            }}
          >
            <Text>{t('UpErrBtn3')}</Text>
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
