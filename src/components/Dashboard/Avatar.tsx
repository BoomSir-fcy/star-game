import Modal from 'components/Modal';
import InvitePop from 'components/NavPop/Invite';
import UserInfo from 'components/NavPop/userInfo';
import { useTranslation } from 'contexts/Localization';
import React, { useState } from 'react';
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
  const { t } = useTranslation();

  const [PopTitle, setPopTitle] = useState('');
  const [PopType, setPopType] = useState(0);
  const [visible, setVisible] = useState(false);

  return (
    <Box width='272px' position='relative'>
      <Box
        onClick={() => {
          setPopType(1);
          setPopTitle(t('指挥官'));
          setVisible(true);
        }}
      >
        <Box position='absolute' top={20} width='100%'>
          <Text textAlign='center'>盘哥</Text>
        </Box>
        <Box position='relative' zIndex={-1} width={224} mt='15px' ml='24px'>
          <Image src='/images/login/a-man.png' width={286} height={286} />
        </Box>
      </Box>
      <Box position='absolute' bottom='0' left='-4px' width='100%'>
        <ButtonStyled
          onClick={() => {
            setPopType(2);
            setPopTitle(t('邀请返利'));
            setVisible(true);
          }}
        >
          邀请返利
        </ButtonStyled>
      </Box>
      <Modal title={PopTitle} visible={visible} setVisible={setVisible}>
        {PopType === 1 ? (
          <UserInfo nftImage='/images/login/a-man.png' />
        ) : (
          <InvitePop />
        )}
      </Modal>
    </Box>
  );
};

export default Avatar;
