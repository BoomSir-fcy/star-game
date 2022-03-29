import React from 'react';
import { Box, Flex, Text, Button } from 'uikit';
import styled from 'styled-components';

const ShaDowBox = styled(Flex)`
  height: 180px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 24px 44px;
`;

const InfoFoot = () => {
  return (
    <ShaDowBox alignItems='center'>
      <Flex flex='1' flexDirection='column' justifyContent='space-between'>
        <Text shadow='primary' fontSize='28px' bold>
          战斗力 55044
        </Text>
        <Box>
          <Text fontSize='22px'>*联盟掠夺出战顺序，将按照序号升序掠夺</Text>
          <Text fontSize='22px'>*超过20%可参与资源掠夺</Text>
        </Box>
      </Flex>
      <Button variant='stop'>停止工作</Button>
    </ShaDowBox>
  );
};

export default InfoFoot;
