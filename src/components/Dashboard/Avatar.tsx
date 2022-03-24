import React from 'react';
import styled from 'styled-components';
import { Box, Image, Text, Button } from 'uikit';

const ButtonStyled = styled(Button)`
  background: url('/images/commons/dashboard/a1.png');
  background-size: 100% 100%;
  border: none;
  outline: none;
  box-shadow: none;
  width: 100%;
  padding: 0;
  margin: 0;
  text-shadow: none;
`;

const Avatar = () => {
  return (
    <Box width='272px' position='relative'>
      <Box position='absolute' top={20} width='100%'>
        <Text textAlign='center'>盘哥</Text>
      </Box>
      <Box position='relative' zIndex={-1} width={224} mt='15px' ml='24px'>
        <Image src='/images/login/a-man.png' width={286} height={286} />
      </Box>
      <Box position='absolute' bottom='0' left='-4px' width='100%'>
        <ButtonStyled>邀请返利</ButtonStyled>
      </Box>
    </Box>
  );
};

export default Avatar;
