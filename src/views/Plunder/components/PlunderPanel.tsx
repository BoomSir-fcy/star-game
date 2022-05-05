import { DescInfo, TrackDetail } from 'game/core/Running';
import { getEffectDescText, getEffectDescTypeText } from 'game/core/utils';
import { descType, DescType, RoundDescAxis } from 'game/types';
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import styled from 'styled-components';
import {
  Box,
  Card,
  Text,
  Flex,
  BorderCard,
  BoxProps,
  Fringe,
  Image,
} from 'uikit';

const BoxStyled = styled(Box)`
  margin: 0 30px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border: ${({ theme }) => `4px solid ${theme.colors.lightBorder}`};
  box-shadow: ${({ theme }) => theme.shadows.highlight};
  flex: 1;
`;
const CardStyled = styled(Card)`
  width: 330px;
  padding: 7px;
  margin-left: 10px;
  box-shadow: unset;
  border-radius: 0;
  border: 1px solid #373c45;
`;
const PanelText = styled(Text).attrs({ small: true })`
  /* white-space: nowrap; */
  display: inline;
`;

const PanelSide = ({ isEnemy }: { isEnemy?: boolean }) => {
  if (isEnemy) {
    return <PanelText color='redSide'>红色方&nbsp;</PanelText>;
  }
  return <PanelText color='blueSide'>蓝色方&nbsp;</PanelText>;
};

const PanelAxis = ({ axis }: { axis?: RoundDescAxis }) => {
  if (axis) {
    return <span>{`X${axis.x}:Y${axis.y}`}</span>;
  }
  return null;
};

const PanelType = ({ detail }: { detail: TrackDetail }) => {
  if (detail?.type === descType.MOVE) {
    return (
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        从坐标
        <PanelAxis axis={detail.descInfo?.sender.pos} />
        移动到坐标
        <PanelAxis axis={detail.descInfo?.moveTo} />
      </PanelText>
    );
  }
  if (detail?.type === descType.TOTAL_INFO) {
    return (
      <PanelText>
        <PanelSide />
        总血量:{detail.info?.blue_total_hp || 0}HP;
        <PanelSide isEnemy />
        总血量:{detail.info?.red_total_hp || 0}HP
      </PanelText>
    );
  }
  if (detail?.type === descType.REMOVE) {
    return (
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        <PanelAxis axis={detail.descInfo?.sender?.pos} />
        阵亡
      </PanelText>
    );
  }
  if (detail?.type === descType.FIRING) {
    console.log(detail, '===灼烧');
    return (
      <PanelText>
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <>
              <PanelSide isEnemy={item.isEnemy} />
              <PanelAxis axis={item.pos} />
              建筑
              {getEffectDescText(detail.descInfo?.type)}
              {detail.attackInfo?.receive_sub_hp &&
                `${detail.attackInfo?.receive_sub_hp}HP`}
              {getEffectDescTypeText(detail.descInfo?.type)}
              {index + 1 < (detail.descInfo?.receives.length || 0) && ';'}
            </>
          );
        })}
      </PanelText>
    );
  }
  if (detail?.type) {
    return (
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        发起进攻，对{' '}
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <>
              <PanelSide isEnemy={item.isEnemy} />
              <PanelAxis axis={item.pos} />
              建筑
              {getEffectDescText(detail.descInfo?.type)}
              {detail.attackInfo?.receive_sub_hp &&
                `${detail.attackInfo?.receive_sub_hp}HP`}
              {getEffectDescTypeText(detail.descInfo?.type)}
              {index + 1 < (detail.descInfo?.receives.length || 0) && ';'}
            </>
          );
        })}
      </PanelText>
    );
  }

  return <PanelText>未知&nbsp;</PanelText>;
};

interface PlunderPanelProps extends BoxProps {
  details: TrackDetail[];
}
// TrackDetail
const PlunderPanel: React.FC<PlunderPanelProps> = ({ details, ...props }) => {
  const msgBox = useRef<HTMLDivElement>(null);

  const [needScroll, setNeedScroll] = useState(true);

  useEffect(() => {
    if (needScroll && msgBox.current && details) {
      msgBox.current.scrollTop = msgBox.current.scrollHeight;
    }
  }, [details, needScroll, msgBox]);

  const scrollHandle = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (
        event.currentTarget.scrollHeight - event.currentTarget.scrollTop <=
        30 + event.currentTarget.clientHeight
      ) {
        setNeedScroll(true);
      } else {
        setNeedScroll(false);
      }
    },
    [setNeedScroll],
  );

  return (
    <BoxStyled {...props}>
      <Fringe mt='-19px' zIndex={1} />
      <BorderCard mt='31px' padding='0 10px 10px 10px'>
        <Text textAlign='center' shadow='primary' fontSize='24px' bold>
          掠夺信息面板
        </Text>
        <Box
          onScroll={scrollHandle}
          ref={msgBox}
          overflow='auto'
          height='150px'
        >
          {details.map(item => {
            return (
              <Flex key={item.id} flex={1}>
                <Flex flexDirection='column' flex={1} pl='20px' mt='10px'>
                  <Flex>
                    <PanelText style={{ whiteSpace: 'nowrap' }}>
                      [{item.descInfo?.id || item.id}]:&nbsp;
                    </PanelText>

                    <PanelType detail={item} />
                    {/* <PanelText color='blueSide'>蓝色方&nbsp;</PanelText> */}
                    {/* <PanelText>发起进攻，对&nbsp;</PanelText>
                      <PanelText color='redSide'>红色方&nbsp;</PanelText>
                      <PanelText>坐标X2:Y2坐标建筑造成&nbsp;</PanelText>
                      <PanelText color='hp'>100HP&nbsp;</PanelText>
                      <PanelText>伤害。</PanelText> */}
                  </Flex>
                  {/* <Text small>红色剩余总 HP 500</Text> */}
                </Flex>
                {/* <CardStyled>
                    <Flex>
                      <Image src='/assets/map/map6.png' width={80} height={100} />
                      <Flex flexDirection='column' ml='14px'>
                        <Text small>岩浆方格</Text>
                        <Text mt='14px' small>
                          火焰伤害，每回合持续减少 10HP，持续 3 回合
                        </Text>
                      </Flex>
                    </Flex>
                  </CardStyled> */}
              </Flex>
            );
          })}
        </Box>
        {/* {!!detail?.descInfo && ( */}
        {/* )} */}
      </BorderCard>
    </BoxStyled>
  );
};

export default PlunderPanel;
