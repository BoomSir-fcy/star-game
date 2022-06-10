import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';

import { useTranslation } from 'contexts/Localization';

const AvatarIcon = styled(Box)`
  width: 293px;
  height: 293px;
  border: 2px solid #41b7ff;
  box-shadow: 0px 0px 9px 0px #41b7ff, inset 0px 0px 9px 0px #41b7ff;
  border-radius: ${({ theme }) => theme.radii.card};
`;

export const TipsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ visible, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <ModalWrapper
      title={t('GuideModalTips')}
      visible={visible}
      setVisible={onClose}
    >
      <Flex flexDirection='column' alignItems='center' padding='80px 25px'>
        <Text fontSize='24px' mt='36px'>
          {t(
            'Joining the task queue costs resources and cannot be cancelled. Whether to confirm to join the current task',
          )}
        </Text>
        <Flex justifyContent='space-between' mt='210px'>
          <Button onClick={onConfirm}>{t('Confirm')}</Button>
        </Flex>
      </Flex>
    </ModalWrapper>
  );
};
