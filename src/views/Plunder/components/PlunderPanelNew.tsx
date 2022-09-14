import { useTranslation } from 'contexts/Localization';
import { DescInfo, TrackDetail } from 'game/core/Running';
import Soldier from 'game/core/Soldier';
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

const PanelSide = ({
  isEnemy,
  after,
}: {
  isEnemy?: boolean;
  after?: boolean;
}) => {
  const { t } = useTranslation();

  if (isEnemy) {
    return (
      <PanelText color='redSide'>
        {after ? 'enemy' : t('Enemy')}&nbsp;
      </PanelText>
    );
  }
  return (
    <PanelText color='blueSide'>
      {after ? 'your side' : t('Your')}&nbsp;
    </PanelText>
  );
};

const PanelAxis = ({ axis }: { axis?: RoundDescAxis }) => {
  if (axis) {
    return <span>{`X${axis.x}:Y${axis.y}`}</span>;
  }
  return null;
};

const PanelName = ({ soldier }: { soldier?: Soldier }) => {
  if (soldier) {
    return (
      <span>
        &nbsp;{getSpriteName(soldier.race, String(soldier.srcId)) || 'Soldiers'}
        &nbsp;
      </span>
    );
  }
  return <span>Soldiers</span>;
};
// hp

const PanelType = ({ detail }: { detail: TrackDetail }) => {
  const rounds = (
    <PanelText style={{ whiteSpace: 'nowrap' }}>
      [{detail.descInfo?.id || detail.id}]:&nbsp;
    </PanelText>
  );

  const Harm = (index: number) => {
    return (
      <>
        {detail.attackInfo?.around?.length && (
          <>
            <PanelTextHp>
              {/* 护盾伤害 */}
              {detail.attackInfo?.around[index]?.sub_shield ? (
                <>
                  {detail.attackInfo?.around[index]?.sub_shield}Shields
                  and&nbsp;
                </>
              ) : (
                ''
              )}
              {/* 血量伤害 */}
              {detail.attackInfo?.around[index]?.receive_sub_hp || 0}
            </PanelTextHp>
            {detail.attackInfo?.attack_crit ? (
              <PanelText color='redSide'>&nbsp;SPR&nbsp;</PanelText>
            ) : (
              ''
            )}
          </>
        )}
      </>
    );
  };

  if (
    detail?.type === descType.MOVE ||
    detail?.type === descType.TOTAL_INFO ||
    detail?.type === descType.BEAT_MOVE ||
    detail?.type === descType.BEAT_COLLISION ||
    detail?.type === descType.ICE_END
  ) {
    return null;
  }

  if (detail?.type === descType.REMOVE) {
    return (
      <Flex pl='20px' mt='10px'>
        {/* <PanelText color='redSide'>Killed</PanelText> */}

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail?.descInfo?.sender?.isEnemy} />
          {/* <PanelAxis axis={detail.descInfo?.sender?.pos} /> */}
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          Killed
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
        {/* <PanelText color='redSide'>加护盾</PanelText> */}

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          &nbsp;troop&nbsp;
          {/* <PanelAxis axis={detail.descInfo?.sender?.pos} /> */}
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          {getEffectDescTextNew(detail.descInfo?.type)}
          &nbsp;to&nbsp;
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                {/* <PanelAxis axis={item.pos} /> */}
                <PanelName soldier={item?.soldier} />
                {index + 1 < (detail.descInfo?.receives.length || 0) && '、'}
              </PanelText>
            );
          })}
          &nbsp;of&nbsp;
          <PanelSide after isEnemy={detail.descInfo?.sender?.isEnemy} />
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
        {/* <PanelText color='redSide'>技能类</PanelText> */}

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          &nbsp;troop&nbsp;
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          {/* <PanelAxis axis={detail.descInfo?.sender?.pos} /> */}
          {getEffectDescTextNew(detail.descInfo?.type)}
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                &nbsp;to&nbsp;
                <PanelName soldier={item?.soldier} />
                &nbsp;of&nbsp;
                <PanelSide after isEnemy={item.isEnemy} />
                {/* <PanelAxis axis={item.pos} /> */}
                {/* {getEffectText(detail.descInfo?.type)}
                {getEffectDescTypeText(detail.descInfo?.type)} */}
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
        {detail?.detail?.map((round, roundIndex) => {
          return (
            <Box
              key={`${round?.currentAxisPoint.x}+${round?.currentAxisPoint.y}+${roundIndex}`}
            >
              {round?.descInfo?.receives?.length > 0 &&
                round?.type !== descType.BEAT_COLLISION && (
                  <Flex pl='20px' mt='10px'>
                    {/* <PanelText color='redSide'>范围类</PanelText> */}
                    <PanelText style={{ whiteSpace: 'nowrap' }}>
                      [{round?.id || detail?.id}]:&nbsp;
                    </PanelText>
                    <PanelText>
                      <PanelSide isEnemy={round?.descInfo?.sender?.isEnemy} />
                      &nbsp;troop&nbsp;
                      <PanelName soldier={round?.descInfo?.sender?.soldier} />
                      used AOE attack,
                      {round?.descInfo?.receives.map((item, index) => {
                        return (
                          <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                            &nbsp;dealt&nbsp;
                            {round?.attackInfo?.around?.length && (
                              <PanelTextHp>
                                {/* 护盾伤害 */}
                                {round?.attackInfo?.around[index]
                                  ?.sub_shield ? (
                                  <>
                                    {
                                      round?.attackInfo?.around[index]
                                        ?.sub_shield
                                    }
                                    Shields and&nbsp;
                                  </>
                                ) : (
                                  ''
                                )}
                                {/* 血量伤害 */}
                                {round?.attackInfo?.around[index]
                                  ?.receive_sub_hp || 0}
                              </PanelTextHp>
                            )}
                            {round?.attackInfo?.attack_crit ? (
                              <PanelText color='redSide'>
                                &nbsp;SPR&nbsp;
                              </PanelText>
                            ) : (
                              ''
                            )}
                            <PanelText
                              color={
                                round.descInfo?.type === descType.ATTACK_MISS
                                  ? 'missTxt'
                                  : ''
                              }
                            >
                              &nbsp;group damage&nbsp;
                            </PanelText>
                            to&nbsp;
                            <PanelName soldier={item?.soldier} />
                            of&nbsp;
                            <PanelSide after isEnemy={item.isEnemy} />
                            {index + 1 <
                              (round?.descInfo?.receives?.length || 0) && '、'}
                          </PanelText>
                        );
                      })}
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
    detail?.type === descType.TERRAIN_FIRING ||
    detail?.type === descType.BOOM
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        {/* <PanelText color='redSide'>触发类</PanelText> */}

        {rounds}
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <PanelText key={`${item.pos.x}_${item.pos.y}`}>
              <PanelSide isEnemy={item.isEnemy} />
              &nbsp;troop&nbsp;
              {/* <PanelAxis axis={item.pos} /> */}
              <PanelName soldier={item?.soldier} />
              {getEffectDescText(detail.descInfo?.type)}
              <PanelTextHp>
                {/* 护盾伤害 */}
                {detail.attackInfo?.sub_shield ? (
                  <>{detail.attackInfo?.sub_shield}Shield and&nbsp;</>
                ) : (
                  ''
                )}
                {/* 血量伤害 */}
                {detail.attackInfo?.receive_sub_hp || 0}
              </PanelTextHp>
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
        {/* <PanelText color='redSide'>净化类</PanelText> */}

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          &nbsp;troop&nbsp;
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          {getEffectDescTextNew(detail.descInfo?.type || detail?.type)},
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                &nbsp;caused&nbsp;
                {getEffectText(detail.descInfo?.type)}
                &nbsp;effect to troop&nbsp;
                <PanelName soldier={item?.soldier} />
                &nbsp;of&nbsp;
                <PanelSide after isEnemy={item.isEnemy} />
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }
  // 免疫
  if (
    detail?.type === descType.IMMUNITY_ICE ||
    detail?.type === descType.IMMUNITY_LOCK_MOVE ||
    detail?.type === descType.IMMUNITY_FIRING
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        {/* <PanelText color='redSide'>免疫类</PanelText> */}

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          &nbsp;troop&nbsp;
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          &nbsp;used&nbsp;
          {getEffectDescTextNew(detail.descInfo?.type)},
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                &nbsp;caused&nbsp;
                <PanelText color='missTxt'>
                  {getEffectText(detail.descInfo?.type)}
                </PanelText>
                &nbsp;to&nbsp;
                <PanelName soldier={item?.soldier} />
                &nbsp;of&nbsp;
                <PanelSide after isEnemy={item.isEnemy} />
                {/* <PanelAxis axis={item.pos} /> */}
              </PanelText>
            );
          })}
        </PanelText>
      </Flex>
    );
  }
  // 触发位移闪避 攻击未命中
  if (
    detail?.type === descType.ATTACK_DODGE ||
    detail?.type === descType.ATTACK_MISS
  ) {
    return (
      <Flex pl='20px' mt='10px'>
        {/* <PanelText color='redSide'>闪避类</PanelText> */}

        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          &nbsp;troop&nbsp;
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          {/* <PanelAxis axis={detail.descInfo?.sender?.pos} /> */}
          &nbsp;used General Attack to,
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                <PanelName soldier={item?.soldier} />
                &nbsp;of&nbsp;
                <PanelSide after isEnemy={item.isEnemy} />
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
  // // 攻击未命中
  // if (detail?.type === descType.ATTACK_MISS) {
  //   return (
  //     <Flex pl='20px' mt='10px'>
  //       <PanelText color='redSide'>未命中</PanelText>
  //       {rounds}
  //       <PanelText>
  //         <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
  //         兵种
  //         <PanelAxis axis={detail.descInfo?.sender?.pos} />
  //         使用普通攻击,对
  //         {detail.descInfo?.receives.map((item, index) => {
  //           return (
  //             <PanelText key={`${item.pos.x}_${item.pos.y}`}>
  //               <PanelSide isEnemy={item.isEnemy} />
  //
  //               <PanelAxis axis={item.pos} />
  //               <PanelText color='missTxt'>
  //                 {getEffectDescTextNew(detail.descInfo?.type)}
  //               </PanelText>
  //             </PanelText>
  //           );
  //         })}
  //       </PanelText>
  //     </Flex>
  //   );
  // }
  // 伤害类
  if (detail?.type) {
    return (
      <Flex pl='20px' mt='10px'>
        {/* <PanelText color='redSide'>伤害类</PanelText> */}
        {rounds}
        <PanelText>
          <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
          &nbsp;troop&nbsp;
          <PanelName soldier={detail?.descInfo?.sender?.soldier} />
          {/* <PanelAxis axis={detail.descInfo?.sender?.pos} /> */}
          {getEffectDescTextNew(detail.descInfo?.type)},
          {detail.descInfo?.receives.map((item, index) => {
            return (
              <PanelText key={`${item.pos.x}_${item.pos.y}`}>
                &nbsp;caused&nbsp;
                {Harm(index)}
                &nbsp;loss to&nbsp;
                <PanelName soldier={item?.soldier} />
                &nbsp;of&nbsp;
                <PanelSide after isEnemy={item.isEnemy} />
                {/* <PanelAxis axis={item.pos} /> */}
                {/* {getEffectDescTypeText(detail.descInfo?.type)} */}
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
    // return details.slice(-20, details.length);
    return details;
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
                        <PanelText>{t('Victory')}</PanelText>
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
