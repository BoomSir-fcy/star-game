import Modal from 'components/Modal';
import InvitePop from 'components/NavPop/Invite';
import UserInfo from 'components/NavPop/userInfo';
import { useTranslation } from 'contexts/Localization';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, Image, Text, Button } from 'uikit';
import { useStore } from 'state/util';

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
  const { userInfo } = useStore(p => p.userInfo);

  const [PopTitle, setPopTitle] = useState('');
  const [PopType, setPopType] = useState(0);
  const [visible, setVisible] = useState(false);

  return (
    <Box width='272px' position='relative'>
      <Box
        onClick={() => {
          setPopType(1);
          setPopTitle(t('Commander'));
          setVisible(true);
        }}
      >
        <Box position='absolute' top={20} width='100%'>
          <Text textAlign='center'>{userInfo.nickname}</Text>
        </Box>
        <Box position='relative' zIndex={-1} width={224} mt='15px' ml='24px'>
          <Image
            src={userInfo.avatar || '/images/login/a-man.png'}
            width={286}
            height={286}
          />
        </Box>
      </Box>
      <Box position='absolute' bottom='0' left='-4px' width='100%'>
        <ButtonStyled
          onClick={() => {
            setPopType(2);
            setPopTitle(t('Invitation'));
            setVisible(true);
          }}
        >
          {t('Invitation')}
        </ButtonStyled>
      </Box>
      <Modal title={PopTitle} visible={visible} setVisible={setVisible}>
        {PopType === 1 ? <UserInfo /> : <InvitePop />}
      </Modal>
    </Box>
  );
};

export default Avatar;
