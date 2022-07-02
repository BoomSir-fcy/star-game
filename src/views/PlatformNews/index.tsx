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
  height: calc(100vh - 160px);
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
  const { t } = useTranslation();

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
            {t('Station news')}
          </MarkText>
        </TitleBox>
      </Flex>
      <ScrollBox onScroll={loadMore}>
        {MessageList.length > 0 ? (
          <>
            {(MessageList ?? []).map(item => (
              <ItemFlex key={item.id}>
                <Img src='/images/commons/icon/news.png' alt='' />
                <Box ml='30px'>
                  <Flex alignItems='flex-end'>
                    <MarkText mr='28px' fontSize='20px' bold fontStyle='normal'>
                      {item.title}
                    </MarkText>
                    <Text>{dayjs(item.addTime).format('YYYY-MM-DD')}</Text>
                  </Flex>
                  <Text>{item?.msgContent}</Text>
                </Box>
              </ItemFlex>
            ))}
          </>
        ) : (
          <Empty />
        )}
      </ScrollBox>
    </Box>
  );
};

export default PlatformNews;
