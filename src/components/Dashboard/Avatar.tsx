import React, { useState } from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import InvitePop from 'components/NavPop/Invite';
import UserInfo from 'components/NavPop/userInfo';
import { useTranslation } from 'contexts/Localization';
import { Box, Image, Text, Button } from 'uikit';
import { useStore } from 'state/util';

const BoxStyled = styled(Box)`
  background: url('/images/commons/dashboard/avatar.png');
  background-size: 100% 100%;
  width: 185px;
  height: 204px;
  position: relative;
`;

const ButtonStyled = styled(Button)`
  /* background: url('/images/commons/dashboard/a1.png'); */
  /* background-size: 100% 100%; */
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  width: 100%;
  padding: 0;
  margin: 0;
  text-shadow: none;
`;
const VipButton = styled(Button)`
  position: absolute;
  background: url('/images/commons/icon/icon-vip.png');
  background-size: cover;
  width: 28px;
  height: 28px;
  padding: 0;
  right: 10px;
  top: 10px;
`;

const Avatar = () => {
  const { t } = useTranslation();
  const { userInfo } = useStore(p => p.userInfo);

  const [PopTitle, setPopTitle] = useState('');
  const [PopType, setPopType] = useState(0);
  const [visible, setVisible] = useState(false);

  return (
    <BoxStyled position='relative'>
      {userInfo.vipBenefits?.is_vip && <VipButton variant='custom' />}
      <Box
        onClick={() => {
          setPopType(1);
          setPopTitle(t('Commander'));
          setVisible(true);
        }}
      >
        <Box position='absolute' top={15} width='100%'>
          <Text textAlign='center' bold ellipsis>
            {userInfo.nickname}
          </Text>
        </Box>
        <Box position='relative' zIndex={-1} width={146} mt='15px' ml='24px'>
          <Image
            src={userInfo.avatar || '/images/login/a-man.png'}
            width={146}
            height={143}
          />
        </Box>
      </Box>
      <Box position='absolute' bottom='-10px' left='-2px' width='100%'>
        <ButtonStyled
          onClick={() => {
            setPopType(2);
            setPopTitle(t('Invite to earn'));
            setVisible(true);
          }}
        >
          <Text small bold>
            {t('Invite to earn')}
          </Text>
        </ButtonStyled>
      </Box>
      <Modal title={PopTitle} visible={visible} setVisible={setVisible}>
        {PopType === 1 ? <UserInfo /> : <InvitePop />}
      </Modal>
    </BoxStyled>
  );
};

export default Avatar;
