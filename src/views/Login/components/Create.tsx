import React, { useCallback, useState, useImperativeHandle } from 'react';
import Chance from 'chance';
import { Box, TweenText, Flex, Input, Label, Button, Text } from 'uikit';
import { ManAvatar, WoManAvatar } from 'components/Avatar';
import { Gender } from 'state/types';
import styled from 'styled-components';

const chance = new Chance();

const BoxStyled = styled(Box)`
  background: url('/images/login/b1.png') no-repeat center;
  height: 788px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopBox = styled(Box)`
  background: url('/images/login/t1.png') center;
  width: 580px;
  height: 76px;
  text-align: center;
  padding-top: 26px;
`;

export interface ForwardRefRenderProps {
  getState: () => { name: string; gender: Gender };
}

const Create: React.ForwardRefRenderFunction<ForwardRefRenderProps, any> = (
  p,
  ref,
) => {
  const [gender, setGender] = useState(Gender.MAN);
  const [name, setName] = useState('');

  const randomName = useCallback(() => {
    setName(chance.name());
  }, [setName]);

  useImperativeHandle(ref, () => ({
    getState() {
      return { gender, name };
    },
  }));

  return (
    <BoxStyled>
      <TopBox>
        <TweenText to='指挥官！请为自己创建一个身份' from='' />
      </TopBox>
      <Flex width='540px' mt='28px' justifyContent='space-between'>
        <ManAvatar
          onClick={() => {
            return setGender(Gender.MAN);
          }}
          active={gender === Gender.MAN}
        />
        <WoManAvatar
          onClick={() => {
            return setGender(Gender.WOMAN);
          }}
          active={gender === Gender.WOMAN}
        />
      </Flex>
      <Label mt={22} width={603} pr='18px'>
        <Input
          value={name}
          onChange={event => {
            setName(event.target.value);
          }}
          placeholder='输入您想要的名称'
        />
        <Button variant='text'>
          <Box onClick={randomName} width='37px'>
            <img alt='' src='/images/login/round.png' />
          </Box>
        </Button>
      </Label>
      <Text mt={32} small>
        需要消耗100 DSG创建，系统将通过BNB即时交易等额DSG创建身份
      </Text>
    </BoxStyled>
  );
};

export default React.forwardRef(Create);
