import React, { useState } from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Flex, Box, Image, Text, Progress, Button } from 'uikit';
// import Progress from 'components/Progress';

const QueueBox = styled(Box)`
  position: relative;
  width: 123px;
  height: 123px;
  background: #161920;
  border-radius: 10px;
  margin-bottom: 5px;
  z-index: 10;
  cursor: pointer;
  overflow: hidden;
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

export const BuildlingStatus: React.FC<{
  type: number;
}> = ({ type }) => {
  const workInfo = {
    1: {
      src: 'images/commons/icon/icon-building-upgrade.png',
      label: 'Building...',
    },
    2: {
      src: 'images/commons/icon/icon-building-putup',
      label: 'Building...',
    },
    3: {
      src: 'images/commons/icon/icon-building-putup.png',
      label: 'Preparing...',
    },
  };

  return (
    <Flex>
      <Box width='40px' height='40px'>
        <Image width={40} height={40} src={workInfo[type]?.src} />
      </Box>
      <Flex flexDirection='column' style={{ flex: 1 }}>
        <Text fontSize='13px' mb='4px'>
          {workInfo[type]?.label}
        </Text>
        <Progress
          color='progressGreenBar'
          variant='round'
          scale='sm'
          linear
          primaryStep={20}
        />
      </Flex>
    </Flex>
  );
};

export const Queue: React.FC<{
  currentQueue: any[];
  currentBuild: any;
  onSave: () => void;
}> = ({ currentQueue, currentBuild, onSave }) => {
  const vipBenefite = useStore(p => p.userInfo.userInfo.vipBenefits);
  const [state, setState] = useState({
    current: 0,
  });
  const queueArr = Array.from(
    { length: vipBenefite?.building_queue_capacity },
    (v, i) => i,
  );

  return (
    <Flex ml='40px'>
      {(queueArr ?? []).map((item, index) => (
        <Box key={item} mr='40px'>
          <QueueBox
            className={`${
              currentQueue[index]?._id &&
              currentQueue[index]?._id === currentBuild?._id &&
              'active'
            }`}
          >
            {currentQueue[index]?.picture && (
              <Image
                width={123}
                height={123}
                src={currentQueue[index]?.picture}
              />
            )}
          </QueueBox>
          {currentQueue[index]?._id && (
            <BuildlingStatus type={currentQueue[index]?.work_type} />
          )}
        </Box>
      ))}
      <SaveQueue onClick={onSave}>保存队列</SaveQueue>
    </Flex>
  );
};
