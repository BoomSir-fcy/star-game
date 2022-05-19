import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps, Text, Flex, Button } from 'uikit';
import Modal from 'components/Modal';

const BoxStyled = styled(Box)`
  width: 281px;
  height: 204px;
  background: url('/images/plunder/round.png');
  background-size: 100% 100%;
  position: relative;
`;
const FlexStyled = styled(Flex)`
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 0;
  top: auto;
  left: 0;
  bottom: 0;
  margin: auto;
`;
const ButtonStyled = styled(Button).attrs({ variant: 'vs' })`
  width: 160px;
  height: 51px;
`;

interface RoundPanelProps extends BoxProps {
  roundName?: string;
  isEnemy?: boolean;
}

const RoundPanel: React.FC<RoundPanelProps> = ({
  roundName,
  isEnemy,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <BoxStyled {...props}>
      <FlexStyled>
        <Text shadow='primary' fontSize='24px' bold>
          {roundName || '--'}
        </Text>
        <Text shadow='primary' fontSize='22px' bold>
          {isEnemy ? 'Enemy actions' : 'Our actions'}
        </Text>
        <ButtonStyled mt='26px'>
          <Text shadow='primary' small bold>
            跳过
          </Text>
        </ButtonStyled>
      </FlexStyled>
      <Modal title='温馨提示' visible={visible} setVisible={setVisible}>
        <Text>是否跳过本轮战斗?</Text>
        <Text>(跳过不会影响本次战斗结果)</Text>
      </Modal>
    </BoxStyled>
  );
};

export default RoundPanel;
