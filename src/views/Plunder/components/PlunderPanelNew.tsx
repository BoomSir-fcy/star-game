import { useTranslation } from 'contexts/Localization';
import { DescInfo, TrackDetail } from 'game/core/Running';
import {
  getEffectDescText,
  getEffectDescTextNew,
  getEffectDescTypeText,
  getEffectText,
  getSpriteName,
} from 'game/core/utils';
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

const PanelTextHp: React.FC = ({ children }) => {
  return <PanelText color='hp'>{children}HP</PanelText>;
};

const PanelSide = ({ isEnemy }: { isEnemy?: boolean }) => {
  const { t } = useTranslation();

  if (isEnemy) {
    return <PanelText color='redSide'>{t('敌方')}&nbsp;</PanelText>;
  }
  return <PanelText color='blueSide'>{t('我方')}&nbsp;</PanelText>;
};

const PanelAxis = ({ axis }: { axis?: RoundDescAxis }) => {
  if (axis) {
    return <span>{`X${axis.x}:Y${axis.y}`}</span>;
  }
  return null;
};

// hp

const PanelType = ({ detail }: { detail: TrackDetail }) => {
  console.log(detail);

  const rounds = (
    <PanelText style={{ whiteSpace: 'nowrap' }}>
      [{detail.descInfo?.id || detail.id}]:&nbsp;
    </PanelText>
  );

  const Harm = (index: number) => {
    return (
      <>
        <PanelTextHp>
          {/* 护盾伤害 */}
          {detail.attackInfo?.around[index]?.sub_shield ? (
            <>{detail.attackInfo?.around[index]?.sub_shield}护盾和&nbsp;</>
          ) : (
            ''
          )}
          {/* 血量伤害 */}
          {detail.attackInfo?.around[index]?.receive_sub_hp || 0}
        </PanelTextHp>
        {detail.attackInfo?.attack_crit ? (
          <PanelText color='redSide'>&nbsp;暴击&nbsp;</PanelText>
        ) : (
          ''
        )}
      </>
    );
  };

  if (
    (detail?.type === descType.MOVE && detail?.type === descType.TOTAL_INFO) ||
    detail?.type === descType.BEAT_MOVE ||
    detail?.type === descType.BEAT_COLLISION ||
    detail?.type === descType.IMMUNITY_ICE ||
    detail?.type === descType.IMMUNITY_LOCK_MOVE ||
    detail?.type === descType.IMMUNITY_FIRING
  ) {
    return null;
  }

  if (detail?.type === descType.REMOVE) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>阵亡</PanelText>

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          <PanelAxis axis={detail.descInfo?.sender?.pos} />
          阵亡
        </PanelText>
      </Flex>
    );
  }
  if (
    detail?.type === descType.ADD_SHIELD ||
    detail?.type === descType.RESTORE
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>加护盾</PanelText>

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          兵种 <PanelAxis axis={detail.descInfo?.sender?.pos} />
          向<PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                <PanelAxis axis={item.pos} />
                {index + 1 < (detail.descInfo?.receives.length || 0) && '、'}
              </PanelText>
            );
          })}
          单位 {getEffectDescTextNew(detail.descInfo?.type)}
        </PanelText>
      </Flex>
    );
  }
  if (
    detail?.type === descType.STOP_MOVE ||
    detail?.type === descType.ADD_BOOM ||
    detail?.type === descType.ADD_FIRING ||
    detail?.type === descType.ADD_TERRAIN_FIRING ||
    detail?.type === descType.ICE_START
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>技能类</PanelText>

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          兵种 <PanelAxis axis={detail.descInfo?.sender?.pos} />
          {getEffectDescTextNew(detail.descInfo?.type)},
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                对
                <PanelSide isEnemy={item.isEnemy} />
                <PanelAxis axis={item.pos} />
                单位造成
                {getEffectText(detail.descInfo?.type)}
                {getEffectDescTypeText(detail.descInfo?.type)}
                {index + 1 < (detail.descInfo?.receives.length || 0) && '、'}
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }

  if (detail?.type === descType.BEAT) {
    return (
      <>
        {detail.detail.map((round, roundIndex) => {
          return (
            <Box
              key={`${round.currentAxisPoint.x}+${round.currentAxisPoint.y}+${roundIndex}`}
            >
              {round.descInfo?.receives.length > 0 && (
                <Flex pl='20px' mt='10px'>
                  <PanelText color='redSide'>范围类</PanelText>
                  <PanelText style={{ whiteSpace: 'nowrap' }}>
                    [{round.id || detail.id}]:&nbsp;
                  </PanelText>
                  <PanelText>
                    <PanelSide isEnemy={round.descInfo?.sender?.isEnemy} />
                    兵种 <PanelAxis axis={round.descInfo?.sender?.pos} />
                    使用普通攻击,
                    {round.descInfo?.receives.map((item, index) => {
                      return (
                        <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                          对
                          <PanelSide isEnemy={item.isEnemy} />
                          <PanelAxis axis={item.pos} />
                          单位造成&nbsp;
                          {/* {Harm(index)} */}
                          <PanelTextHp>
                            {/* 护盾伤害 */}
                            {round.attackInfo?.around[index]?.sub_shield ? (
                              <>
                                {round.attackInfo?.around[index]?.sub_shield}
                                护盾和&nbsp;
                              </>
                            ) : (
                              ''
                            )}
                            {/* 血量伤害 */}
                            {round.attackInfo?.around[index]?.receive_sub_hp ||
                              0}
                          </PanelTextHp>
                          {round.attackInfo?.attack_crit ? (
                            <PanelText color='redSide'>
                              &nbsp;暴击&nbsp;
                            </PanelText>
                          ) : (
                            ''
                          )}
                          {index + 1 < (round.descInfo?.receives.length || 0) &&
                            '、'}
                        </PanelText>
                      );
                    })}
                    <PanelText
                      color={
                        round.descInfo?.type === descType.ATTACK_MISS
                          ? 'missTxt'
                          : ''
                      }
                    >
                      群体伤害
                    </PanelText>
                  </PanelText>
                </Flex>
              )}
            </Box>
          );
        })}
      </>
    );
  }
  //  燃烧、被动持续伤害类
  if (
    detail?.type === descType.FIRING ||
    detail?.type === descType.TERRAIN_FIRING
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>燃烧类</PanelText>

        {rounds}
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <PanelText key={`${item.pos.x}_${item.pos.y}`}>
              <PanelSide isEnemy={item.isEnemy} />
              兵种
              <PanelAxis axis={item.pos} />
              {getEffectDescText(detail.descInfo?.type)}
              造成&nbsp;
              {Harm(index)}
              {getEffectDescTypeText(detail.descInfo?.type)}
              {index + 1 < (detail.descInfo?.receives.length || 0) && ';'}
            </PanelText>
          );
        })}
      </Flex>
    );
  }
  // 净化、解除技能类
  if (
    detail?.type === descType.REMOVE_FIRING ||
    detail?.type === descType.PURIFY ||
    detail?.type === descType.REMOVE_STOP_MOVE ||
    detail?.type === descType.REMOVE_BOMB
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>净化类</PanelText>

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          兵种
          <PanelAxis axis={detail.descInfo?.sender?.pos} />
          {getEffectDescTextNew(detail.descInfo?.type)},
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                对
                <PanelSide isEnemy={item.isEnemy} />
                单位
                <PanelAxis axis={item.pos} />
                造成&nbsp;
                {getEffectText(detail.descInfo?.type)}
                {getEffectDescTypeText(detail.descInfo?.type)}
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }
  // 触发位移闪避
  if (detail?.type === descType.ATTACK_DODGE) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>闪避类</PanelText>

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          兵种
          <PanelAxis axis={detail.descInfo?.sender?.pos} />
          使用普通攻击,
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                <PanelSide isEnemy={item.isEnemy} />
                单位
                <PanelAxis axis={item.pos} />
                {getEffectDescTextNew(detail.descInfo?.type)}
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }
  // 攻击未命中
  if (detail?.type === descType.ATTACK_MISS) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>未命中</PanelText>
        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          兵种
          <PanelAxis axis={detail.descInfo?.sender?.pos} />
          使用普通攻击,对
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                <PanelSide isEnemy={item.isEnemy} />
                单位
                <PanelAxis axis={item.pos} />
                <PanelText color='missTxt'>
                  {getEffectDescTextNew(detail.descInfo?.type)}
                </PanelText>
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }
  // 伤害类
  if (detail?.type) {
    return (
      <Flex pl='20px' mt='10px'>
        <PanelText color='redSide'>伤害类</PanelText>
        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          兵种
          <PanelAxis axis={detail.descInfo?.sender?.pos} />
          {getEffectDescTextNew(detail.descInfo?.type)},
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                对
                <PanelSide isEnemy={item.isEnemy} />
                <PanelAxis axis={item.pos} />
                单位造成&nbsp;
                {Harm(index)}
                {getEffectDescTypeText(detail.descInfo?.type)}
                {index + 1 < (detail.descInfo?.receives.length || 0) && ';'}
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }
  return null;
};

export interface OtherDetail {
  id: number;
  type: number;
  text: string;
  success?: boolean;
  showResult?: boolean;
}
interface PlunderPanelProps extends BoxProps {
  details: TrackDetail[];
  others?: OtherDetail[];
}
// TrackDetail
const PlunderPanelNew: React.FC<PlunderPanelProps> = ({
  details,
  others,
  ...props
}) => {
  const { t } = useTranslation();

  const msgBox = useRef<HTMLDivElement>(null);

  const [needScroll, setNeedScroll] = useState(true);

  const renderDetails = useMemo(() => {
    return details.slice(-20, details.length);
  }, [details]);

  useEffect(() => {
    if (needScroll && msgBox.current && renderDetails) {
      msgBox.current.scrollTop = msgBox.current.scrollHeight;
    }
  }, [renderDetails, others, needScroll, msgBox]);

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
          {t('Plunder information panel')}
        </Text>
        <Box
          onScroll={scrollHandle}
          ref={msgBox}
          overflow='auto'
          height='150px'
        >
          {renderDetails.map(item => {
            return (
              <Flex key={item.id} flex={1}>
                <Flex flexDirection='column' flex={1}>
                  <PanelType detail={item} />
                </Flex>
              </Flex>
            );
          })}
          {others?.map(item => {
            return (
              <Flex key={item.id} flex={1}>
                <Flex flexDirection='column' flex={1} pl='20px' mt='10px'>
                  <PanelText style={{ whiteSpace: 'nowrap' }}>
                    {item.text}
                    {item.showResult && (
                      <>
                        <PanelText>
                          ,{' '}
                          {item.success ? <PanelSide /> : <PanelSide isEnemy />}
                        </PanelText>
                        <PanelText>胜利</PanelText>
                      </>
                    )}
                  </PanelText>
                </Flex>
              </Flex>
            );
          })}
        </Box>
      </BorderCard>
    </BoxStyled>
  );
};

export default React.memo(PlunderPanelNew);
