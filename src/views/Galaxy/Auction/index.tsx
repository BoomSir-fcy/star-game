import React from 'react';
import {
  BgCard,
  Box,
  Text,
  Flex,
  BackButton,
  RefreshButton,
  Card,
  Image,
  Button,
} from 'uikit';
import Layout from 'components/Layout';
import styled from 'styled-components';
import KingAvatar from '../components/KingAvatar';
import { LeftFlex, Line, PriceText, RightFlex } from './style';

const AuctionCard = styled(Card)`
  height: 375px;
  padding: 30px 55px;
`;

const Auction = () => {
  return (
    <Layout>
      <Flex padding='0 20px' mb='16px' justifyContent='space-between' flex={1}>
        <Box>
          <BackButton />
          <RefreshButton ml='33px' />
        </Box>
        <BgCard padding='40px 80px' variant='full'>
          <Flex flexDirection='column'>
            <Flex>
              <Image
                width={351}
                height={351}
                ml='53px'
                mr='174px'
                src='/images/commons/star/1.png'
              />
              <Flex flexDirection='column'>
                <Text fontSize='28px'>当前价格</Text>
                <PriceText>2.50 BNB</PriceText>
                <Text mt='30px' mb='10px'>
                  当前得主
                </Text>
                <Flex>
                  <KingAvatar sex='man' />
                  <Flex
                    ml='40px'
                    flexDirection='column'
                    justifyContent='space-evenly'
                  >
                    <Text>KING</Text>
                    <Text>可获得星系奖励(10000 STAR)</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <AuctionCard>
              <Flex>
                <LeftFlex>
                  <Flex justifyContent='space-between'>
                    <Text fontSize='22px'>竞标价格</Text>
                    <Text fontSize='22px'>计算方式:2.5*(1+30%)</Text>
                  </Flex>
                  <PriceText mt='10px'>2.50 BNB</PriceText>
                  <Button width='270px' mt='20px'>
                    立即竞拍
                  </Button>
                  <Text mt='20px' small>
                    竞拍成功后，可在每日UTC24点领取该星系的奖励，此奖励由送出
                  </Text>
                  <Text small>
                    如果中途被其他人竞拍获得，则只能领取从拥有开始到失去拥有的时间段的奖励
                  </Text>
                </LeftFlex>
                <Line />
                <RightFlex>
                  <Text small>
                    UTC 02:00 XXXX 以2.00 BNB 竞拍成功获得该星系
                  </Text>
                  <Text small>
                    UTC 02:00 XXXX 以2.00 BNB 竞拍成功获得该星系
                  </Text>
                </RightFlex>
              </Flex>
            </AuctionCard>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default Auction;
