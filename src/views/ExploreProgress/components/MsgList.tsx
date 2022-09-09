import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import {
  Flex,
  Box,
  GraphicsCard,
  MarkText,
  Text,
  Grid,
  Button,
  Image,
} from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import dayjs from 'dayjs';
import { SubString_1 } from 'utils/DecimalPlaces';
import { BuildRaceData } from 'config/buildConfig';
import { raceData } from 'config/raceConfig';
import { shortenAddress } from 'utils';
import { Link } from 'react-router-dom';
import { work_messageView } from 'state/types';

const BgFlex = styled(Flex)<{ concise: boolean }>`
  height: 300px;
  background: ${({ concise }) => (concise ? '#000' : '#57575785')};
  border: 1px solid #373c45;
  flex: 1;
  flex-direction: column;
`;

const ScrollBox = styled(Flex)`
  flex: 1;
  height: calc(100% - 80px);
  flex-direction: column;
  overflow-y: auto;
  padding: 14px 0 14px 24px;
`;

const TitleGrid = styled(Box)<{ concise: boolean }>`
  display: grid;
  grid-template-columns: ${({ concise }) =>
    concise ? '25% 15% 14% 14% 14% 18%' : '15% 10% 8% 8% 8% 10% auto'};
  align-items: center;
`;

const SmText = styled(Text)`
  font-size: 14px;
  & .addResource {
    animation: addtext 1s linear;
    @keyframes addtext {
      0% {
        font-size: 14px;
      }
      50% {
        font-size: 28px;
      }
      100% {
        font-size: 14px;
      }
    }
  }
`;

const MsgList: React.FC<{
  concise?: boolean;
}> = ({ concise }) => {
  const { t, getHTML } = useTranslation();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const { work_message } = useStore(p => p.alliance.ExploreProgressDate);
  const [isDown, setIsDown] = useState(true);
  const [MsgRenderList, setMsgRenderList] = useState<work_messageView[]>([]);
  const [addDifftime, setaddDifftime] = useState(0);
  const [diffLength, setdiffLength] = useState(0);

  const ScrollList = useCallback((e: any) => {
    const { clientHeight, scrollTop, scrollHeight } = e.nativeEvent.target;
    if (clientHeight + scrollTop < scrollHeight - 100) {
      setIsDown(false);
    } else {
      setIsDown(true);
    }
  }, []);

  useEffect(() => {
    if (work_message?.length) {
      if (MsgRenderList?.length === 0) {
        // 初次渲染消息渲染所有列表
        setMsgRenderList(work_message);
        return;
      }
      // 计算新列表更新了几条
      const diff = work_message?.length - MsgRenderList?.length;
      if (diff > 0) {
        setdiffLength(diff);
      } else {
        // 两个列表相等了 清空倒计时
        if (timer.current) {
          clearInterval(timer.current);
        }
        setdiffLength(0);
        setaddDifftime(0);
      }
    }
  }, [work_message, MsgRenderList]);

  useEffect(() => {
    // 计算每条消息的间隔时间
    if (addDifftime === 0 && diffLength > 0) {
      setaddDifftime(50 / (diffLength + 1));
    }
  }, [addDifftime, diffLength]);

  useEffect(() => {
    if (work_message?.length && diffLength > 0) {
      if (timer.current) {
        clearInterval(timer.current);
      }

      timer.current = setInterval(() => {
        setMsgRenderList(p => [
          ...p,
          work_message[work_message?.length - diffLength],
        ]);
      }, addDifftime * 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [diffLength, work_message, addDifftime]);

  useEffect(() => {
    const workMessageListDom = document.getElementById('workMessageList');
    if (workMessageListDom && MsgRenderList.length) {
      // 更新数据时 当前滚动条在顶部 才置底
      if (isDown) {
        workMessageListDom.scrollTop = workMessageListDom.scrollHeight;
      }
    }
  }, [MsgRenderList, isDown]);

  // 页面只渲染50条数据
  const renderListLimit = React.useMemo(() => {
    if (MsgRenderList) return MsgRenderList.slice(-50);
    return [];
  }, [MsgRenderList]);

  return (
    <BgFlex concise={concise} ml={concise ? '' : '20px'}>
      {!concise ? (
        <GraphicsCard height='max-content' width='100%' padding='0' stripe>
          <TitleGrid concise={concise} padding='10px 0 10px 24px'>
            <SmText>{t('Time')}</SmText>
            <SmText>{t('Planet')}</SmText>
            <Image
              width={32}
              height={32}
              src='/images/commons/icon/icon_minera.png'
            />
            <Image
              width={32}
              height={32}
              src='/images/commons/icon/icon_energy.png'
            />
            <Image
              width={32}
              height={32}
              src='/images/commons/icon/icon_spice.png'
            />
            <SmText>{t('InboxTypeDesc7-6')}</SmText>
            <SmText>{t('Details')}</SmText>
          </TitleGrid>
        </GraphicsCard>
      ) : (
        <TitleGrid concise={concise} padding='14px 8px 14px 24px'>
          <SmText>{t('Time')}</SmText>
          <SmText>{t('Planet')}</SmText>
          <Image
            width={32}
            height={32}
            src='/images/commons/icon/icon_minera.png'
          />
          <Image
            width={32}
            height={32}
            src='/images/commons/icon/icon_energy.png'
          />
          <Image
            width={32}
            height={32}
            src='/images/commons/icon/icon_spice.png'
          />
          <SmText>{t('InboxTypeDesc7-6')}</SmText>
        </TitleGrid>
      )}
      <ScrollBox onScroll={ScrollList} id='workMessageList'>
        {(renderListLimit || []).map((i, msgIndex) => (
          <TitleGrid
            concise={concise}
            key={`${i?.time_stamp}_${i?.planet_id}_${i?.arms?.race}_${i?.arms?.arm_product?.index}`}
            mb='16px'
          >
            <SmText color='textSubtle'>
              {dayjs(i?.time_stamp * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </SmText>
            <SmText>Token {i?.planet_id || ''}</SmText>
            {i.type === 3 ? (
              <SmText
                ellipsis
                color={i?.plunder_info?.stone > 0 ? '#10BA2C' : '#E75652'}
                className={
                  i?.plunder_info?.stone > 0 &&
                  msgIndex === MsgRenderList.length - 1
                    ? 'addResource'
                    : ''
                }
              >
                {i?.plunder_info?.stone > 0 && '+'}{' '}
                {i?.plunder_info?.stone !== 0
                  ? SubString_1(i?.plunder_info?.stone, 3)
                  : ''}
              </SmText>
            ) : (
              <SmText
                color={i.product_stone > 0 ? '#10BA2C' : '#E75652'}
                className={
                  i.product_stone > 0 && msgIndex === MsgRenderList.length - 1
                    ? 'addResource'
                    : ''
                }
              >
                {i.product_stone > 0 && '+'}{' '}
                {i.product_stone !== 0 ? SubString_1(i.product_stone, 3) : ''}
              </SmText>
            )}
            {i.type === 3 ? (
              <SmText
                ellipsis
                color={i?.plunder_info?.energy > 0 ? '#10BA2C' : '#E75652'}
                className={
                  i?.plunder_info?.energy > 0 &&
                  msgIndex === MsgRenderList.length - 1
                    ? 'addResource'
                    : ''
                }
              >
                {i?.plunder_info?.energy > 0 && '+'}{' '}
                {i?.plunder_info?.energy !== 0
                  ? SubString_1(i?.plunder_info?.energy, 3)
                  : ''}
              </SmText>
            ) : (
              <SmText
                color={i.product_energy > 0 ? '#10BA2C' : '#E75652'}
                className={
                  msgIndex === MsgRenderList.length - 1 ? 'addResource' : ''
                }
              >
                {i.product_energy > 0 && '+'}{' '}
                {i.product_energy !== 0 ? SubString_1(i.product_energy, 3) : ''}
              </SmText>
            )}
            {i.type === 3 ? (
              <SmText
                ellipsis
                color={i?.plunder_info?.spices > 0 ? '#10BA2C' : '#E75652'}
                className={
                  i?.plunder_info?.spices > 0 &&
                  msgIndex === MsgRenderList.length - 1
                    ? 'addResource'
                    : ''
                }
              >
                {i?.plunder_info?.spices > 0 && '+'}{' '}
                {i?.plunder_info?.spices !== 0
                  ? SubString_1(i?.plunder_info?.spices, 3)
                  : ''}
              </SmText>
            ) : (
              <SmText
                color={i.product_spices > 0 ? '#10BA2C' : '#E75652'}
                className={
                  msgIndex === MsgRenderList.length - 1 ? 'addResource' : ''
                }
              >
                {i.product_spices > 0 && '+'}{' '}
                {i.product_spices !== 0 ? SubString_1(i.product_spices, 3) : ''}
              </SmText>
            )}
            <SmText>
              {i?.arms?.arm_product.count > 0
                ? `+ ${i?.arms?.arm_product.count}`
                : ''}
            </SmText>
            {!concise && (
              <>
                {i.type === 1 && (
                  <SmText>
                    {t('ExploreMsgDesc1')}&nbsp;or&nbsp;
                    {t('ExploreMsgDesc2')}
                  </SmText>
                )}
                {i.type === 2 && (
                  <Flex alignItems='center' flexWrap='wrap'>
                    <SmText mr='10px'>
                      {t(
                        BuildRaceData[i?.arms?.race][i?.arms?.arm_index]?.name,
                      )}
                    </SmText>
                    <SmText mr='10px'>{t('ExploreMsgDesc3')}</SmText>
                    <SmText color='#10BA2C'>
                      {`[ ${t(
                        raceData[i?.arms?.race]?.children.find(
                          ({ id }) =>
                            id === Number(i?.arms?.arm_product?.index),
                        )?.name,
                      )} ]`}
                    </SmText>
                  </Flex>
                )}
                {i.type === 3 && (
                  <Box>
                    <SmText mr='10px'>
                      {t('ExploreMsgDesc4 %address%', {
                        addr: shortenAddress(i?.plunder_info?.address),
                      })}
                    </SmText>
                    <Flex alignItems='center' flexWrap='wrap'>
                      <SmText
                        mr='10px'
                        color={i?.plunder_info?.success ? '#10BA2C' : '#E75652'}
                      >
                        {i?.plunder_info?.success
                          ? t('ExploreMsgDesc5')
                          : t('ExploreMsgDesc6')}
                      </SmText>
                      {!i?.plunder_info?.success && (
                        <SmText>{t('ExploreMsgDesc8')}</SmText>
                      )}
                      <Button
                        height='max-content'
                        variant='text'
                        as={Link}
                        to={`/BattleReport?starTime=${
                          i?.time_stamp - 86400
                        }&endTime=${i?.time_stamp + 86400}`}
                      >
                        <SmText color='#1EB2FF'>{t('ExploreMsgDesc7')}</SmText>
                      </Button>
                    </Flex>
                  </Box>
                )}
              </>
            )}
          </TitleGrid>
        ))}
      </ScrollBox>
    </BgFlex>
  );
};
// i?.arms?.arm_product?.index
export default MsgList;
