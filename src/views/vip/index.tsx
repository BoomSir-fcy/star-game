import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import {
  BgCard,
  Box,
  Flex,
  Text,
  VipMarkText,
  Image,
  Button,
  BackButton,
  RefreshButton,
} from 'uikit';
import { useToast } from 'contexts/ToastsContext';
import { fetchUserInfoByAccountAsync } from 'state/userInfo/reducer';
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { useStore } from 'state';

const Container = styled(BgCard)`
  position: relative;
  padding: 47px 110px;
`;

const RecordBox = styled(Flex)`
  width: 316px;
  height: 90px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  margin-left: 20px;
`;

const IconBox = styled(Flex)`
  position: relative;
  width: 357px;
  height: 525px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const VipLevel = styled(Box)`
  position: absolute;
  width: 357px;
  height: 345px;
  top: 0;
`;

const VipBase = styled(Box)`
  position: absolute;
  width: 300px;
  height: 400px;
  bottom: -50px;
  z-index: -1;
`;

const Title = styled(Text)`
  font-weight: bold;
  font-style: italic;
  font-size: 49px;
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

const TextBox = styled(Text)`
  line-height: 1;
`;

const Content = styled(Flex)`
  width: 100%;
  height: 500px;
  background: #161920;
  box-shadow: 0px 7px 3px 0px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
`;

const GroupItem = styled(Box)`
  width: calc(100% / 3);
  height: 500px;
  &:nth-child(2) {
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
  }
`;

const Items = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100% / 7);
  border-bottom: 1px solid #fff;
`;

const VipColor = styled(Text)`
  font-weight: bold;
  color: #ffffff;
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

const Submit = styled(Button)`
  margin: 20px auto 0;
  width: 506px;
  height: 64px;
  border: 1px solid;
  border-radius: 0;
  background: linear-gradient(0deg, #25babe, #1c273d);
  border-image: linear-gradient(-29deg, #14f1fd, #1caaf4) 1 1;
  box-shadow: 0px 0px 43px 0px #512d58;
`;

const SubmitText = styled(Text)`
  color: #25babe;
`;

const VipPage = () => {
  const dispatch = useDispatch();
  const user = useStore(p => p.userInfo.userInfo);
  const { toastSuccess } = useToast();
  const [state, setState] = React.useState({
    list: [],
    config: [],
  });

  const getVipList = React.useCallback(async () => {
    try {
      const [list, config] = await Promise.all([
        Api.UserApi.getVipList(),
        Api.UserApi.getVipConfig(),
      ]);
      if (Api.isSuccess(list) && Api.isSuccess(config)) {
        setState({
          list: list.data.list,
          config: config.data.config,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const buyVip = React.useCallback(async () => {
    try {
      const vip_id = state.list[0].id;
      const res = await Api.UserApi.buyVip(vip_id);
      if (Api.isSuccess(res)) {
        toastSuccess('购买成功');
        dispatch(fetchUserInfoByAccountAsync(user?.address));
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, state.list, toastSuccess, user?.address]);

  React.useEffect(() => {
    getVipList();
  }, [getVipList]);

  return (
    <Box>
      <Flex
        padding='0 20px'
        margin='18px 0'
        justifyContent='space-between'
        flex={1}
      >
        <Flex>
          <BackButton />
          <RefreshButton ml='33px' />
          <RecordBox>
            <VipMarkText
              ml='20px'
              mt='10px'
              fontSize='22px'
              bold
              fontStyle='italic'
            >
              VIP BENEFITS
            </VipMarkText>
            <Box width='58px' height='58px'>
              <Image
                width={58}
                height={58}
                src='/images/commons/icon/icon-vip.png'
              />
            </Box>
          </RecordBox>
        </Flex>
      </Flex>
      <Container variant='Fullscreen'>
        <Flex>
          <IconBox>
            <VipLevel>
              <Image
                width={357}
                height={345}
                src='/images/commons/icon/icon-vip.png'
              />
            </VipLevel>
            <VipBase>
              <Image
                width={300}
                height={400}
                src='/images/mystery-box/base-super1.png'
              />
            </VipBase>
          </IconBox>
          <Box ml='105px' style={{ flex: 1 }}>
            <Flex alignItems='flex-end' mb='20px'>
              <Title>VIP BENEFITS</Title>
              <Flex justifyContent='space-between' style={{ flex: 1 }}>
                <TextBox small ml='43px'>
                  你还不是VIP，升级VIP后可获得更多好处
                </TextBox>
                <TextBox small>
                  Expire on{` `}
                  {dayjs(
                    (Number((new Date().getTime() / 1000).toFixed(0)) +
                      state.list[0]?.vipDuration) *
                      1000,
                  ).format('YYYY.MM.DD')}
                </TextBox>
              </Flex>
            </Flex>
            <Content>
              <GroupItem>
                <Items>
                  <Text small color='textSubtle'>
                    Benefit
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    补充储存罐{' '}
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    建筑队列位
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    同时工作数(升级/建造)
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    建筑修复耐久度
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    星球探索次数
                  </Text>
                </Items>
              </GroupItem>
              {state?.config.map(row => {
                const TView = row?.isVip === 1 ? VipColor : Text;
                return (
                  <GroupItem key={row.id}>
                    <Items>
                      <TView small color='textSubtle'>
                        {row?.isVip === 1 ? 'VIP' : 'Normal'}
                      </TView>
                    </Items>
                    <Items>
                      <TView small>
                        {row?.oneclickSupplement === 2
                          ? '单一补充'
                          : '一键补充'}
                      </TView>
                    </Items>
                    <Items>
                      <TView small>{row?.buildingQueueCapacity}个</TView>
                    </Items>
                    <Items>
                      <TView small>{row?.produceJob}</TView>
                    </Items>
                    <Items>
                      <TView small>
                        {row?.oneclickRestore === 2 ? '单一修复' : '一键修复'}
                      </TView>
                    </Items>
                    <Items>
                      <TView small>{row?.planetExploreFrequency}</TView>
                      <Text small color='textSubtle'>
                        (收益:前3次100%最后1次50%)
                      </Text>
                    </Items>
                  </GroupItem>
                );
              })}
            </Content>
            <Flex justifyContent='center'>
              <Submit onClick={buyVip}>
                <SubmitText>Become VIP</SubmitText>
              </Submit>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default VipPage;
