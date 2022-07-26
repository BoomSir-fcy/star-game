import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useStore, storeAction } from 'state';
import { Box, Flex, MarkText, Image, Text } from 'uikit';
import { getBuilderSpriteRes } from 'building/core/utils';
import { useTranslation } from 'contexts/Localization';
import { setNavZIndex } from 'state/userInfo/reducer';
import { ChequerPosition } from 'building/core/Building';
import { QueueBuilding } from './queueBuilding';

const Layout = styled(Box)`
  position: fixed;
  left: 30px;
  top: 23%;
  z-index: 9;
`;

const QueueGroup = styled(Flex)`
  margin-bottom: 12px;
  cursor: pointer;
`;

const QueueBox = styled(Flex)`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 95px;
  height: 95px;
  overflow: hidden;
  background: linear-gradient(0deg, #1f5758 0%, #102426 100%);
  border-radius: 10px;
  border: 1px solid #4ffffb;
  margin-right: 10px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 93px;
    height: 93px;
    background-image: linear-gradient(
      45deg,
      rgba(31, 34, 40, 0.5) 25%,
      transparent 25%,
      transparent 50%,
      rgba(31, 34, 40, 0.5) 50%,
      rgba(31, 34, 40, 0.5) 75%,
      transparent 75%,
      transparent
    );
    background-size: 7px 7px;
    z-index: 0;
  }
`;

export const PlanetQueue: React.FC<{
  ActiveCheqer: null | ChequerPosition;
  serverTime: number;
  currentQueue: any[];
  onSave?: () => void;
  onSelectCurrent?: (item: any) => void;
  onChangeGuide?: () => void;
  onComplete?: () => void;
}> = ({
  ActiveCheqer,
  serverTime,
  currentQueue,
  onChangeGuide,
  onComplete,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const vipBenefite = useStore(p => p.userInfo.userInfo.vipBenefits);
  const { visible } = useStore(p => p.buildling.queue);
  const queueArr = useMemo(() => {
    const arr = Array.from(
      { length: vipBenefite?.building_queue_capacity },
      (v, i) => i,
    );
    return arr;
  }, [vipBenefite]);

  useEffect(() => {
    if (ActiveCheqer !== null) {
      dispatch(setNavZIndex(false));
      dispatch(storeAction.queueVisbleSide(true));
      onChangeGuide();
    }
  }, [dispatch, onChangeGuide, ActiveCheqer]);

  return (
    <Layout>
      <MarkText mb='24px' fontSize='20px' bold>
        {t('BuildUpgradeQueue')}
      </MarkText>
      {(queueArr ?? []).map((item, index) => {
        return (
          <QueueGroup key={item} className='guide_step_8'>
            {!currentQueue[index]?._id ? (
              <QueueBox
                className={classNames('guide_step_5')}
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();
                  dispatch(setNavZIndex(false));
                  dispatch(storeAction.queueVisbleSide(true));
                  onChangeGuide();
                }}
              >
                <Image
                  src='../images/commons/icon/icon-queue-add.png'
                  width={37}
                  height={37}
                />
              </QueueBox>
            ) : (
              <>
                <QueueBox>
                  <Image
                    src={getBuilderSpriteRes(
                      currentQueue[index]?.building?.race,
                      currentQueue[index]?.building?.index,
                    )}
                    width={95}
                    height={95}
                  />
                </QueueBox>
                <QueueBuilding
                  key={currentQueue[index]}
                  currentBuilding={currentQueue[index]?.building}
                  type={currentQueue[index]?.work_type}
                  status={currentQueue[index]?.work_status}
                  diffTime={
                    currentQueue[index]?.work_end_time - serverTime || 0
                  }
                  endTime={
                    currentQueue[index]?.work_end_time -
                    currentQueue[index]?.work_start_time
                  }
                  onComplete={onComplete}
                />
              </>
            )}
          </QueueGroup>
        );
      })}
      {!vipBenefite?.is_vip && (
        <QueueGroup onClick={() => navigate('/vip')}>
          <QueueBox>
            <Image
              src='../images/commons/icon/icon-queue-lock.png'
              width={37}
              height={37}
            />
          </QueueBox>
        </QueueGroup>
      )}
    </Layout>
  );
};
