import { useTranslation } from 'contexts/Localization';
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
        总血量: <PanelTextHp>{detail.info?.blue_total_hp || 0}</PanelTextHp>
        ;&nbsp;&nbsp;
        <PanelSide isEnemy />
        总血量: <PanelTextHp>{detail.info?.red_total_hp || 0}</PanelTextHp>
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
    return (
      <PanelText>
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <PanelText key={`${item.pos.x}_${item.pos.y}`}>
              <PanelSide isEnemy={item.isEnemy} />
              <PanelAxis axis={item.pos} />
              建筑
              {getEffectDescText(detail.descInfo?.type)}
              {item.receive_sub_hp && (
                <PanelTextHp>{item.receive_sub_hp}</PanelTextHp>
              )}
              {getEffectDescTypeText(detail.descInfo?.type)}
              {index + 1 < (detail.descInfo?.receives.length || 0) && ';'}
            </PanelText>
          );
        })}
      </PanelText>
    );
  }
  if (detail?.type === descType.ADD_SHIELD) {
    return (
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        <PanelAxis axis={detail.descInfo?.sender?.pos} />
        向队友添加护盾
      </PanelText>
    );
  }
  if (detail?.type === descType.ATTACK_DODGE) {
    return (
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        发起进攻,
        <PanelSide isEnemy={detail.descInfo?.receives?.[0]?.isEnemy} />
        位移闪避
      </PanelText>
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
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        发起进攻，对{' '}
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <PanelText key={`${item.pos.x}_${item.pos.y}`}>
              <PanelSide isEnemy={item.isEnemy} />
              <PanelAxis axis={item.pos} />
              建筑
              {index + 1 < (detail.descInfo?.receives.length || 0) && '、'}
            </PanelText>
          );
        })}
        {}
        <PanelText
          color={
            detail.descInfo?.type === descType.ATTACK_MISS ? 'missTxt' : ''
          }
        >
          {getEffectDescText(detail.descInfo?.type)}
        </PanelText>
        {detail.attackInfo?.attack_crit ? (
          <PanelText color='redSide'>&nbsp;暴击&nbsp;</PanelText>
        ) : (
          ''
        )}
        {getEffectDescTypeText(detail.descInfo?.type)}
      </PanelText>
    );
  }
  if (detail?.type === descType.BEAT) {
    return (
      <PanelText>
        <PanelSide isEnemy={detail.descInfo?.sender?.isEnemy} />
        发起进攻，对{' '}
        {detail.descInfo?.receives.map((item, index) => {
          return (
            <PanelText key={`${item.pos.x}_${item.pos.y}`}>
              <PanelSide isEnemy={item.isEnemy} />
              <PanelAxis axis={item.pos} />
              建筑
              {index + 1 < (detail.descInfo?.receives.length || 0) && '、'}
            </PanelText>
          );
        })}
        <PanelText
          color={
            detail.descInfo?.type === descType.ATTACK_MISS ? 'missTxt' : ''
          }
        >
          造成群体伤害
        </PanelText>
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
            <PanelText key={`${item.pos.x}_${item.pos.y}`}>
              <PanelSide isEnemy={item.isEnemy} />
              <PanelAxis axis={item.pos} />
              建筑
              {getEffectDescText(detail.descInfo?.type)}
              {item.receive_sub_hp && (
                <PanelTextHp>{item.receive_sub_hp}</PanelTextHp>
              )}
              {getEffectDescTypeText(detail.descInfo?.type)}
              {index + 1 < (detail.descInfo?.receives.length || 0) && ';'}
            </PanelText>
          );
        })}
      </PanelText>
    );
  }

  return <PanelText>未知&nbsp;</PanelText>;
};
/* 
  TYPE === 2:
    忽略
  TYPE === 3:
    红色方对蓝色方发起（群体）攻击, 造成 XX 伤害
  TYPE === 4:
    红色方对蓝色方发起（群体）禁锢, （并造成XX伤害）
  TYPE === 5:
    红色方对蓝色方造成冰冻，（并造成XX伤害）
  TYPE === 6:
    忽略
  TYPE ==== 7:
    红色方对蓝色方发起攻击，并灼烧蓝色方
  TYPE === 8:
    红色方被灼烧
  TYPE === 9:
    红色方对蓝色方安装炸弹
  TYPE === 10:
    红色方引爆炸弹，对蓝色方造成xx伤害
  TYPE === 11:
    红色方单位阵亡
  TYPE === 12:
    忽略
  TYPE ==== 13:
  TYPE === 14:
    红色方对蓝色方发起攻击，并击退蓝色方
  TYPE === 15:
    忽略
  TYPE === 16:
    忽略
  TYPE === 17:
    红色方对友军添加护盾
  TYPE === 18:
    红色方发起攻击,对蓝色方造成XX伤害
  TYPE === 19:
  TYPE === 20:
    忽略
  TYPE === 21:
    红色方总血量: XX;  蓝色方总血量: xx
  TYPE === 22:
    红色方净化友方单位负面效果
  TYPE === 23:
    忽略
  TYPE === 24:
    红色方治疗友方单位
  TYPE === 25:
    红色方发起攻击，攻击未命中
  TYPE === 26:
    红色方发起攻击，蓝色方闪避本次攻击
  TYPE === 27:
  TYPE === 28:
  TYPE === 29:
    红色方发起攻击，蓝色方免疫本次攻击


*/

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
          123
        </Box>
      </BorderCard>
    </BoxStyled>
  );
};

export default React.memo(PlunderPanelNew);
