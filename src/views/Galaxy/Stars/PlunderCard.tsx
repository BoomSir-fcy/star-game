import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import React, { useCallback, useState } from 'react';
import { Button, Text, Flex, BgCard, Image, Dots } from 'uikit';
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
    try {
      setPending(true);
      const res = await Api.GalaxyApi.plunderStar(info.token_id, info.number);
      if (Api.isSuccess(res)) {
        toastSuccess('抢夺成功');
        onClose();
      }
      setPending(false);
    } catch (error) {
      toastError('抢夺失败');
      setPending(false);
    }
  }, [info, onClose, toastSuccess, toastError]);

  // 占领
  const handleHold = useCallback(async () => {
    try {
      setPending(true);
      const res = await Api.GalaxyApi.holdStar(info.token_id, info.number);
      if (Api.isSuccess(res)) {
        toastSuccess('占领成功');
        onClose();
      }
      setPending(false);
    } catch (error) {
      toastError('占领失败');
      setPending(false);
    }
  }, [info, onClose, toastSuccess, toastError]);
  return (
    <BgCardStyled variant='small' fringe>
      <Flex flexDirection='column' alignItems='center'>
        <Image
          width={395}
          height={395}
          mt='50px'
          src='/images/commons/star/1.png'
        />
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
            <ButtonStyled scale='sm' ml='60px' onClick={handlePlunder}>
              {pending ? <Dots>抢夺恒星</Dots> : '抢夺恒星'}
            </ButtonStyled>
          ) : (
            <ButtonStyled scale='sm' ml='60px' onClick={handleHold}>
              {pending ? <Dots>占领恒星</Dots> : '占领恒星'}
            </ButtonStyled>
          )}
        </Flex>
      </Flex>
    </BgCardStyled>
  );
};
