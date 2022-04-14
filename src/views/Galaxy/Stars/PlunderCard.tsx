import { useWeb3React } from '@web3-react/core';
import { Api } from 'apis';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { Button, Text, Flex, BgCard, Image, Dots } from 'uikit';
import { GalaxyImage } from '../components/GalaxyImage';
import { ButtonStyled, BgCardStyled } from './style';

export const PlunderCard: React.FC<{
  info: Api.Galaxy.StarInfo;
  onClose: () => void;
}> = ({ info, onClose }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { toastError, toastSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const hasOwner = info.owner;

  // 抢夺
  const handlePlunder = useCallback(async () => {
    try {
      // setPending(true);
      // const res = await Api.GalaxyApi.plunderStar(info.token_id, info.number);
      // if (Api.isSuccess(res)) {
      //   toastSuccess(t('Snatch succeeded));
      //   setPending(false);
      //   onClose();
      // }
    } catch (error) {
      // toastError(t('Snatch failed));
      // setPending(false);
    }
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
          <Image width={395} height={395} mt='50px' src={info.ownerAvatar} />
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
              onClick={handlePlunder}
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
