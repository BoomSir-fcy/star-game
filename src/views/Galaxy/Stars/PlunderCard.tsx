import { useWeb3React } from '@web3-react/core';
import { Api } from 'apis';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setState } from 'state/game/reducer';
import { GamePkState } from 'state/types';
import { Button, Text, Flex, BgCard, Image, Dots } from 'uikit';
import { PeopleCard } from 'views/Plunder/components';
import { GalaxyImage } from '../components/GalaxyImage';
import usePlunder from '../hooks/usePlunder';
import { ButtonStyled, BgCardStyled, PkPeopleCard } from './style';

export const PlunderCard: React.FC<{
  info: Api.Galaxy.StarInfo;
  onClose: () => void;
}> = ({ info, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { toastError, toastSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const [pkUser, setPkUser] = useState<Api.Alliance.PlunderInfoMatchUser>({
    address: '',
    ak: 0,
    avatar: '',
    build_count: 0,
    df: 0,
    hp: 0,
    nick_name: '',
    planet_count: 0,
    power: 0,
  });
  const hasOwner = info.owner;

  const { handlePlunder } = usePlunder();

  const getPlunderInfo = useCallback(async () => {
    const res = await Api.AllianceApi.alliancePlunderInfo(info.owner);
    if (Api.isSuccess(res)) {
      setPkUser(res.data);
    }
  }, [info]);

  useEffect(() => {
    if (hasOwner) {
      // getPlunderInfo();
    }
  }, [hasOwner]);

  // 抢夺
  const handleAttckStar = useCallback(async () => {
    // if (info?.owner) {
    //   setPending(true);
    //   dispatch(setState(GamePkState.CONFIRMING));
    //   const res = await handlePlunder({
    //     nft_id: info.token_id,
    //     number: info.number,
    //   });
    //   if (res) {
    //     dispatch(setState(GamePkState.START));
    //     navigate('/plunder-pk');
    //   } else {
    //     dispatch(setState(GamePkState.MATCHED));
    //   }
    //   setPending(false);
    // }
  }, []);

  // 占领
  const handleHold = useCallback(async () => {
    try {
      setPending(true);
      const res = await Api.GalaxyApi.holdStar(info.token_id, info.number);
      if (Api.isSuccess(res)) {
        toastSuccess(t('Occupied succeeded'));
        setPending(false);
        onClose();
      }
    } catch (error) {
      toastError(t('Occupied failed'));
      setPending(false);
    }
  }, [info, onClose, toastSuccess, toastError, t]);

  return (
    <BgCardStyled variant='small' fringe>
      <Flex flexDirection='column' alignItems='center'>
        {hasOwner ? (
          <PkPeopleCard {...pkUser} />
        ) : (
          <GalaxyImage width={395} height={395} />
        )}
        <Flex alignItems='flex-end'>
          <Flex flexDirection='column'>
            <Text mb='10px' shadow='tertiary' fontSize='28px' bold>
              {t('Star')} Lv: {info.number}
            </Text>
            <Text shadow='primary' small bold>
              {t('Output')} BOX: {info.disapth_box}
            </Text>
            <Text shadow='primary' small bold>
              {t('Occupied')}: {info.history_hold_number}
            </Text>
          </Flex>
          {hasOwner ? (
            <ButtonStyled
              disabled={
                pending || hasOwner?.toLowerCase() === account?.toLowerCase()
              }
              scale='sm'
              ml='60px'
              onClick={handleAttckStar}
            >
              {pending ? (
                <Dots>{t('Snatch the stars')}</Dots>
              ) : (
                <Text fontSize='inherit'>{t('Snatch the stars')}</Text>
              )}
            </ButtonStyled>
          ) : (
            <ButtonStyled
              disabled={pending}
              scale='sm'
              ml='60px'
              onClick={handleHold}
            >
              {pending ? (
                <Dots>{t('Occupy the stars')}</Dots>
              ) : (
                <Text fontSize='inherit'>{t('Occupy the stars')}</Text>
              )}
            </ButtonStyled>
          )}
        </Flex>
      </Flex>
    </BgCardStyled>
  );
};
