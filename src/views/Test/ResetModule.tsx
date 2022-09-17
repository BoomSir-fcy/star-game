import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';

const ResetModule: React.FC<{
  callBack: () => void;
}> = ({ callBack }) => {
  const { t } = useTranslation();

  return (
    <Box width='100%' padding='100px 0'>
      <Text mb='150px' textAlign='center' fontSize='28px'>
        确定重置数据
      </Text>
      <Flex justifyContent='center'>
        <Button width='270px' onClick={callBack}>
          确定
        </Button>
      </Flex>
    </Box>
  );
};

export default ResetModule;
