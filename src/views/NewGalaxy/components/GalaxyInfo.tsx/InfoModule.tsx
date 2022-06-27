import React, { useState, useEffect } from 'react';
import { useStore } from 'state';
import { Text, Flex, Box, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';

import {
  InfoModuleBox,
  NormalMarkText,
  CloseImg,
  UserImg,
  BorderBox,
  ScrollBox,
  AuctionBtn,
} from 'views/NewGalaxy/style';
import { fetchAuctionRecordListAsync } from 'state/galaxy/reducer';
import dayjs from 'dayjs';
import { formatUTC } from 'utils/timeFormat';
import { shortenAddress } from 'utils/contract';

const InfoModule: React.FC<{
  setOpenInfo: (e) => void;
}> = ({ setOpenInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { currentGalaxy, auctionRecordList } = useStore(p => p.galaxy);

  useEffect(() => {
    dispatch(fetchAuctionRecordListAsync(currentGalaxy.id));
  }, [dispatch, currentGalaxy]);

  return (
    <InfoModuleBox>
      <Flex mb='16px' justifyContent='space-between'>
        <NormalMarkText bold fontSize='20px'>
          {currentGalaxy.name}
        </NormalMarkText>
        <CloseImg
          onClick={() => setOpenInfo(false)}
          src='/images/commons/introjs-close.png'
          alt=''
        />
      </Flex>
      <Flex mb='23px' alignItems='center'>
        <UserImg src='/images/commons/protoss.png' alt='' />
        <Box ml='18px'>
          <Flex mb='10px' alignItems='flex-end'>
            <Text fontSize='14px' mr='15px'>
              {t('星系主')}
            </Text>
            <NormalMarkText bold fontSize='16px'>
              123123
            </NormalMarkText>
          </Flex>
          <Text fontSize='14px'>{t('已经领取到了')}</Text>
        </Box>
      </Flex>
      <Flex mb='8px' justifyContent='space-between'>
        <GraphicsCard
          stripe
          style={{ padding: '8px 16px' }}
          width='48%'
          height='max-content'
        >
          <Text fontSize='14px'>{t('他累计获得BOX')}</Text>
          <NormalMarkText bold fontSize='18px'>
            33333333333333
          </NormalMarkText>
        </GraphicsCard>
        <GraphicsCard
          stripe
          style={{ padding: '8px 16px' }}
          width='48%'
          height='max-content'
        >
          <Text fontSize='14px'>{t('历史累计获得BOX')}</Text>
          <NormalMarkText bold fontSize='18px'>
            33333333333333
          </NormalMarkText>
        </GraphicsCard>
      </Flex>
      <BorderBox mb='8px'>
        <Text fontSize='14px'>
          {t('该星系历史所有星系主累计赚取')}26262 BNB
        </Text>
      </BorderBox>
      <Text fontSize='14px'>{t('历史记录')}</Text>
      <ScrollBox mb='10px'>
        {(auctionRecordList ?? []).map(item => (
          <Text fontSize='14px' mb='4px'>
            UTC {formatUTC(item.auctionAt, 'HH:mm:ss')}&nbsp;&nbsp;
            {shortenAddress(item.newOwner, 2)}&nbsp;&nbsp;
            {t('以 %num%BNB 竞拍成功并成为该星系主', { num: item.price })}
          </Text>
        ))}
      </ScrollBox>
      <Flex>
        <AuctionBtn variant='purple' height='45px' minWidth='45%' width='45%'>
          <Text color='textPrimary' bold>
            {t('竞拍(价格 %num% BNB)', { num: 2.666 })}
          </Text>
        </AuctionBtn>
        <Text color='#A9CCCB' fontSize='14px' ml='20px' mr='20px'>
          {t('其中 %num1% BNB给上一任星系主, %num2%BNB 加入奖池', {
            num1: 2.666,
            num2: 0.534,
          })}
        </Text>
      </Flex>
    </InfoModuleBox>
  );
};

export default InfoModule;
