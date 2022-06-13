import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import Modal from 'components/Modal';

const ModalQueue: React.FC<{
  callBack: (id) => void;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  plantId: number;
}> = ({ callBack, visible, setVisible, plantId }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  return (
    <Modal title={t('Stop Working')} visible={visible} setVisible={setVisible}>
      <Box width='100%' padding='100px 0'>
        <Text mb='150px' textAlign='center' fontSize='28px'>
          {t('InQueueHint')}
        </Text>
        <Flex justifyContent='space-around'>
          <Button width='270px' onClick={() => setVisible(false)}>
            {t('Cancel')}
          </Button>
          <Button width='270px' onClick={() => callBack(plantId)}>
            {t('Confirm')}
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default ModalQueue;
