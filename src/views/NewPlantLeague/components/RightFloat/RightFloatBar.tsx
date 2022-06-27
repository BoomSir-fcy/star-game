import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { Link } from 'react-router-dom';
import { useStore } from 'state';
import { EasyformatTime } from 'utils/timeFormat';
import { useToast } from 'contexts/ToastsContext';
import { ThingRepairModal } from 'views/Star/components/Modal';
import { useBuildingRepair } from 'views/Star/components/gameModel/hooks';
import { BuyVipModal } from 'components/Modal/buyVipModal';

import HowToPlay from './HowToPlay';
import useExtract from './hook';
import { RechargeAssets } from './RechargeAssets';

const RecordBox = styled(Flex)`
  width: 200px;
  height: 58px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
`;

const ImgFlex = styled(Flex)`
  width: 38px;
  img {
    width: 100%;
  }
`;

const MessageBox = styled(Box)`
  position: absolute;
  right: -2px;
  top: -2px;
  background-color: ${({ theme }) => theme.colors.redText};
  width: 11px;
  height: 11px;
  border-radius: 50%;
`;

const BarFlex = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
`;

const TipBox = styled(Box)`
  width: 150px;
  position: absolute;
  background: #4b4b4b;
  opacity: 0;
  border-radius: 10px;
  padding: 0;
  left: -160px;
  cursor: auto;
  transition: all 0.5s;
  overflow: hidden;
`;

const TipTriangle = styled(Box)`
  width: 0px;
  height: 0px;
  border: 10px solid transparent;
  border-top-color: #4b4b4b;
  position: absolute;
  right: -8px;
  top: 0;
`;

const RightFloatBar: React.FC = () => {
  const { t } = useTranslation();
  const { state, ExtractResources } = useExtract();
  const { setBatchRepair } = useBuildingRepair();
  const { toastSuccess } = useToast();

  const { unread_plunder_count, later_extract_time } = useStore(
    p => p.alliance.allianceView,
  );
  const { userInfo } = useStore(p => p.userInfo);
  const workingList = useStore(p => p.alliance.workingPlanet);

  const [ShowPlay, setShowPlay] = useState(false);
  const [CloseTips, setCloseTips] = useState(false);
  const [rechargeVisible, setRechargeVisible] = React.useState(false);
  const [repairVisible, setRepairVisible] = React.useState(false);
  const [modalTips, setModalTips] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  const ShowTip = useMemo(() => {
    if (CloseTips) return false;
    if (unread_plunder_count > 0) {
      return true;
    }
    return false;
  }, [CloseTips, unread_plunder_count]);

  // 一键补充行星联盟充值
  const rechargeHandle = React.useCallback(() => {
    if (userInfo.vipBenefits?.is_vip) {
      setRechargeVisible(true);
      return;
    }
    setModalTips(
      t(
        'One-click replenishment of storage tank energy, and resources can be deployed faster',
      ),
    );
    setVisible(true);
  }, [
    t,
    setVisible,
    setRechargeVisible,
    userInfo.vipBenefits?.is_vip,
    setModalTips,
  ]);

  // 行星联盟一键修复耐久
  const repairHandle = React.useCallback(() => {
    if (userInfo.vipBenefits?.is_vip) {
      setRepairVisible(true);
      return;
    }
    setModalTips(
      t(
        'One-click repair durability, you can repair the durability of all buildings on the planet faster',
      ),
    );
    setVisible(true);
  }, [
    t,
    setVisible,
    setRepairVisible,
    userInfo.vipBenefits?.is_vip,
    setModalTips,
  ]);

  return (
    <BarFlex>
      <RecordBox
        onMouseEnter={() => setShowPlay(true)}
        onMouseLeave={() => setShowPlay(false)}
      >
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('玩法介绍')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/help.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <RecordBox onClick={repairHandle}>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('修复耐久')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/icon-vip.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <RecordBox onClick={rechargeHandle}>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('充值资源')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/icon-vip.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <RecordBox onClick={() => ExtractResources()}>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {later_extract_time > 0
            ? EasyformatTime(state.Extracttime)
            : t('Extract')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/icon-vip.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <Link to='/platform-News'>
        <RecordBox>
          <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
            {t('站内消息')}
          </MarkText>
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              3
            </MarkText>
            <MessageBox />
          </Flex>
        </RecordBox>
      </Link>
      <Link to='/BattleReport'>
        <RecordBox onMouseEnter={() => setCloseTips(true)}>
          <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
            {t('联盟消息')}
          </MarkText>
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              {unread_plunder_count}
            </MarkText>
            {unread_plunder_count > 0 && <MessageBox />}
          </Flex>
          <TipBox
            height={ShowTip ? 'max-content' : '0px'}
            style={
              ShowTip
                ? { opacity: 0.5, overflow: 'inherit', padding: '6px 16px' }
                : {}
            }
          >
            <Text fontSize='14px'>{t('新的探索已完成')}</Text>
            <TipTriangle />
          </TipBox>
        </RecordBox>
      </Link>
      <HowToPlay ShowPlay={ShowPlay} setShowPlay={e => setShowPlay(e)} />
      <BuyVipModal
        tips={modalTips}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
      <RechargeAssets
        visible={rechargeVisible}
        onClose={() => setRechargeVisible(false)}
      />

      {repairVisible && (
        <ThingRepairModal
          planet_id={workingList}
          visible={repairVisible}
          onChange={async () => {
            const res = await setBatchRepair(workingList);
            if (res) {
              setRepairVisible(false);
              toastSuccess(t('planetQuickFixSuccessful'));
            }
          }}
          onClose={() => setRepairVisible(false)}
        />
      )}
    </BarFlex>
  );
};

export default RightFloatBar;
