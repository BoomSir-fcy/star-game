import React, { Fragment, useCallback, useState } from 'react';
import {
  RefreshButton,
  Flex,
  Box,
  BackButton,
  MarkText,
  Text,
  Empty,
  Button,
} from 'uikit';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useTranslation } from 'contexts/Localization';
import useTheme from 'hooks/useTheme';
import { shortenAddress } from 'utils';
import Collapse, { Panel } from 'rc-collapse';
import { formatDisplayApr } from 'utils/formatBalance';
import 'rc-collapse/assets/index.css';
import { raceData } from 'config/buildConfig';
import { getSpriteName, getSpriteRes } from 'game/core/utils';
import duration from 'dayjs/plugin/duration';
import { EasyformatTime } from 'utils/timeFormat';
import { useNavigate } from 'react-router-dom';

import { useFetchMessageList } from './hook';

dayjs.extend(duration);

// const List = {
//   0: {
//     product_stone: 0,
//     product_energy: 0,
//     product_population: 0,
//     plunder_stone: 0,
//     plunder_energy: 0,
//     plunder_population: 0,
//     cellar_stone: 0,
//     cellar_energy: 0,
//     cellar_population: 0,
//     lose_arm_unit: 0,
//     lose_durable: 0,
//     arms: [
//       {
//         arm_index: 2,
//         race: 1,
//         arm_product: [{ unique_id: 2, count: 0 }],
//         total_count: 0,
//       },
//       {
//         arm_index: 7,
//         race: 1,
//         arm_product: [{ unique_id: 3, count: 5 }],
//         total_count: 0,
//       },
//     ],
//   },
//   10: {
//     product_stone: 0,
//     product_energy: 0,
//     product_population: 0,
//     plunder_stone: 0,
//     plunder_energy: 0,
//     plunder_population: 0,
//     cellar_stone: 0,
//     cellar_energy: 0,
//     cellar_population: 0,
//     lose_arm_unit: 0,
//     lose_durable: 0,
//     arms: [
//       {
//         arm_index: 12,
//         race: 3,
//         arm_product: [
//           { unique_id: 1, count: 0 },
//           { unique_id: 2, count: 1 },
//         ],
//         total_count: 0,
//       },
//     ],
//   },
//   101: {
//     product_stone: 0,
//     product_energy: 0,
//     product_population: 0,
//     plunder_stone: 0,
//     plunder_energy: 0,
//     plunder_population: 0,
//     cellar_stone: 0,
//     cellar_energy: 0,
//     cellar_population: 0,
//     lose_arm_unit: 0,
//     lose_durable: 0,
//     arms: [
//       {
//         arm_index: 11,
//         race: 2,
//         arm_product: [{ unique_id: 3, count: 0 }],
//         total_count: 0,
//       },
//     ],
//   },
// };

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
  min-height: 200px;
  align-items: center;
`;

const Img = styled.img`
  width: 58px;
  height: 54px;
`;

const GetPrandk = (t, info, cellar?) => {
  const {
    arms,
    cellar_energy,
    cellar_population,
    cellar_stone,
    lose_arm_unit,
    lose_durable,
    plunder_energy,
    plunder_population,
    plunder_stone,
    product_energy,
    product_population,
    product_stone,
  } = info;
  return (
    <Flex>
      <Text>{t('InboxTypeDesc7-3')}&nbsp;</Text>
      (&nbsp;
      <Text color='progressGreenBar'>
        {t('Ore')}+{formatDisplayApr(10)},{t('Energy')}+{formatDisplayApr(10)},
        {t('Spices')}+{formatDisplayApr(10)}&nbsp;
      </Text>
      ),
      <Text>{t('InboxTypeDesc7-4')}&nbsp;</Text>(&nbsp;
      <Text color={plunder_stone >= 0 ? 'progressGreenBar' : 'redText'}>
        <Flex>
          {t('Ore')}
          {plunder_stone >= 0 ? '+' : '-'}
          {formatDisplayApr(plunder_stone)}
          {cellar && (
            <Text color='progressGreenBar'>
              {`[${t('InboxTypeDesc7-4-1')} ${formatDisplayApr(cellar_stone)}]`}
            </Text>
          )}
        </Flex>
      </Text>
      ,
      <Text color={plunder_energy >= 0 ? 'progressGreenBar' : 'redText'}>
        <Flex>
          {t('Energy')} {plunder_energy >= 0 ? '+' : '-'}
          {formatDisplayApr(plunder_energy)}
          {cellar && (
            <Text color='progressGreenBar'>
              {`[${t('InboxTypeDesc7-4-1')} ${formatDisplayApr(
                cellar_energy,
              )}]`}
            </Text>
          )}
        </Flex>
      </Text>
      ,
      <Text color={plunder_population >= 0 ? 'progressGreenBar' : 'redText'}>
        <Flex>
          {t('Spices')}
          {plunder_population >= 0 ? '+' : '-'}
          {formatDisplayApr(plunder_population)}
          {cellar && (
            <Text color='progressGreenBar'>
              {`[${t('InboxTypeDesc7-4-1')} ${formatDisplayApr(
                cellar_population,
              )}]`}
            </Text>
          )}
        </Flex>
      </Text>
      ,
      <Text color={lose_arm_unit > 0 ? 'progressGreenBar' : 'redText'}>
        {t('Soldier')}-{formatDisplayApr(lose_arm_unit)}
      </Text>
      &nbsp;)
    </Flex>
  );
};

const PlatformNews: React.FC = () => {
  const { t, getHTML } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

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
            if (item.messageType === 0 && msgContent[0]) {
              // msgContent = List;
              const InfoList = [];
              Object.keys(msgContent).forEach(id => {
                const obj = {
                  ...msgContent[id],
                  id,
                };
                InfoList.push(obj);
              });
              return (
                <ItemFlex key={item.id}>
                  <Collapse>
                    <Panel
                      header={
                        <>
                          <Flex alignItems='center' mb='10px'>
                            <Img src='/images/commons/icon/news.png' alt='' />
                            <Box ml='30px'>
                              <Flex alignItems='flex-end'>
                                <MarkText
                                  mr='28px'
                                  fontSize='20px'
                                  bold
                                  fontStyle='normal'
                                >
                                  {GetTitle(item.messageType)}
                                </MarkText>
                                <Text>
                                  {dayjs(item.addTime * 1000).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                  )}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                          <Flex mb='4px'>
                            <Text>
                              {t('InboxTypeDesc7-1')}:&nbsp;
                              {dayjs(item.addTime * 1000).format(
                                'YYYY-MM-DD HH:mm:ss',
                              )}
                              &nbsp; ~&nbsp;
                              {dayjs(item.addTime * 1000).format(
                                'YYYY-MM-DD HH:mm:ss',
                              )}
                            </Text>
                            <Text
                              ml='6px'
                              color='legendText'
                              onClick={() => {
                                navigate(
                                  `/BattleReport?starTime=${
                                    msgContent.timestamp - 86400
                                  }&endTime=${msgContent.timestamp + 86400}`,
                                );
                              }}
                            >
                              {t('InboxTypeDesc7-1-1')}
                            </Text>
                          </Flex>
                          <MarkText
                            mb='4px'
                            padding={0}
                            fontStyle='normal'
                            bold
                          >
                            {t('InboxTypeDesc7-2')}
                          </MarkText>
                          {GetPrandk(t, msgContent[0])}
                        </>
                      }
                    >
                      {[InfoList || []].map(planetInfo => {
                        const renderPlanet = planetInfo.map(info => {
                          const {
                            arms,
                            cellar_energy,
                            cellar_population,
                            cellar_stone,
                            lose_arm_unit,
                            lose_durable,
                            plunder_energy,
                            plunder_population,
                            plunder_stone,
                            product_energy,
                            product_population,
                            product_stone,
                          } = info;
                          return (
                            <Collapse>
                              <Panel
                                header={
                                  <Box>
                                    <MarkText
                                      mb='4px'
                                      padding={0}
                                      fontStyle='normal'
                                      bold
                                    >
                                      {t('Planet')}&nbsp;
                                      {info?.id}&nbsp;
                                      {t('InboxTypeDesc7-5')}
                                    </MarkText>
                                    {GetPrandk(t, info, true)}
                                  </Box>
                                }
                              >
                                <Flex alignItems='center'>
                                  <Text mr='4px'>{t('Arms')}:</Text>
                                  <Text color='redText'>
                                    {t('Soldier')} -{lose_arm_unit}
                                  </Text>
                                  ,{' '}
                                  <Text mr='2px'>{t('InboxTypeDesc7-6')}:</Text>
                                  {(arms || []).map(armsInfo => {
                                    return (
                                      <Flex alignItems='center'>
                                        (&nbsp;
                                        <Text mr='2px'>
                                          <Flex alignItems='center'>
                                            {
                                              raceData[armsInfo.race]?.[
                                                armsInfo.arm_index
                                              ]?.name
                                            }
                                            &nbsp;
                                            {t('Generate')}&nbsp;
                                            {(armsInfo.arm_product || []).map(
                                              unique => {
                                                return (
                                                  <Flex alignItems='center'>
                                                    <Text color='progressGreenBar'>
                                                      {`"${getSpriteName(
                                                        armsInfo.race,
                                                        unique.unique_id.toString(),
                                                      )}"`}
                                                      *{unique.count} /{' '}
                                                      {t('Toltal')}&nbsp;
                                                      {armsInfo.total_count}
                                                    </Text>
                                                    ,
                                                  </Flex>
                                                );
                                              },
                                            )}
                                          </Flex>
                                        </Text>
                                        &nbsp;),
                                      </Flex>
                                    );
                                  })}
                                </Flex>
                                <Flex alignItems='center'>
                                  <Text mr='4px'>{t('Building')}:</Text>
                                  <Text color='redText'>
                                    {t('InboxTypeDesc7-7')} -{lose_durable}
                                  </Text>
                                </Flex>
                              </Panel>
                            </Collapse>
                          );
                        });
                        return renderPlanet;
                      })}
                    </Panel>
                  </Collapse>
                </ItemFlex>
              );
            }
            return (
              <ItemFlex key={item.id}>
                <Img src='/images/commons/icon/news.png' alt='' />
                <Box ml='30px'>
                  <Flex alignItems='flex-end'>
                    <MarkText
                      padding={0}
                      mr='28px'
                      fontSize='20px'
                      bold
                      fontStyle='normal'
                    >
                      {GetTitle(item.messageType)}
                    </MarkText>
                    <Text>
                      {dayjs(item.addTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </Flex>
                  {item.messageType === 1 && (
                    <Text>
                      {getHTML('InboxTypeDesc1', {
                        galaxy: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.galaxy_name}</span>`,
                        price: `<span style="color: ${theme.colors.legendText}">${msgContent.amount}BNB</span>`,
                      })}
                    </Text>
                  )}
                  {item.messageType === 2 && (
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
                          }">${shortenAddress(msgContent?.new_owner)}</span>`,
                          price: `<span style="color: ${theme.colors.legendText}">${msgContent.amount}BNB</span>`,
                          get_amount: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.get_amount}</span>`,
                        })}
                      </Text>
                      <Flex alignItems='center' flexWrap='wrap'>
                        <Text>
                          {getHTML('InboxTypeDesc2-2', {
                            reward: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.get_amount} BOX</span>`,
                          })}
                        </Text>
                        <Button
                          variant='purple'
                          height='30px'
                          width='max-content'
                          padding='0px 10px'
                          onClick={() => {
                            navigate('/galaxy');
                          }}
                        >
                          <Text color='textPrimary'>{t('Go to Claim')}</Text>
                        </Button>
                      </Flex>
                    </>
                  )}
                  {item.messageType === 3 && (
                    <Text>
                      {getHTML('InboxTypeDesc3', {
                        time: dayjs(msgContent.timestamp * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                        ),
                        galaxy: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.galaxy_name}</span>`,
                        star: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.number}</span>`,
                      })}
                      &nbsp;
                      <span style={{ color: theme.colors.textTips }}>
                        {t('InboxTypeDesc3-2')}
                      </span>
                    </Text>
                  )}
                  {item.messageType === 4 && (
                    <Text>
                      <Flex alignItems='center' flexWrap='wrap'>
                        {getHTML('InboxTypeDesc4', {
                          galaxy: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.galaxy_name}</span>`,
                          star: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.number}</span>`,
                          time: dayjs(msgContent.timestamp * 1000).format(
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                          address: `<span style="color: ${
                            theme.colors.legendText
                          }">${shortenAddress(msgContent?.new_owner)}</span>`,
                          power: `<span style="color: ${
                            theme.colors.legendText
                          }">( ${t('Power')}${
                            msgContent?.new_owner_power
                          } )</span>`,
                        })}
                        <Button
                          variant='purple'
                          height='30px'
                          width='max-content'
                          padding='0px 10px'
                          onClick={() => {
                            navigate(
                              `/BattleReport?starTime=${
                                msgContent.timestamp - 86400
                              }&endTime=${msgContent.timestamp + 86400}`,
                            );
                          }}
                        >
                          <Text color='textPrimary'>
                            {t('InboxTypeDesc7-1-1')}
                          </Text>
                        </Button>
                      </Flex>
                      <Flex alignItems='center'>
                        {getHTML('InboxTypeDesc4-2', {
                          time: EasyformatTime(msgContent.hold_time),
                          reward: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.get_box} BOX</span>`,
                        })}
                        <Button
                          variant='purple'
                          height='30px'
                          width='max-content'
                          padding='0px 10px'
                          ml='20px'
                          onClick={() => {
                            navigate('/galaxy');
                          }}
                        >
                          <Text color='textPrimary'>{t('Go to Claim')}</Text>
                        </Button>
                      </Flex>
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
