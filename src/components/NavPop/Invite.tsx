import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';

const ShaDowBox = styled(Flex)`
  width: 100%;
  height: 124px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 22px 40px;
  margin-bottom: 40px;
`;

const InvitePop: React.FC = () => {
  const { toastError, toastSuccess, toastWarning } = useToast();

  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [InviteInfo, setInviteInfo] = useState({
    invite_user_num: 0,
    bnb_income: '0',
  });
  const Copy = () => {
    const aux = document.createElement('input');
    const content = 'https://star.game.box';
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    toastSuccess('复制成功');
  };

  useEffect(() => {
    const getUserInvite = async () => {
      try {
        const res = await Api.UserApi.getInvite();
        if (Api.isSuccess(res)) {
          const { invite_user_num, bnb_income } = res.data;
          setInviteInfo({
            invite_user_num,
            bnb_income,
          });
        }
      } catch (error) {
        toastError('获取信息失败');
      }
    };
    getUserInvite();
  }, []);

  return (
    <Box width='100%' padding='50px 20px'>
      <Text mb='60px' fontSize='22px'>
        {t(
          '邀请好友注册角色，并抽取盲盒后，你能获得好友每次抽盲盒费用的5%作为奖励',
        )}
      </Text>
      <ShaDowBox alignItems='center' justifyContent='space-between'>
        <Box>
          <Text mb='10px' color='textSubtle' fontSize='24px'>
            {t('邀请人数')}
          </Text>
          <Text fontSize='22px'>{InviteInfo.invite_user_num}</Text>
        </Box>
        <Box>
          <Text mb='10px' color='textSubtle' fontSize='24px'>
            {t('获得返利')}
          </Text>
          <Text fontSize='22px'>{InviteInfo.bnb_income || 0} BNB</Text>
        </Box>
      </ShaDowBox>
      <ShaDowBox alignItems='center' justifyContent='space-between'>
        <Flex flex='1'>
          <Image src='/images/commons/icon/plane.png' width={60} height={60} />
          <Box ml='30px'>
            <Text color='textSubtle' fontSize='24px'>
              {t('我的邀请地址')}
            </Text>
            <Text fontSize='22px'>https://star.game.box</Text>
          </Box>
        </Flex>
        <Box>
          <Button variant='vs' onClick={() => Copy()}>
            复制链接
          </Button>
        </Box>
      </ShaDowBox>
    </Box>
  );
};

export default InvitePop;
