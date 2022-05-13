import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';

const StopWorkPop: React.FC<{
  callBack: () => void;
}> = ({ callBack }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  return (
    <Box width='100%' padding='100px 0'>
      <Text mb='150px' textAlign='center' fontSize='28px'>
        {t(
          'After stopping work, resources will not be produced or consumed. Do you want to stop working?',
        )}
      </Text>
      <Flex justifyContent='center'>
        <Button width='270px' onClick={callBack}>
          {t('Confirm Stop')}
        </Button>
      </Flex>
    </Box>
  );
};

export default StopWorkPop;
