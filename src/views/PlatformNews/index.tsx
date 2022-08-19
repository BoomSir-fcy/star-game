import React, { useCallback, useState } from 'react';
import {
  RefreshButton,
  Flex,
  Box,
  BackButton,
  MarkText,
  Text,
  Empty,
} from 'uikit';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useTranslation } from 'contexts/Localization';
import useTheme from 'hooks/useTheme';
import { shortenAddress } from 'utils';
import { useFetchMessageList } from './hook';

const TitleBox = styled(Flex)`
  width: 512px;
  height: 52px;
  background: url('/images/battleReport/top.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: center;
`;

const ScrollBox = styled(Box)`
  height: calc(940px - 160px);
  width: 1500px;
  margin: 22px auto 0;
  overflow-y: auto;
  overflow-x: hidden;
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
`;

const ItemFlex = styled(Flex)`
  padding: 40px 48px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  min-height: 110px;
  align-items: center;
`;

const Img = styled.img`
  width: 58px;
  height: 54px;
`;

const PlatformNews: React.FC = () => {
  const { t, getHTML } = useTranslation();
  const { theme } = useTheme();

  const {
    list: MessageList,
    page,
    setPageNum,
    loading,
    end,
  } = useFetchMessageList();

  const loadMore = useCallback(
    (e: any) => {
      const { offsetHeight, scrollTop, scrollHeight } = e.nativeEvent.target;
      if (offsetHeight + scrollTop >= scrollHeight) {
        if (loading || end) return; // 判断是否在请求状态或者已到最后一页
        setPageNum(page + 1);
      }
    },
    [loading, page, end, setPageNum],
  );

  const GetTitle = useCallback(
    (status: number) => {
      switch (status) {
        case 0:
          return t('系统消息');
        case 1:
          return t('星系主竞拍成功通知');
        case 2:
          return t('星系主被其他人竞拍获得');
        case 3:
          return t('占领恒星成功通知');
        case 4:
          return t('恒星被占领通知');
        case 5:
          return t('遭遇战获胜');
        case 6:
          return t('遭遇战失败');
        case 7:
          return t('行星探索综合报告');
        default:
          return t('系统消息');
      }
    },
    [t],
  );

  return (
    <Box>
      <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
        <Box mr='40px'>
          <BackButton />
          {/* <RefreshButton
            ml='33px'
            onRefresh={() => {
              setPageNum(1);
            }}
          /> */}
        </Box>
        <TitleBox>
          <MarkText fontSize='18px' bold fontStyle='italic'>
            {t('InBox')}
          </MarkText>
        </TitleBox>
      </Flex>
      {MessageList.length > 0 ? (
        <ScrollBox onScroll={loadMore}>
          {(MessageList ?? []).map(item => {
            const msgContent = JSON.parse(item.msgContent);
            if (item.type === 2) {
              console.log(msgContent);
            }

            return (
              <ItemFlex key={item.id}>
                <Img src='/images/commons/icon/news.png' alt='' />
                <Box ml='30px'>
                  <Flex alignItems='flex-end'>
                    <MarkText mr='28px' fontSize='20px' bold fontStyle='normal'>
                      {GetTitle(item.type)}
                    </MarkText>
                    <Text>
                      {dayjs(item.addTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </Flex>
                  {item.type === 1 && (
                    <Text>
                      {getHTML('InboxTypeDesc1', {
                        galaxy: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.galaxy_name}</span>`,
                        price: `<span style="color: ${theme.colors.legendText}">${msgContent.amount}BNB</span>`,
                      })}
                    </Text>
                  )}
                  {item.type === 2 && (
                    <>
                      <Text>
                        {getHTML('InboxTypeDesc2', {
                          oldPrice: `<span style="color: ${theme.colors.legendText}">${msgContent.old_amount}BNB</span>`,
                          galaxy: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.galaxy_name}</span>`,
                          time: dayjs(msgContent.timestamp * 1000).format(
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                          address: `<span style="color: ${
                            theme.colors.legendText
                          }">${shortenAddress(msgContent.new_owner)}</span>`,
                          price: `<span style="color: ${theme.colors.legendText}">${msgContent.amount}BNB</span>`,
                          get_amount: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.get_amount}</span>`,
                        })}
                      </Text>
                      <Text>
                        {getHTML('InboxTypeDesc2-2', {
                          reward: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.get_amount}</span>`,
                        })}
                      </Text>
                    </>
                  )}
                  {item.type === 3 && (
                    <Text>
                      {getHTML('InboxTypeDesc1', {
                        time: dayjs(msgContent.timestamp * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                        ),
                        galaxy: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.galaxy_name}</span>`,
                        star: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.number}</span>`,
                      })}{' '}
                      &nbsp;
                      <span style={{ color: theme.colors.textTips }}>
                        {t('InboxTypeDesc3-2')}
                      </span>
                    </Text>
                  )}
                </Box>
              </ItemFlex>
            );
          })}
        </ScrollBox>
      ) : (
        <Box height='calc(940px - 160px)'>
          <Empty />
        </Box>
      )}
    </Box>
  );
};

export default PlatformNews;
