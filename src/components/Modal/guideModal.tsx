import React from 'react';
import { Flex, Box, Text, Button } from 'uikit';
import { useGuide } from 'hooks/useGuide';

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import ModalWrapper from '.';

export const GuideModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { setGuide } = useGuide(location.pathname);

  const closeGuide = async () => {
    await setGuide(-1, true);
    onClose();
  };

  return (
    <ModalWrapper
      title={t('GuideModalTips')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='80px 25px'>
        <Text>{t('GuideModalText')}</Text>
        <Flex justifyContent='space-between' mt='300px'>
          <Button onClick={onClose}>{t('GuideModalButtonConfirn')}</Button>
          <Button onClick={closeGuide}>{t('GuideModalButtonClose')}</Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
