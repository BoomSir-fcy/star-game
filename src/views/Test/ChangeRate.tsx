import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { Text, Label, Box, Flex, Input, Button, Dots, Skeleton } from 'uikit';

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
  const [value, setValue] = React.useState('');

  const { toastSuccess, toastError } = useToast();

  const fetchRate = React.useCallback(async () => {
    const res = await Api.CommonApi.getTimeRate();

    if (Api.isSuccess(res)) {
      setTimeInfo({ ...res.data, loaded: true });
    }
  }, [setTimeInfo]);

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
        </Box>
      </Flex>
    </Box>
  );
};

export default ChangeRate;
