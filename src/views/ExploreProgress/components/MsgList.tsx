import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Flex, Box, GraphicsCard, MarkText, Text, Button } from 'uikit';
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

const BgFlex = styled(Flex)`
  flex: 1;
  height: 243px;
  padding: 16px 30px;
  background: #57575785;
  border: 1px solid #373c45;
  flex-direction: column;
  overflow-y: auto;
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

const MsgList: React.FC = () => {
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
    if (work_message.length) {
      if (MsgRenderList?.length === 0) {
        // 初次渲染消息渲染所有列表
        setMsgRenderList(work_message);
        return;
      }
      // 计算新列表更新了几条
      const diff = work_message.length - MsgRenderList?.length;
      console.log(diff);
      if (diff > 0) {
        setdiffLength(diff);
      } else {
        console.log('完了');

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
      console.log(addDifftime * 1000, diffLength);

      timer.current = setInterval(() => {
        setMsgRenderList(p => [
          ...p,
          work_message[work_message.length - diffLength],
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

  return (
    <BgFlex onScroll={ScrollList} id='workMessageList' ml='20px'>
      {(MsgRenderList || []).map((i, msgIndex) => (
        <Flex
          key={`${i?.time_stamp}_${i?.planet_id}_${i?.arms?.race}_${i?.arms?.arm_product?.index}`}
          mb='16px'
          alignItems='flex-start'
        >
          <Flex alignItems='center' width='28%'>
            <SmText width='60%' color='textSubtle'>
              {dayjs(i?.time_stamp * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </SmText>
            <SmText width='40%' mr='10px'>
              Token {i?.planet_id}
            </SmText>
          </Flex>
          <SmText width='72%'>
            {/* 生产 */}
            {i.type === 1 && (
              <Flex alignItems='center' flexWrap='wrap'>
                {/* 增加 */}
                <>
                  {(i.product_stone > 0 ||
                    i.product_energy > 0 ||
                    i.product_spices > 0) && (
                    <>
                      {t('ExploreMsgDesc1')}
                      {i.product_stone > 0 && ` [${t('Ore')}] `}
                      {i.product_stone > 0 && (
                        <SmText
                          color='#10BA2C'
                          className={
                            msgIndex === MsgRenderList.length - 1
                              ? 'addResource'
                              : ''
                          }
                        >
                          + {SubString_1(i.product_stone, 3)}
                        </SmText>
                      )}
                      {i.product_energy > 0 && ` [${t('Energy')}] `}
                      {i.product_energy > 0 && (
                        <SmText
                          color='#10BA2C'
                          className={
                            msgIndex === MsgRenderList.length - 1
                              ? 'addResource'
                              : ''
                          }
                        >
                          + {SubString_1(i.product_energy, 3)}
                        </SmText>
                      )}
                      {i.product_spices > 0 && ` [${t('Population')}] `}
                      {i.product_spices > 0 && (
                        <SmText
                          color='#10BA2C'
                          className={
                            msgIndex === MsgRenderList.length - 1
                              ? 'addResource'
                              : ''
                          }
                        >
                          + {SubString_1(i.product_spices, 3)}
                        </SmText>
                      )}
                      &nbsp; &nbsp;
                    </>
                  )}
                </>
                {/* 消耗 */}
                <>
                  {(i.product_stone < 0 ||
                    i.product_energy < 0 ||
                    i.product_spices < 0) && (
                    <>
                      {t('ExploreMsgDesc2')}
                      {i.product_stone < 0 && ` [${t('Ore')}] `}
                      {i.product_stone < 0 && (
                        <SmText color='#E75652'>
                          {SubString_1(i.product_stone, 3)}
                        </SmText>
                      )}
                      {i.product_energy < 0 && ` [${t('Energy')}] `}
                      {i.product_energy < 0 && (
                        <SmText color='#E75652'>
                          {SubString_1(i.product_energy, 3)}
                        </SmText>
                      )}
                      {i.product_spices < 0 && ` [${t('Population')}] `}
                      {i.product_spices < 0 && (
                        <SmText color='#E75652'>
                          {SubString_1(i.product_spices, 3)}
                        </SmText>
                      )}
                    </>
                  )}
                </>
              </Flex>
            )}
            {i.type === 2 && (
              <Flex alignItems='center' flexWrap='wrap'>
                {t(BuildRaceData[i?.arms?.race][i?.arms?.arm_index]?.name)}
                &nbsp;
                {t('ExploreMsgDesc3')}
                <SmText color='#10BA2C'>
                  {` [ ${t(
                    raceData[i?.arms?.race]?.children.find(
                      ({ id }) => id === Number(i?.arms?.arm_product?.index),
                    )?.name,
                  )} ]`}
                </SmText>
              </Flex>
            )}
            {i.type === 3 && (
              <Flex alignItems='center' flexWrap='wrap'>
                {t('ExploreMsgDesc4 %address%', {
                  addr: shortenAddress(i?.plunder_info?.address),
                })}
                &nbsp;
                {i?.plunder_info?.success
                  ? t('ExploreMsgDesc5')
                  : t('ExploreMsgDesc6')}
                <SmText
                  color={i?.plunder_info?.success ? '#10BA2C' : '#E75551'}
                >
                  {`[ ${t('Ore')} ] x ${SubString_1(
                    i?.plunder_info?.stone,
                  )} , [ ${t('Energy')} ] x ${SubString_1(
                    i?.plunder_info?.energy,
                  )} , [ ${t('Population')} ] x ${SubString_1(
                    i?.plunder_info?.spices,
                  )}`}
                </SmText>
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
            )}
          </SmText>
        </Flex>
      ))}
    </BgFlex>
  );
};
// i?.arms?.arm_product?.index
export default MsgList;
