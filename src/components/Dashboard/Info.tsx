import React from 'react';
import styled from 'styled-components';
import { Box, Button, Flex, Text, Image } from 'uikit';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';

const ButtonLeft = styled(Button)`
  width: 304px;
  height: 62px;
  /* left: 4px; */
`;
const ButtonLeft1 = styled(ButtonLeft)`
  background: url('/images/commons/dashboard/b2.png');
  /* top: 20px; */
`;
const ButtonLeft2 = styled(ButtonLeft)`
  background: url('/images/commons/dashboard/b3.png');
  /* top: 96px; */
`;

const ButtonTag1 = styled(Button)`
  width: 274px;
  height: 110px;
  background: url('/images/commons/dashboard/b5.png');
`;
const ButtonTag2 = styled(Button)`
  width: 323px;
  height: 110px;
  background: url('/images/commons/dashboard/b4.png');
`;

interface InfoProps extends ButtonGroupProps {
  onTodo?: () => void;
}

const Info: React.FC<InfoProps> = ({ onRefresh, onBack, children }) => {
  return (
    <Box width='100%'>
      <Flex height='179px' width='100%'>
        <Box pl='11px' pt='20px'>
          <Box>
            <ButtonLeft1 variant='custom'>111</ButtonLeft1>
          </Box>
          <Box pt='13px'>
            <ButtonLeft2 variant='custom'>111</ButtonLeft2>
          </Box>
        </Box>
        <Flex ml='32px' pt='32px'>
          <Box>
            <ButtonTag1 variant='custom'>月亮</ButtonTag1>
          </Box>
          <Box ml='18px'>
            <ButtonTag2 variant='custom'>月亮</ButtonTag2>
            <ButtonTag2 variant='custom' ml='8px'>
              月亮
            </ButtonTag2>
            <ButtonTag2 variant='custom' ml='8px'>
              月亮
            </ButtonTag2>
          </Box>
        </Flex>
      </Flex>
      <Flex
        // height='80px'
        justifyContent='space-between'
        alignItems='center'
        mt='18px'
      >
        <Box>{children}</Box>
        <ButtonGroup onRefresh={onRefresh} onBack={onBack} />
      </Flex>
    </Box>
  );
};

export default Info;
