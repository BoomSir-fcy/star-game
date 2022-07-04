import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Button, Dots } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { getTimePeriod, useCountdownTime } from 'components';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'contexts/ToastsContext';
import { setState } from 'state/game/reducer';
import { GamePkState } from 'state/types';
import usePlunder from 'views/NewGalaxy/hook';
import { Api } from 'apis';

const SmText = styled(Text)`
  font-size: 16px;
`;

const TipsOccupiedModul: React.FC<{
  info: Api.Galaxy.StarInfo;
  setVisible: (e) => void;
}> = ({ setVisible, info }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { toastError, toastSuccess } = useToast();

  const { handlePlunder, handleGiveup } = usePlunder();

  const [pending, setPending] = useState(false);

  const hasOwner = info?.owner;
  const isOwner = useMemo(() => {
    return hasOwner?.toLowerCase() === account?.toLowerCase();
  }, [hasOwner, account]);

  // 保护时间
  const protect_timestamp = useMemo(() => {
    return dayjs.unix(info.protect_timestamp).year() === dayjs().year()
      ? info.protect_timestamp
      : 0;
  }, [info.protect_timestamp]);
  const diffSeconds = useCountdownTime(protect_timestamp, dayjs().unix());
  const timePeriod = useMemo(() => {
    return getTimePeriod(diffSeconds);
  }, [diffSeconds]);

  // 抢夺
  const handleAttckStar = useCallback(async () => {
    if (info?.owner) {
      setPending(true);
      dispatch(setState(GamePkState.CONFIRMING));
      const res = await handlePlunder({
        nft_id: info.token_id,
        number: info.number,
      });
      if (res) {
        dispatch(setState(GamePkState.START));
        navigate(`/plunder-pk?pid0=${info?.owner}`);
      } else {
        dispatch(setState(GamePkState.MATCHED));
      }
      setPending(false);
    }
  }, [info, dispatch, navigate, handlePlunder]);

  // 占领
  const handleHold = useCallback(async () => {
    try {
      setPending(true);
      const res = await Api.GalaxyApi.holdStar(info.token_id, info.number);
      if (Api.isSuccess(res)) {
        toastSuccess(t('Occupy Succeeded'));
        setPending(false);
        setVisible(false);
      }
    } catch (error) {
      toastError(t('Occupy Failed'));
      setPending(false);
    }
  }, [info, setVisible, toastSuccess, toastError, t]);

  // 放弃占领
  const handleGiveupStar = useCallback(async () => {
    if (info?.owner) {
      setPending(true);
      const res = await handleGiveup({
        nft_id: info.token_id,
        number: info.number,
      });
      if (res) {
        toastSuccess(t('Give up Occupy Succeeded'));
        setVisible(false);
      } else {
        toastError(t('Give up Occupy Failed'));
      }
      setPending(false);
    }
  }, [info, handleGiveup, setVisible, t, toastError, toastSuccess]);

  return (
    <Box width='100%' padding='100px 0'>
      <Text color='textPrimary' mb='40px' textAlign='center' fontSize='20px'>
        {t('Challenge ticket %num%BOX', { num: info.cost_star })}
      </Text>
      <Flex mb='150px' justifyContent='space-around'>
        <SmText>
          {t('Give to the stellar master:')}
          &nbsp; &nbsp;
          {info.planet_owner_star}BOX
        </SmText>
        <SmText>
          {t('Rewards Pool get:')}
          &nbsp; &nbsp;
          {info.staking_pool_star}BOX
        </SmText>
        <SmText>
          {t('Burn:')}
          &nbsp; &nbsp;
          {info.destroy_star}BOX
        </SmText>
      </Flex>
      <Flex justifyContent='center'>
        <Button
          disabled={diffSeconds > 0 || pending || isOwner}
          variant='purple'
          height='45px'
          width='270px'
          onClick={handleAttckStar}
        >
          {diffSeconds > 0 ? (
            `${t('Cooling')}:${timePeriod.minutes}${t('m')}${
              timePeriod.seconds
            }${t('s')}`
          ) : (
            <Text color='textPrimary' fontSize='16px' bold>
              {pending ? <Dots>{t('Seize Star')}</Dots> : t('Seize Star')}
            </Text>
          )}
        </Button>
      </Flex>
    </Box>
  );
};

export default TipsOccupiedModul;
