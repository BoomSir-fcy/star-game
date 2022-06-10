import React from 'react';
import { Flex, Box, Text, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { Link } from 'react-router-dom';
import ModalWrapper from '.';

export const BuyVipModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  tips?: string;
}> = ({ visible, onClose, tips }) => {
  const { t } = useTranslation();
  // const [step, setStep] = React.useState(0);
  // const [state, setState] = React.useState({
  //   list: [],
  //   config: [],
  // });

  // const { toastSuccess } = useToast();

  // const getVipList = React.useCallback(async () => {
  //   try {
  //     const [list, config] = await Promise.all([
  //       Api.UserApi.getVipList(),
  //       Api.UserApi.getVipConfig(),
  //     ]);
  //     if (Api.isSuccess(list) && Api.isSuccess(config)) {
  //       setState({
  //         list: list.data.list,
  //         config: config.data.config,
  //       });
  //       setStep(1);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // const buyVip = React.useCallback(async () => {
  //   try {
  //     const vip_id = state.list[0].id;
  //     const res = await Api.UserApi.buyVip(vip_id);
  //     if (Api.isSuccess(res)) {
  //       toastSuccess('购买成功');
  //       dispatch(fetchUserInfoByAccountAsync(user?.address));
  //       console.log(res);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [dispatch, state.list, toastSuccess, user?.address]);

  // console.log(state);

  return (
    <ModalWrapper title='Tips' visible={visible} setVisible={onClose}>
      <Flex flexDirection='column' alignItems='center' padding='80px 25px'>
        <Text fontSize='28px'>{tips}</Text>
        <Text fontSize='24px' mt='36px'>
          {t('This feature is a VIP benefit, please upgrade to VIP')}
        </Text>
        <Flex justifyContent='space-between' mt='210px'>
          <Link to='/vip'>
            <Button>{t('Become VIP')}</Button>
          </Link>
        </Flex>
      </Flex>
    </ModalWrapper>
  );
};
