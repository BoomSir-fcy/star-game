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
  const Url = `${window.location.origin}?InviteAddress=${account}`;
  const Copy = () => {
    const aux = document.createElement('input');
    const content = Url;
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
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
    <Box width='100%' padding='50px 20px'>
      <Text mb='60px' fontSize='22px'>
        {t(
          'After inviting a friend to register a character and open a blind box, you can get 5% of the cost of each blind box opened by your friend as a reward',
        )}
      </Text>
      <ShaDowBox alignItems='center' justifyContent='space-between'>
        <Box>
          <Text mb='10px' color='textSubtle' fontSize='24px'>
            {t('Number of invitees')}
          </Text>
          <Text fontSize='22px'>{InviteInfo.invite_user_num}</Text>
        </Box>
        <Box>
          <Text mb='10px' color='textSubtle' fontSize='24px'>
            {t('Rebate')}
          </Text>
          <Text fontSize='22px'>{InviteInfo.bnb_income || 0} BNB</Text>
        </Box>
      </ShaDowBox>
      <ShaDowBox alignItems='center' justifyContent='space-between'>
        <Flex flex='1' maxWidth='60%'>
          <Image src='/images/commons/icon/plane.png' width={60} height={60} />
          <Box ml='30px'>
            <Text color='textSubtle' fontSize='24px'>
              {t('My inviter’s address')}
            </Text>
            <Text fontSize='22px' ellipsis maxWidth='350px'>
              {Url}
            </Text>
          </Box>
        </Flex>
        <Box>
          <Button variant='vs' onClick={() => Copy()}>
            {t('Copy Link')}
          </Button>
        </Box>
      </ShaDowBox>
    </Box>
  );
};

export default InvitePop;
