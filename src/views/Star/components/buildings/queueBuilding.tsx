import React from 'react';
import { Flex, Box, Text, Image, Progress } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useImmer } from 'use-immer';

export const QueueBuilding: React.FC<{
  type: number;
  status: number;
  diffTime: number;
  endTime: number;
  currentBuilding: Api.Building.Building;
  onComplete?: () => void;
}> = ({ type, status, diffTime, endTime, currentBuilding, onComplete }) => {
  const { t } = useTranslation();
  const [state, setState] = useImmer({
    time: 0,
  });
  let timer: any = null;

  const workInfo = React.useMemo(() => {
    return {
      1: {
        src: 'images/commons/icon/icon-building-upgrade.png',
        label: t('Building...'),
      },
      2: {
        src: 'images/commons/icon/icon-building-putup',
        label: t('Building...'),
      },
      3: {
        src: 'images/commons/icon/icon-building-putup.png',
        label: t('Preparing...'),
      },
      4: {
        src: 'images/commons/icon/icon-building-upgrade.png',
        label: t('Preparing...'),
      },
    };
  }, [t]);

  const formatTime = (time: number) => {
    if (time <= 0) return `0h:0m:0s`;
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}h:${min}m:${sec}s`;
  };

  // 倒计时
  const countDown = () => {
    timer = setInterval(() => {
      const { time } = state;
      if (time > 0) {
        setState(p => {
          p.time = time - 1;
        });
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 1000);
  };

  React.useEffect(() => {
    setState(p => {
      p.time = diffTime;
    });
  }, [diffTime, setState]);

  React.useEffect(() => {
    if (status !== 3 && diffTime > 0) {
      countDown();
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.time]);

  return (
    <Flex width='250px'>
      <Flex flexDirection='column' style={{ flex: 1 }}>
        <Flex alignItems='flex-end' mb='16px'>
          <Text bold fontSize='18px'>
            {currentBuilding?.propterty?.name_en}
          </Text>
          <Text small bold ml='11px' mb='1px'>
            {type === 2 && status !== 3
              ? `Lv${currentBuilding?.propterty?.levelEnergy}~Lv${
                  currentBuilding?.propterty?.levelEnergy + 1
                }`
              : `Lv${currentBuilding?.propterty?.levelEnergy}`}
          </Text>
        </Flex>
        <Flex justifyContent='space-between' alignItems='center' mb='20px'>
          <Flex alignItems='center'>
            <Box width='20px' height='20px'>
              <Image
                width={20}
                height={20}
                src={`${
                  type === 2
                    ? 'images/commons/icon/icon-building-upgrade.png'
                    : 'images/commons/icon/icon-building-putup.png'
                }`}
              />
            </Box>
            <Text small>{workInfo[status]?.label}</Text>
          </Flex>
          <Text small>{formatTime(state.time)}</Text>
        </Flex>
        <Progress
          color='progressGreenBar'
          variant='round'
          scale='sm'
          linear
          primaryStep={
            status === 3
              ? 0
              : Math.round(((endTime - state.time) / endTime) * 10000) / 100 ||
                0
          }
        />
      </Flex>
    </Flex>
  );
};
