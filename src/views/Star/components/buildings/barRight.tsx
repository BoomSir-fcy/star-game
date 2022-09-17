import React from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Flex, Box, MarkText, BoxProps } from 'uikit';

import { useTranslation } from 'contexts/Localization';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'contexts/ToastsContext';
import { BuyVipModal } from 'components/Modal/buyVipModal';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useDispatch } from 'react-redux';
import { setEmptyUnits } from 'state/game/reducer';
import { BarCard } from './barCard';
import { BarHead } from './barHead';
import { PlanetAssets } from './planetAssets';
import { PlanetBuff } from './planetBuff';
import { useBuffer } from '../hooks';
import { NewPlanetAssets } from './NewPlanetAssets';
import { ThingRepairModal } from '../Modal';
import { useBuildingRepair } from '../gameModel/hooks';

const BarLayout = styled(Box)<{ top: number | string }>`
  position: fixed;
  right: 0;
  /* top: 8%; */
  top: ${({ top }) => top};
  z-index: 88;
`;

const ImgFlex = styled(Flex)`
  width: 38px;
  img {
    width: 100%;
  }
`;
interface BarRightProps extends BoxProps {
  planet_id: number;
  top: number | string;
}
export const BarRight: React.FC<BarRightProps> = ({
  planet_id,
  top,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPlanetBuff } = useBuffer();
  const [currentBufffer, setCurrentBuffer] = React.useState({});
  const planetInfo = useStore(p => p.planet.planetInfo[planet_id ?? 0]);

  const dispatch = useDispatch();

  const getBuffer = React.useCallback(async () => {
    const res = await getPlanetBuff({ planet_id });
    const buffer = (res ?? []).reduce((current: any, next: any) => {
      // eslint-disable-next-line array-callback-return
      Object.keys(next).map((key: string) => {
        if (current[key]) {
          // eslint-disable-next-line no-param-reassign
          current[key] += next[key];
        } else {
          // eslint-disable-next-line no-param-reassign
          current[key] = next[key];
        }
      });
      return current;
    }, {});
    setCurrentBuffer(buffer);
  }, [getPlanetBuff, planet_id]);

  React.useEffect(() => {
    getBuffer();
  }, [getBuffer]);

  const { setBatchRepair } = useBuildingRepair();
  const { toastSuccess } = useToast();

  const { userInfo } = useStore(p => p.userInfo);
  const [repairVisible, setRepairVisible] = React.useState(false);
  const [modalTips, setModalTips] = React.useState('');
  const [visible, setVisible] = React.useState(false);

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
    <BarLayout top={top} {...props}>
      <Flex flexDirection='column' alignItems='flex-end'>
        <BarHead plant_info={planetInfo} />
        <BarCard
          title={t('planetMenuBuilding')}
          onClick={() => navigate(`/star?id=${planet_id}`, { replace: true })}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='10px'
            position='relative'
          >
            <MarkText bold pl='0'>
              {planetInfo?.build_count}
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard
          title={t('planetMenuUpgrade')}
          onClick={() =>
            navigate(`/star/upgrade?id=${planet_id}`, { replace: true })
          }
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='10px'
            position='relative'
          >
            <MarkText bold pl='0'>
              Lv{planetInfo?.level}
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard
          title={t('planetMenuGrow')}
          onClick={() =>
            navigate(`/star/grow?id=${planet_id}`, { replace: true })
          }
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='10px'
            position='relative'
          >
            <MarkText bold pl='0'>
              +{planetInfo?.strengthenLevel}
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard
          className='guide_step_9'
          title={t('planetMenuEmbattle')}
          onClick={() => {
            dispatch(setEmptyUnits({}));
            navigate(`/star/embattle?id=${planet_id}`, { replace: true });
          }}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='10px'
            position='relative'
          >
            <ImgFlex justifyContent='center' alignItems='center'>
              <img src='/images/commons/icon/icon-finish.png' alt='' />
            </ImgFlex>
          </Flex>
        </BarCard>
        <BarCard
          className='Regenerate_END'
          title={t('Regenerate END')}
          onClick={() => {
            repairHandle();
          }}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='10px'
            position='relative'
          >
            <ImgFlex justifyContent='center' alignItems='center'>
              <img src='/images/commons/icon/icon-vip.png' alt='' />
            </ImgFlex>
          </Flex>
        </BarCard>

        {/* <PlanetAssets plant_info={planetInfo} current_buff={currentBufffer} /> */}
        <NewPlanetAssets
          plant_info={planetInfo}
          current_buff={currentBufffer}
        />
      </Flex>
      <BuyVipModal
        tips={modalTips}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />

      {repairVisible && (
        <ThingRepairModal
          planet_id={[planet_id]}
          visible={repairVisible}
          onChange={async () => {
            const res = await setBatchRepair([planet_id]);
            if (res) {
              dispatch(fetchPlanetInfoAsync([planet_id]));
              setRepairVisible(false);
              toastSuccess(t('planetQuickFixSuccessful'));
            }
          }}
          onClose={() => setRepairVisible(false)}
        />
      )}
    </BarLayout>
  );
};
