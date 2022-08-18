import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { TokenImage } from 'components/TokenImage';
import { getBoxAddress } from 'utils/addressHelpers';
import { fetchInviteInfoViewAsync } from 'state/userInfo/reducer';
import { useDispatch } from 'react-redux';
import { useStore } from 'state';
import { useImmer } from 'use-immer';

const ShaDowBox = styled(Flex)`
  width: 48%;
  height: 100%;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 10px;
`;

const ListBox = styled(Box)`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
`;

const ScrollBox = styled(Box)`
  width: 100%;
  height: 140px;
  overflow-y: auto;
  padding: 0 20px;
`;

const InvitePop: React.FC = () => {
  const { toastError, toastSuccess, toastWarning } = useToast();

  const { t } = useTranslation();
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  const { userInviteInfo, InviteInfoEnd, InviteInfoLoading } = useStore(
    p => p.userInfo,
  );

  const [InviteInfo, setInviteInfo] = useState([]);

  const [state, setState] = useImmer({
    page: 1,
    page_size: 10,
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

  const loadMore = useCallback(
    (e: any) => {
      const { offsetHeight, scrollTop, scrollHeight } = e.nativeEvent.target;

      if (offsetHeight + scrollTop >= scrollHeight - 150) {
        if (InviteInfoLoading || InviteInfoEnd) return; // 判断是否在请求状态或者已到最后一页
        setState(p => {
          return { ...p, page: p.page + 1 };
        });
      }
    },
    [InviteInfoLoading, InviteInfoEnd, setState],
  );

  useEffect(() => {
    const data = userInviteInfo.invite_reward;
    if (data.length) {
      setInviteInfo(data);
    }
  }, [userInviteInfo.invite_reward]);

  useEffect(() => {
    dispatch(
      fetchInviteInfoViewAsync({
        page: state.page,
        page_size: state.page_size,
      }),
    );
  }, [dispatch, state]);

  return (
    <Box width='100%' padding='20px 40px'>
      <Box mb='30px'>
        <Text>{t('InviteDesc1')}</Text>
        <Text>{t('InviteDesc1-1')}</Text>
        <Text>{t('InviteDesc1-2')}</Text>
      </Box>
      <Flex mb='20px' justifyContent='space-between'>
        <ListBox pb='10px'>
          <Flex
            padding='20px 20px 0 20px'
            mb='10px'
            justifyContent='space-between'
            alignItems='center'
          >
            <Text color='textSubtle'>{t('Invitation address')}</Text>
            <Text color='textSubtle'>
              {t('Rebate')}
              (BNB)
            </Text>
          </Flex>
          <ScrollBox onScroll={loadMore}>
            {(InviteInfo || []).map(item => (
              <Flex
                key={item.sender}
                mb='10px'
                justifyContent='space-between'
                alignItems='center'
              >
                <Text>{item.sender}</Text>
                <Text>{item.reward}</Text>
              </Flex>
            ))}
          </ScrollBox>
        </ListBox>
        {/* <ShaDowBox alignItems='center'>
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
        </ShaDowBox> */}

        {/* <ShaDowBox alignItems='center'>
          <TokenImage tokenAddress={getBoxAddress()} width={30} height={30} />
          <Box ml='30px'>
            <Text mb='10px' color='textSubtle'>
              {t('Rebate')}
            </Text>
            <Text>{InviteInfo.bnb_income || 0} BOX</Text>
          </Box>
        </ShaDowBox> */}
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
