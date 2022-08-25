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
import { EasyformatTime } from 'utils/timeFormat';
import { useNavigate } from 'react-router-dom';

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

  .rc-collapse {
    width: 100%;
    background-color: transparent !important;
    border: none !important;
    color: #fff !important;
    & .rc-collapse-item-active {
      & .DownImg {
        transform: rotate(-90deg);
      }
    }
    & .rc-collapse-header {
      /* cursor: auto !important; */
      color: #fff !important;
      padding: 0 !important;
      flex-direction: row-reverse;
      justify-content: flex-end;
      align-items: flex-start !important;
      /* margin-bottom: 12px; */
      width: 100%;
      & .rc-collapse-header-text {
        width: 100%;
      }
      /* & .arrow {
        border-top: 10px solid transparent !important;
        border-bottom: 10px solid transparent !important;
        border-right: 10px solid #fff !important;
        border-left: none !important;
      } */
    }
    & .rc-collapse-content {
      background: transparent;
      color: #fff !important;
      /* padding: 0 20px !important; */
      margin-left: 60px;
      /* margin-top: 20px; */
    }
  }
  /* .rc-collapse > .rc-collapse-item-active > .rc-collapse-header .arrow {
    border-left: 10px solid transparent !important;
    border-right: 10px solid transparent !important;
    border-top: 10px solid #fff !important;
  } */
`;

const ItemFlex = styled(Flex)`
  padding: 30px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  min-height: 160px;
  align-items: flex-start;
  justify-content: space-between;
`;

const Img = styled.img`
  width: 51px;
  height: 51px;
`;

const DownImg = styled.img`
  width: 40px;
  height: 56px;
  transform: rotate(90deg);
`;

const InfoBox = styled(Box)`
  background: #182f37;
  margin-bottom: 10px;
  padding: 15px 20px;
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
    <Flex mb='20px' justifyContent='space-between'>
      <Flex flexDirection='column' width='50%'>
        <Text mb='10px'>{t('InboxTypeDesc7-3')}</Text>
        <Flex flexWrap='wrap'>
          <Text mr='3px'>{t('Ore')}</Text>
          <Text mr='10px' color='progressGreenBar'>
            +{formatDisplayApr(product_stone)}
          </Text>
          <Text mr='3px'>{t('Energy')}</Text>
          <Text mr='10px' color='progressGreenBar'>
            +{formatDisplayApr(product_energy)}
          </Text>
          <Text mr='3px'>{t('Spices')}</Text>
          <Text color='progressGreenBar'>
            +{formatDisplayApr(product_population)}
          </Text>
        </Flex>
      </Flex>
      <Flex flexDirection='column' width='50%'>
        <Text mb='10px'>{t('InboxTypeDesc7-4')}:</Text>
        <Flex flexWrap='wrap'>
          <Flex mr='10px'>
            <Text mr='3px'>{t('Ore')}</Text>
            <Text color={plunder_stone >= 0 ? 'progressGreenBar' : 'redText'}>
              <Flex flexWrap='wrap'>
                {plunder_stone >= 0 ? '+' : ''}
                {formatDisplayApr(plunder_stone)}
                {cellar && (
                  <Text ml='3px'>
                    <Flex>
                      ({t('InboxTypeDesc7-4-1')}
                      <Text ml='3px' color='progressGreenBar'>
                        {formatDisplayApr(cellar_stone)}
                      </Text>
                      )
                    </Flex>
                  </Text>
                )}
              </Flex>
            </Text>
          </Flex>
          <Flex mr='10px'>
            <Text mr='3px'>{t('Energy')}</Text>
            <Text
              mr='10px'
              color={plunder_energy >= 0 ? 'progressGreenBar' : 'redText'}
            >
              <Flex flexWrap='wrap'>
                {plunder_energy >= 0 ? '+' : ''}
                {formatDisplayApr(plunder_energy)}
                {cellar && (
                  <Text ml='3px'>
                    <Flex>
                      ({t('InboxTypeDesc7-4-1')}
                      <Text ml='3px' color='progressGreenBar'>
                        {formatDisplayApr(cellar_energy)}
                      </Text>
                      )
                    </Flex>
                  </Text>
                )}
              </Flex>
            </Text>
          </Flex>
          <Flex mr='10px'>
            <Text mr='3px'>{t('Spices')}</Text>
            <Text
              mr='10px'
              color={plunder_population >= 0 ? 'progressGreenBar' : 'redText'}
            >
              <Flex flexWrap='wrap'>
                {plunder_population >= 0 ? '+' : ''}
                {formatDisplayApr(plunder_population)}
                {cellar && (
                  <Text ml='3px'>
                    <Flex>
                      ({t('InboxTypeDesc7-4-1')}
                      <Text ml='3px' color='progressGreenBar'>
                        {formatDisplayApr(cellar_population)}
                      </Text>
                      )
                    </Flex>
                  </Text>
                )}
              </Flex>
            </Text>
          </Flex>
          <Flex>
            <Text mr='3px'>{t('Soldier')}</Text>
            <Text color='redText'>-{formatDisplayApr(lose_arm_unit)}</Text>
          </Flex>
        </Flex>
      </Flex>
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
          return t('System messages');
        case 1:
          return t('Notice of successful auction of the master of the galaxy');
        case 2:
          return t('The Lord of the Galaxy was auctioned by others');
        case 3:
          return t('Notice of successful occupation of stars');
        case 4:
          return t('Notice of star occupation');
        // case 5:
        //   return t('遭遇战获胜');
        // case 6:
        //   return t('遭遇战失败');
        case 7:
          return t('Comprehensive report on planetary exploration');
        default:
          return t('System messages');
      }
    },
    [t],
  );
  const GetTitleImg = useCallback((type: number) => {
    switch (type) {
      case 0:
        return 'news';
      case 1:
        return 'auction';
      case 2:
        return 'auction';
      case 3:
        return 'occupied';
      case 4:
        return 'occupied';
      case 7:
        return 'planet_icon';
      default:
        return 'news';
    }
  }, []);
  return (
    <Box>
      <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
        <Box mr='40px'>
          <BackButton />
        </Box>
        <TitleBox>
          <MarkText fontSize='18px' bold>
            {t('InBox')}
          </MarkText>
        </TitleBox>
      </Flex>
      {/* 消息列表 */}
      {MessageList.length > 0 ? (
        <ScrollBox onScroll={loadMore}>
          {(MessageList ?? []).map(item => {
            const msgContent = JSON.parse(item?.msgContent);
            // 行星探索综合报告
            if (item?.messageType === 7 && msgContent?.work_report) {
              const InfoList = [];
              Object.keys(msgContent?.work_report).forEach(id => {
                const obj = {
                  ...msgContent?.work_report[id],
                  id,
                };
                InfoList.push(obj);
              });
              return (
                <ItemFlex key={item.id}>
                  <Collapse>
                    <Panel
                      expandIcon={() => {
                        return (
                          <DownImg
                            className='DownImg'
                            src='/images/commons/icon/back.png'
                          />
                          // <Button
                          //   variant='purple'
                          //   height='45px'
                          //   width='140px'
                          //   padding='0'
                          // >
                          //   <Text color='textPrimary'>{t('Details')}</Text>
                          // </Button>
                        );
                      }}
                      header={
                        <>
                          <Flex
                            alignItems='center'
                            justifyContent='space-between'
                          >
                            <Img
                              src={`/images/commons/messageIcon/${GetTitleImg(
                                item.messageType,
                              )}.png`}
                              alt=''
                            />
                            <Box width='calc(100% - 80px)'>
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
                          <Box width='100%' ml='80px'>
                            <Flex mb='20px' alignItems='center'>
                              <Text>
                                {t('InboxTypeDesc7-1')}:&nbsp;
                                {dayjs(msgContent.start_time * 1000).format(
                                  'YYYY-MM-DD HH:mm:ss',
                                )}
                                &nbsp; ~&nbsp;
                                {dayjs(msgContent.end_time * 1000).format(
                                  'YYYY-MM-DD HH:mm:ss',
                                )}
                              </Text>
                              <Button
                                variant='text'
                                height='30px'
                                width='max-content'
                                padding='0px 10px'
                                ml='6px'
                                onClick={() => {
                                  navigate(
                                    `/BattleReport?starTime=${
                                      msgContent.start_time - 86400
                                    }&endTime=${msgContent.end_time + 86400}`,
                                  );
                                }}
                              >
                                <Text color='textPrimary'>
                                  {t('InboxTypeDesc7-1-1')}
                                </Text>
                              </Button>
                            </Flex>
                            {/* <MarkText
                            mb='4px'
                            padding={0}
                            fontStyle='normal'
                            bold
                          >
                            {t('InboxTypeDesc7-2')}
                          </MarkText> */}
                            {GetPrandk(t, msgContent?.work_report[0])}
                          </Box>
                        </>
                      }
                    >
                      {[InfoList || []].map(planetInfo => {
                        const renderPlanet = planetInfo.map(
                          (info, planetIndex) => {
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
                              <Box key={info?.id}>
                                {planetIndex !== 0 && (
                                  <InfoBox>
                                    <Box>
                                      <MarkText
                                        mb='20px'
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
                                    <Flex alignItems='center' flexWrap='wrap'>
                                      <Text mr='10px'>{t('Arms')}:</Text>
                                      <Text mr='10px' color='redText'>
                                        {t('Soldier')} -{lose_arm_unit}
                                      </Text>
                                      ,{' '}
                                      <Text ml='10px' mr='4px'>
                                        {t('InboxTypeDesc7-6')}:
                                      </Text>
                                      {(arms || []).map(
                                        (armsInfo, armsIndex) => {
                                          return (
                                            <Flex
                                              alignItems='center'
                                              key={armsInfo.arm_index}
                                            >
                                              (&nbsp;
                                              <Text ml='10px' mr='10px'>
                                                <Flex alignItems='center'>
                                                  {
                                                    raceData[armsInfo.race]?.[
                                                      armsInfo.arm_index
                                                    ]?.name
                                                  }
                                                  &nbsp;
                                                  {t('Generate')}&nbsp;
                                                  {(
                                                    armsInfo.arm_product || []
                                                  ).map(
                                                    (unique, uniqueIndex) => {
                                                      return (
                                                        <Flex
                                                          key={unique.unique_id}
                                                          alignItems='center'
                                                        >
                                                          <Text
                                                            mr='6px'
                                                            color='progressGreenBar'
                                                          >
                                                            {`"${getSpriteName(
                                                              armsInfo.race,
                                                              unique?.index?.toString() ||
                                                                '0',
                                                            )}"`}
                                                            *{unique.count} /{' '}
                                                            {t('Toltal')}&nbsp;
                                                            {
                                                              armsInfo.total_count
                                                            }
                                                          </Text>
                                                          {uniqueIndex !==
                                                            armsInfo.arm_product
                                                              .length -
                                                              1 && ','}
                                                        </Flex>
                                                      );
                                                    },
                                                  )}
                                                </Flex>
                                              </Text>
                                              &nbsp;){' '}
                                              {armsIndex !== arms.length - 1 &&
                                                ','}
                                            </Flex>
                                          );
                                        },
                                      )}
                                    </Flex>
                                    <Flex alignItems='center'>
                                      <Text mr='10px'>{t('Building')}:</Text>
                                      <Text color='redText'>
                                        {t('InboxTypeDesc7-7')} -{lose_durable}
                                      </Text>
                                    </Flex>
                                  </InfoBox>
                                )}
                              </Box>
                            );
                          },
                        );
                        return renderPlanet;
                      })}
                    </Panel>
                  </Collapse>
                </ItemFlex>
              );
            }
            // 其他消息
            return (
              <ItemFlex key={item.id}>
                <Img
                  src={`/images/commons/messageIcon/${GetTitleImg(
                    item.messageType,
                  )}.png`}
                  alt=''
                />
                <Box width='calc(100% - 80px)'>
                  <Flex>
                    <Box>
                      <Flex
                        alignItems='flex-end'
                        justifyContent='space-between'
                      >
                        <Flex alignItems='center'>
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
                            {dayjs(item.addTime * 1000).format(
                              'YYYY-MM-DD HH:mm:ss',
                            )}
                          </Text>
                        </Flex>
                        {item.messageType === 4 && (
                          <Button
                            variant='text'
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
                        )}
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
                              }">${shortenAddress(
                                msgContent?.new_owner,
                              )}</span>`,
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
                                navigate(`/galaxy?id=${msgContent?.galaxy_id}`);
                              }}
                            >
                              <Text color='textPrimary'>
                                {t('Go to Claim')}
                              </Text>
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
                              }">${shortenAddress(
                                msgContent?.new_owner,
                              )}</span>`,
                              power: `<span style="color: ${
                                theme.colors.legendText
                              }">( ${t('Power')}${
                                msgContent?.new_owner_power
                              } )</span>`,
                            })}
                          </Flex>
                          {getHTML('InboxTypeDesc4-2', {
                            time: EasyformatTime(msgContent.hold_time),
                            reward: `<span style="color: ${theme.colors.progressGreenBar}">${msgContent.get_box} BOX</span>`,
                          })}
                        </Text>
                      )}
                    </Box>
                    {item.messageType === 4 && (
                      <Flex alignItems='center'>
                        <Button
                          variant='purple'
                          height='45px'
                          width='140px'
                          padding='0'
                          ml='20px'
                          onClick={() => {
                            navigate(`/galaxy?id=${msgContent?.galaxy_id}`);
                          }}
                        >
                          <Text color='textPrimary'>{t('Go to Claim')}</Text>
                        </Button>
                      </Flex>
                    )}
                  </Flex>
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
