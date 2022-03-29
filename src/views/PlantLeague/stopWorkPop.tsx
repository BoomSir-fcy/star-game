import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';

const StopWorkPop = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  return (
    <Box width='100%' padding='100px 0'>
      <Text mb='150px' textAlign='center' fontSize='28px'>
        停止工作将无法正常生产资源，也不会消耗资源。是否停止工作？
      </Text>
      <Flex justifyContent='center'>
        <Button width='270px'>确认停止</Button>
      </Flex>
    </Box>
  );
};

export default StopWorkPop;
