import { Api } from 'apis';
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
  const { toastError, toastSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const hasOwner = info.owner;

  // 抢夺
  const handlePlunder = useCallback(async () => {
    if (dayjs().unix() > info.protect_timestamp) {
      toastError('保护期内不能抢夺');
      return;
    }
    try {
      // setPending(true);
      // const res = await Api.GalaxyApi.plunderStar(info.token_id, info.number);
      // if (Api.isSuccess(res)) {
      //   toastSuccess('抢夺成功');
      //   setPending(false);
      //   onClose();
      // }
    } catch (error) {
      // toastError('抢夺失败');
      // setPending(false);
    }
  }, [info, toastError]);

  // 占领
  const handleHold = useCallback(async () => {
    try {
      setPending(true);
      const res = await Api.GalaxyApi.holdStar(info.token_id, info.number);
      if (Api.isSuccess(res)) {
        toastSuccess('占领成功');
        setPending(false);
        onClose();
      }
    } catch (error) {
      toastError('占领失败');
      setPending(false);
    }
  }, [info, onClose, toastSuccess, toastError]);
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
              恒星Lv: {info.number}
            </Text>
            <Text shadow='primary' small bold>
              产出BOX: {info.disapth_box}
            </Text>
            <Text shadow='primary' small bold>
              被占领次数: {info.history_hold_number}
            </Text>
          </Flex>
          {hasOwner ? (
            <ButtonStyled
              disabled={pending}
              scale='sm'
              ml='60px'
              onClick={handlePlunder}
            >
              {pending ? <Dots>抢夺恒星</Dots> : '抢夺恒星'}
            </ButtonStyled>
          ) : (
            <ButtonStyled
              disabled={pending}
              scale='sm'
              ml='60px'
              onClick={handleHold}
            >
              {pending ? <Dots>占领恒星</Dots> : '占领恒星'}
            </ButtonStyled>
          )}
        </Flex>
      </Flex>
    </BgCardStyled>
  );
};
