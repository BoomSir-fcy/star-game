import React from 'react';
import { Flex, Box, Text, Button } from 'uikit';
import { useGuide } from 'hooks/useGuide';

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';

import ModalWrapper from '.';

export const ToRechargeModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  Recharge: () => void;
}> = ({ visible, onClose, Recharge }) => {
  const { t } = useTranslation();

  return (
    <ModalWrapper
      title={t('Insufficient platform balance')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='80px 25px'>
        <Text textAlign='center' fontSize='28px'>
          {t('Insufficient platform balance')}
        </Text>
        <Flex justifyContent='space-around' mt='150px'>
          <Button onClick={Recharge}>{t('Recharge')}</Button>
          <Button onClick={onClose}>{t('Close')}</Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
