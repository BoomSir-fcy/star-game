import { useWeb3React } from '@web3-react/core';
import { Api } from 'apis';
import { getTimePeriod, useCountdownTime } from 'components';
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
  const hasOwner = info?.owner;

  const { handlePlunder, handleGiveup } = usePlunder();

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

  const getPlunderInfo = useCallback(async () => {
    const res = await Api.AllianceApi.alliancePlunderInfo(info.owner);
    if (Api.isSuccess(res)) {
      setPkUser(res.data);
    } else {
      setPkUser({} as Api.Alliance.PlunderInfoMatchUser);
    }
  }, [info]);

  useEffect(() => {
    if (hasOwner) {
      getPlunderInfo();
    }
  }, [hasOwner, getPlunderInfo]);

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
        onClose();
      }
    } catch (error) {
      toastError(t('Occupy Failed'));
      setPending(false);
    }
  }, [info, onClose, toastSuccess, toastError, t]);

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
        onClose();
      } else {
        toastError(t('Give up Occupy Failed'));
      }
      setPending(false);
    }
  }, [info, handleGiveup, onClose, t, toastError, toastSuccess]);

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
              {t('Output')} BOX: {info.product_box}
            </Text>
            <Text shadow='primary' small bold>
              {t('Occupied Times')}: {info.history_hold_number}
            </Text>
          </Flex>
          {!isOwner && (
            <>
              {hasOwner ? (
                <ButtonStyled
                  disabled={diffSeconds > 0 || pending || isOwner}
                  scale='sm'
                  ml='60px'
                  onClick={handleAttckStar}
                >
                  {diffSeconds > 0 ? (
                    `${t('Cooling')}:${timePeriod.minutes}${t('m')}${
                      timePeriod.seconds
                    }${t('s')}`
                  ) : pending ? (
                    <Dots>{t('Seize Star')}</Dots>
                  ) : (
                    <Text fontSize='inherit'>{t('Seize Star')}</Text>
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
                    <Dots>{t('Occupy Star')}</Dots>
                  ) : (
                    <Text fontSize='inherit'>{t('Occupy Star')}</Text>
                  )}
                </ButtonStyled>
              )}
            </>
          )}

          {isOwner && (
            <ButtonStyled
              disabled={pending}
              scale='sm'
              ml='60px'
              onClick={handleGiveupStar}
            >
              {pending ? (
                <Dots>{t('Give up Occupy')}</Dots>
              ) : (
                <Text fontSize='inherit'>{t('Give up Occupy')}</Text>
              )}
            </ButtonStyled>
          )}
        </Flex>
      </Flex>
    </BgCardStyled>
  );
};
