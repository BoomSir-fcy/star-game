import React from 'react';
import { Flex, Box, Text, Image, Progress } from 'uikit';
import { useTranslation } from 'contexts/Localization';

export const QueueBuilding: React.FC<{
  type: number;
  status: number;
  level?: number;
}> = ({ type, status, level }) => {
  const { t } = useTranslation();

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

  return (
    <Flex width='250px'>
      <Flex flexDirection='column' style={{ flex: 1 }}>
        <Flex alignItems='flex-end' mb='16px'>
          <Text bold fontSize='18px'>
            能量建筑
          </Text>
          <Text small bold ml='11px' mb='1px'>
            {type === 2 && status !== 3
              ? `Lv${level}~Lv${level + 1}`
              : `Lv${level}`}
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
            <Text small>Building</Text>
          </Flex>
          <Text small>1d:52h:40m:15s</Text>
        </Flex>
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
