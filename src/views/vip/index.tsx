import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
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
import { useTranslation } from 'contexts/Localization';
import { Api } from 'apis';

import { useStore } from 'state';
import { debounce } from 'lodash';

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
  padding: 0 34px;
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
`;

const VipPage = () => {
  const dispatch = useDispatch();
  const user = useStore(p => p.userInfo.userInfo);
  const { t } = useTranslation();
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
        toastSuccess(t('successful purchase'));
        dispatch(fetchUserInfoByAccountAsync(user?.address));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, state.list, t, toastSuccess, user?.address]);

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
            <VipMarkText ml='10px' mt='10px' fontSize='24px' bold>
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
                src='/images/mystery-box/base-super.png'
              />
            </VipBase>
          </IconBox>
          <Box ml='105px' style={{ flex: 1 }}>
            <Flex alignItems='flex-end' mb='20px'>
              <Title>VIP BENEFITS</Title>
              <Flex
                justifyContent='space-between'
                alignItems='flex-end'
                ml='25px'
                mb='5px'
                style={{ flex: 1 }}
              >
                <TextBox fontSize='16px'>
                  {t(
                    'You are not yet a VIP, you can get more benefits after upgrading to VIP',
                  )}
                </TextBox>
                <TextBox fontSize='16px'>
                  {t('Expire on')}
                  {user?.vipBenefits?.is_vip
                    ? dayjs(user?.vipBenefits?.expired_time * 1000).format(
                        'YYYY.MM.DD',
                      )
                    : dayjs(
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
                    {t('Benefit')}
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    {t('supplementary storage tank')}
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    {t('building queue')}
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    {t('Simultaneous jobs (upgrades/builds)')}
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    {t('Building Repair Durability')}
                  </Text>
                </Items>
                <Items>
                  <Text shadow='primary' small>
                    {t('Planet Expeditions')}
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
                          ? t('single supplement')
                          : t('One-click supplement')}
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
                        {row?.oneclickRestore === 2
                          ? t('single fix')
                          : t('One-click repair')}
                      </TView>
                    </Items>
                    <Items>
                      <TView small>{row?.planetExploreFrequency}</TView>
                      <Text
                        fontSize='16px'
                        color='textSubtle'
                        textAlign='center'
                      >
                        (
                        {t(
                          'Income: 100% for the first 3 times and 50% for the last time',
                        )}
                        )
                      </Text>
                    </Items>
                  </GroupItem>
                );
              })}
            </Content>
            <Flex justifyContent='center'>
              <Submit variant='purple' onClick={debounce(() => buyVip(), 1000)}>
                <Text bold fontSize='16px' color='#4FFFFB'>
                  {t('Become VIP')}
                </Text>
              </Submit>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default VipPage;
