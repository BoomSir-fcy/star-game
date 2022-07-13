import { Api } from 'apis';
import Modal from 'components/Modal';
import { useToast } from 'contexts/ToastsContext';
import dayjs from 'dayjs';
import { truncate } from 'fs';
import React, { useRef, useState } from 'react';
import { Text, Label, Box, Flex, Input, Button, Dots, Skeleton } from 'uikit';
import ResetModule from './ResetModule';

const ChangeRate: React.FC = () => {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const [timeInfo, setTimeInfo] = React.useState<
    Api.Common.Info & { loaded: boolean }
  >({
    rate: 1,
    timestamp: 0,
    loaded: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [visible, setVisible] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const fetchRate = React.useCallback(async () => {
    const res = await Api.CommonApi.getTimeRate();

    if (Api.isSuccess(res)) {
      setTimeInfo({ ...res.data, loaded: true });
    }
  }, [setTimeInfo]);

  const SetReset = React.useCallback(async () => {
    setPending(true);
    const res = await Api.CommonApi.setReset();
    if (Api.isSuccess(res)) {
      fetchRate();
      toastSuccess('重置成功');
    }
    setPending(false);
  }, [fetchRate, toastSuccess]);

  const changeHandle = React.useCallback(async () => {
    if (!Number(value)) {
      toastError('请输入正确的数字');
      return;
    }
    setLoading(true);
    const res = await Api.CommonApi.setTimeRate(Number(value));
    setLoading(false);
    if (Api.isSuccess(res)) {
      fetchRate();
      toastSuccess('修改成功');
    }
  }, [value, fetchRate, toastError, toastSuccess]);

  React.useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      fetchRate();
    }, 4000);
  }, [fetchRate, timer]);

  return (
    <Box>
      <Flex alignItems='center' justifyContent='center'>
        <Box>
          <Text fontSize='46px'>
            {dayjs(timeInfo.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
          <Flex width='600px'>
            <Text fontSize='46px'>当前倍速：</Text>
            {timeInfo.loaded ? (
              <Text fontSize='46px'>{timeInfo.rate}</Text>
            ) : (
              <Skeleton width={200} height={46} />
            )}
          </Flex>
          <Flex alignItems='center' width='1000px'>
            <Text fontSize='46px'>更改倍速：</Text>
            <Input
              value={value}
              onChange={e => {
                setValue(e.target.value);
              }}
              width={400}
            />
            <Button onClick={() => changeHandle()} disabled={loading}>
              {loading ? <Dots>确定中。。。</Dots> : '确定'}
            </Button>
          </Flex>
          <Flex alignItems='center' width='1000px'>
            <Text fontSize='46px'>重置数据时间会很长 请耐心等待</Text>
            <Button onClick={() => setVisible(true)} disabled={pending}>
              {pending ? <Dots>重置数据中。。。</Dots> : '重置数据'}
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Modal title='重置数据' visible={visible} setVisible={setVisible}>
        <ResetModule
          callBack={() => {
            setVisible(false);
            SetReset();
          }}
        />
      </Modal>
    </Box>
  );
};

export default ChangeRate;
