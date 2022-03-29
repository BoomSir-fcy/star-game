import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';

const SelectBox = styled(Flex)`
  height: 65px;
  padding: 8px 16px;
  margin-bottom: 27px;
  background: #161920;
  border: 2px solid #282a2e;
  box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
  border-radius: ${({ theme }) => theme.radii.card};
`;

const InputBox = styled(Input)`
  padding: 23px 34px;
  height: 65px;
  border: 2px solid;
  border-image: linear-gradient(-29deg, #14f1fd, #1caaf4) 2 2;
  box-shadow: inset 0px 0px 20px 0px #f9f9f99c;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.backgroundCard};
  font-size: 20px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

export const RechargeAssets: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <ModalWrapper title='补充资源' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex justifyContent='space-between'>
          <Text small>星球储存罐</Text>
          <Flex alignItems='center'>
            <Text fontSize='30px' bold>
              10
            </Text>
            <Text small color='textSubtle' ml='14px'>
              /100
            </Text>
          </Flex>
        </Flex>
        <SelectBox>
          <Flex flex={1} alignItems='center' justifyContent='space-between'>
            <Flex alignItems='center' justifyContent='space-between'>
              <Box width='50px' height='50px'>
                <Image
                  width={50}
                  height={50}
                  src='/images/commons/icon/ore.png'
                  alt=''
                />
              </Box>
              <Text color='textSubtle' ml='15px' small>
                矿石
              </Text>
            </Flex>
            <Box
              width='22px'
              height='27px'
              style={{
                transform: 'rotate(90deg)',
              }}
            >
              <Image
                width={22}
                height={27}
                src='/images/commons/icon/icon_arrow_right.png'
                alt=''
              />
            </Box>
          </Flex>
        </SelectBox>
        <InputBox placeholder='请输入充值数量' />
        <Flex justifyContent='center' mt='29px'>
          <Button>确认充值</Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
