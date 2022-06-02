import React from 'react';
import { Flex, Box, Text, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { Api } from 'apis';
import ModalWrapper from '.';

export const BuyVipModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState({
    list: [],
    config: [],
  });

  const getVipList = React.useCallback(async () => {
    try {
      const [list, config] = await Promise.all([
        Api.UserApi.getVipList(),
        Api.UserApi.getVipConfig(),
      ]);
      if (Api.isSuccess(list) && Api.isSuccess(config)) {
        setState({
          list: list.data.list,
          config: config.data.config,
        });
        setStep(1);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(state);

  return (
    <ModalWrapper title='Tips' visible={visible} setVisible={onClose}>
      <Box padding='80px 25px'>
        {step === 0 && (
          <>
            <Text>一键修复耐久度可以快速修复行星上所有建筑的耐久度。</Text>
            <Text>该功能为VIP权益，请升级为VIP。</Text>
            <Flex justifyContent='space-between' mt='300px'>
              <Button>确定</Button>
              <Button onClick={() => getVipList()}>VIP BENEFITS</Button>
            </Flex>
          </>
        )}
        {step === 1 && (
          <Flex justifyContent='space-between'>
            <Box>
              <Text>Benefit</Text>
              <Text>补充储存罐 </Text>
              <Text>建筑队列位</Text>
              <Text>同时工作数（升级/建造）</Text>
              <Text>建筑修复耐久度</Text>
              <Text>星球探索次数</Text>
            </Box>

            {state?.config.map(row => (
              <Box>
                <Text>{row?.IsVip === 1 ? 'VIP' : 'Normal'}</Text>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </ModalWrapper>
  );
};
