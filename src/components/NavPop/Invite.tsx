import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { TokenImage } from 'components/TokenImage';
import { getBoxAddress } from 'utils/addressHelpers';

const ShaDowBox = styled(Flex)`
  width: 32%;
  height: 100px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 10px;
`;

const InvitePop: React.FC = () => {
  const { toastError, toastSuccess, toastWarning } = useToast();

  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [InviteInfo, setInviteInfo] = useState({
    invite_user_num: 0,
    bnb_income: '0',
  });
  const Url = `Crypto Galaxy is a blockchain SLG game built on BNBChain.\nGamers can create accounts to purchase, upgrade and cultivate planets, and develop their Planet Alliances to start Galaxy Exploration, discover resources, fight against other planets' lords, or make a fortune by occupying stars.\nJoin your friend via link:\n${window.location.origin}?InviteAddress=${account}`;

  const Copy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = Url;
    document.body.appendChild(textarea); // 添加临时实例
    textarea.select(); // 选择实例内容
    document.execCommand('Copy'); // 执行复制
    document.body.removeChild(textarea); // 删除临时实例
    toastSuccess(t('Copy Succeeded'));
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
        console.error(error);
      }
    };
    getUserInvite();
  }, []);

  return (
    <Box width='100%' padding='30px'>
      <Box mb='30px'>
        <Text>{t('InviteDesc1')}</Text>
        <Text>{t('InviteDesc1-1')}</Text>
        <Text>{t('InviteDesc1-2')}</Text>
      </Box>
      <Flex mb='40px' justifyContent='space-between'>
        <ShaDowBox alignItems='center'>
          <Image src='/images/commons/icon/plane.png' width={30} height={30} />
          <Box ml='30px'>
            <Text mb='10px' color='textSubtle'>
              {t('Number of invitees')}
            </Text>
            <Text>{InviteInfo.invite_user_num}</Text>
          </Box>
        </ShaDowBox>
        <ShaDowBox alignItems='center'>
          <TokenImage tokenAddress='BNB' width={30} height={30} />
          <Box ml='30px'>
            <Text mb='10px' color='textSubtle'>
              {t('Rebate')}
            </Text>
            <Text>{InviteInfo.bnb_income || 0} BNB</Text>
          </Box>
        </ShaDowBox>

        <ShaDowBox alignItems='center'>
          <TokenImage tokenAddress={getBoxAddress()} width={30} height={30} />
          <Box ml='30px'>
            <Text mb='10px' color='textSubtle'>
              {t('Rebate')}
            </Text>
            <Text>{InviteInfo.bnb_income || 0} BOX</Text>
          </Box>
        </ShaDowBox>
      </Flex>
      <Flex flex={1} justifyContent='center'>
        <Button variant='purple' width='250px' onClick={() => Copy()}>
          {t('Copy Link')}
        </Button>
      </Flex>
    </Box>
  );
};

export default InvitePop;
