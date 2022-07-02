import React from 'react';
import { Layout } from 'components';
import { Flex, Box, Text } from 'uikit';
import styled, { createGlobalStyle } from 'styled-components';
import { GlobalVideo } from 'components/Video';
import { useStore } from 'state';
import { useNavigate } from 'react-router-dom';
import {
  MysteryBoxCom,
  mysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import { useTranslation } from 'contexts/Localization';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { fetchBoxViewAsync } from 'state/mysteryBox/reducer';
import eventBus from 'utils/eventBus';

const ClickBox = styled(Box)`
  /* background-color: pink; */
  opacity: 0.2;
  width: 900px;
  height: 300px;
  transform: rotate(-45deg);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
`;
const VipBox = styled(Box)`
  position: absolute;
  top: -286px;
  width: 193px;
  height: 420px;
  background: url(/images/commons/nav/left.png) no-repeat;
  /* background-size: 100% 100%; */
  background-position: right top;
`;
const Title = styled(Text)`
  font-weight: bold;
  font-size: 22px;
  color: #ffffff;
  line-height: 1;
  background: linear-gradient(
    130deg,
    #fbeeba 0%,
    #f1d37e 14.990234375%,
    #d1ab64 33.0078125%,
    #d5c089 48.9990234375%,
    #d5bf86 66.9921875%,
    #f4d784 84.0087890625%,
    #fbeeba 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const MysteryBoxNew = () => {
  useFetchBoxView();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { account } = useWeb3React();

  const { maxSales, sold } = useStore(p => p.mysteryBox.boxView);

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchBoxViewAsync(account));
  }, [account, dispatch]);

  // 监听刷新事件
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);
  return (
    <Layout>
      <Flex position='relative'>
        <VipBox>
          <Flex width='80%' mt='60px' pl='10px' flexDirection='column'>
            <Text fontSize='20px'>{t('Max sales: ')}&nbsp;</Text>
            <Title>{new BigNumber(maxSales).toNumber()}</Title>
          </Flex>
          <Flex width='80%' mt='15px' pl='10px' flexDirection='column'>
            <Text fontSize='20px'>{t('Sold: ')}&nbsp;</Text>
            <Title>{new BigNumber(sold).toNumber()}</Title>
          </Flex>
        </VipBox>
        <Flex
          position='relative'
          width='100%'
          height='100%'
          id='test'
          justifyContent='space-between'
        >
          <ClickBox
            left={-100}
            onClick={() => {
              navigate(`/mystery-box/state?q=${mysteryBoxQualities.ORDINARY}`);
            }}
          />
          <ClickBox
            left={450}
            onClick={() => {
              navigate(`/mystery-box/state?q=${mysteryBoxQualities.ADVANCED}`);
            }}
          />
          <ClickBox
            left={1050}
            onClick={() => {
              navigate(`/mystery-box/state?q=${mysteryBoxQualities.SUPER}`);
            }}
          />
          <MysteryBoxCom
            left={-50}
            top={0}
            bottom={0}
            quality={mysteryBoxQualities.ORDINARY}
          />
          <MysteryBoxCom
            left={500}
            top={0}
            bottom={0}
            quality={mysteryBoxQualities.ADVANCED}
          />
          <MysteryBoxCom
            left={1100}
            top={0}
            bottom={0}
            quality={mysteryBoxQualities.SUPER}
          />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default MysteryBoxNew;
