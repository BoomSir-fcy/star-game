import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Text, Image } from 'uikit';
import Modal from 'components/Modal';
import DepositWithdrawal from 'components/NavPop/DepositWithdrawal';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';

const ButtonLeft = styled(Button)`
  width: 304px;
  height: 62px;
`;
const ButtonLeft1 = styled(ButtonLeft)``;
const ButtonLeft2 = styled(ButtonLeft)``;

const ButtonTag1 = styled(Button)`
  width: 274px;
  height: 110px;
`;
const ButtonTag2 = styled(Button)`
  width: 323px;
  height: 110px;
`;

interface InfoProps extends ButtonGroupProps {
  onTodo?: () => void;
}

const Info: React.FC<InfoProps> = ({ onRefresh, onBack, children }) => {
  const [visible, setVisible] = useState(false);
  const [ActiveToken, setActiveToken] = useState('DSG');

  return (
    <Box width='100%'>
      <Flex height='179px' width='100%'>
        <Box pl='11px' pt='20px'>
          <Box>
            <ButtonLeft1
              variant='custom'
              onClick={() => {
                setActiveToken('DSG');
                setVisible(true);
              }}
            >
              111
            </ButtonLeft1>
          </Box>
          <Box pt='13px'>
            <ButtonLeft2
              variant='custom'
              onClick={() => {
                setActiveToken('BOX');
                setVisible(true);
              }}
            >
              111
            </ButtonLeft2>
          </Box>
        </Box>
        <Flex ml='16px' pt='32px'>
          <Box>
            <Link to='/star'>
              <ButtonTag1 variant='custom'>月亮</ButtonTag1>
            </Link>
          </Box>
          <Box ml='18px'>
            <ButtonTag2 variant='custom'>月亮</ButtonTag2>
            <ButtonTag2 variant='custom' ml='8px'>
              月亮
            </ButtonTag2>
            <Link to='/test/card'>
              <ButtonTag2 variant='custom' ml='8px'>
                公共组件
              </ButtonTag2>
            </Link>
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
      <Modal
        title={`${ActiveToken}钱包`}
        visible={visible}
        setVisible={setVisible}
      >
        <DepositWithdrawal balance='1000' Token={ActiveToken} />
      </Modal>
    </Box>
  );
};

export default Info;
