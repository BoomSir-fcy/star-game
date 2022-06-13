import React, { useState } from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Flex, Box, Image, Text, Progress, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { TipsModal } from '../Modal';

const QueueBox = styled(Box)`
  position: relative;
  width: 123px;
  height: 123px;
  background: #161920;
  margin-bottom: 5px;
  border-radius: 10px;
  z-index: 10;
  cursor: pointer;
  &.active {
    ::after {
      position: absolute;
      display: block;
      content: '';
      top: -2px;
      left: -2px;
      width: 126px;
      height: 126px;
      border-radius: 10px;
      border: 2px solid #ffffff;
      box-shadow: ${({ theme }) => theme.shadows.highlight};
      z-index: 1;
    }
  }
`;

const SaveQueue = styled(Button)`
  width: 170px;
  height: 44px;
  padding: 0;
  font-size: 20px;
`;

let timer: any = null;
export const BuildlingStatus: React.FC<{
  type: number;
  status: number;
  level?: number;
  endTime: number;
  diffTime?: number;
  onComplete: () => void;
}> = ({ type, status, level, endTime, diffTime, onComplete }) => {
  // 倒计时
  const { t } = useTranslation();
  const [state, setState] = useState({
    time: diffTime,
    ratio: 0,
  });

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

  // 倒计时
  const countDownNumber = () => {
    if (diffTime < 0) {
      setState({
        ...state,
        time: 0,
      });
      onComplete();
      clearTimeout(timer);
      return;
    }
    // eslint-disable-next-line no-param-reassign
    diffTime--;
    setState({
      ...state,
      time: diffTime,
    });
    timer = setTimeout(() => {
      countDownNumber();
    }, 1000);
  };

  React.useEffect(() => {
    if (diffTime > 0 && status === 1) {
      countDownNumber();
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diffTime, status]);

  return (
    <Flex>
      <Box width='40px' height='40px'>
        <Image
          width={40}
          height={40}
          src={`${
            type === 2
              ? 'images/commons/icon/icon-building-upgrade.png'
              : 'images/commons/icon/icon-building-putup.png'
          }`}
        />
      </Box>
      <Flex flexDirection='column' style={{ flex: 1 }}>
        <Text fontSize='13px' mb='4px'>
          {type === 2 && status !== 3
            ? `Lv${level}~Lv${level + 1}`
            : workInfo[status]?.label}
        </Text>
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

export const Queue: React.FC<{
  currentQueue: any[];
  serverTime: number;
  onSave: () => void;
  onSelectCurrent: (item: any) => void;
  onComplete: () => void;
}> = ({ currentQueue, serverTime, onSave, onSelectCurrent, onComplete }) => {
  const { t } = useTranslation();
  const vipBenefite = useStore(p => p.userInfo.userInfo.vipBenefits);
  const [state, setState] = useState({
    current: '' as string | number,
  });
  const [visible, setVisible] = useState(false);
  const queueArr = Array.from(
    { length: vipBenefite?.building_queue_capacity },
    (v, i) => i,
  );

  return (
    <Flex ml='40px'>
      {(queueArr ?? []).map((item, index) => (
        <Box
          key={item}
          mr='40px'
          onClick={() => {
            if (currentQueue[index]) {
              setState({ ...state, current: item });
              onSelectCurrent(currentQueue[index]);
            }
          }}
        >
          <QueueBox className={`${state.current === item && 'active'}`}>
            {(currentQueue[index]?.work_build_picture ||
              currentQueue[index]?.picture) && (
              <Box
                width='123px'
                height='123px'
                style={{ overflow: 'hidden', borderRadius: '10px' }}
              >
                <Image
                  width={123}
                  height={123}
                  src={
                    currentQueue[index]?.work_build_picture ||
                    currentQueue[index]?.picture
                  }
                />
              </Box>
            )}
          </QueueBox>
          {(currentQueue[index]?._id || currentQueue[index]?.planet_id) && (
            <BuildlingStatus
              type={currentQueue[index]?.work_type}
              status={currentQueue[index]?.work_status}
              level={
                currentQueue[index]?.propterty?.levelEnergy ||
                currentQueue[index]?.target_level - 1
              }
              diffTime={currentQueue[index]?.work_end_time - serverTime || 0}
              endTime={
                currentQueue[index]?.work_end_time -
                  currentQueue[index]?.work_start_time || 0
              }
              onComplete={onComplete}
            />
          )}
        </Box>
      ))}
      <SaveQueue onClick={() => setVisible(true)}>{t('savequeue')}</SaveQueue>

      <TipsModal
        visible={visible}
        onConfirm={() => {
          setVisible(false);
          onSave();
        }}
        onClose={() => setVisible(false)}
      />
    </Flex>
  );
};
