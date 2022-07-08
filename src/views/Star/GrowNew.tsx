import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Flex, Image, BgCard, Text, Button, Label, Skeleton } from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';
import { useTranslation } from 'contexts/Localization';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import { useLocation } from 'react-router-dom';
import { storeAction, useStore } from 'state';
import { useDispatch } from 'react-redux';
import 'intro.js/introjs.css';
import eventBus from 'utils/eventBus';
import { TokenImage } from 'components/TokenImage';
import { getWEtherAddress } from 'utils/addressHelpers';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useToast } from 'contexts/ToastsContext';
import ModalWrapper from 'components/Modal';
import styled from 'styled-components';
import { formatDisplayApr } from 'utils/formatBalance';
import {
  Arms,
  Extra,
  GrowRule,
  GrowLevel,
  StrengthenConsumeType,
} from './components/grow';
import { successRate } from './components/grow/GrowLevel';
import useGrowThree from './components/grow/useGrowThree';

const BgFlex = styled(Flex)`
  width: 100%;
  height: 227px;
  margin-top: -80px;
  background: rgb(39 48 48 / 50%);
  box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
`;

const Grow: React.FC = () => {
  const ref = React.useRef(null);

  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const dispatch = useDispatch();
  const location = useLocation();
  const { toastError, toastSuccess } = useToast();
  const id = Number(parsedQs.id);
  const planetInfo = useStore(p => p.planet.planetInfo[id ?? 0]);

  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(0); // 1-成功 2-失败
  const [downgrade, setDowngrade] = useState(0); // 培育失败后掉的等级

  const { createPlanet } = useGrowThree(ref.current, planetInfo?.picture1);

  // 培育信息
  const [estimateCost, setEstimateCost] = useState<StrengthenConsumeType>({
    consume_bnb: null,
    estimate_buff: {
      defense: null,
      attack: null,
      hp: null,
      hit: null,
      speed: null,
      miss: null,
      critical: null,
    },
    now_buff: {
      defense: null,
      attack: null,
      hp: null,
      hit: null,
      speed: null,
      miss: null,
      critical: null,
    },
    now_level: 0,
    next_level: 0,
    now_units: [],
    estimate_units: [],
    now_power: 0,
    estimate_power: 0,
  });

  // 新手引导
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const steps = useMemo(
    () => [
      {
        element: '.planet_grow',
        intro: t('GuidePlanetGrow'),
      },
    ],
    [t],
  );

  const getPlanetStrengthen = useCallback(async () => {
    try {
      const res = await Api.PlanetApi.getPlanetStrengthen({
        PlanetID: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        const { data } = res;
        setEstimateCost(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [parsedQs.id, setEstimateCost]);

  useEffect(() => {
    getPlanetStrengthen();
  }, [getPlanetStrengthen]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  const onRefreshClick = React.useCallback(() => {
    getPlanetStrengthen();
  }, [getPlanetStrengthen]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  const ToStrengthenPlante = useCallback(async () => {
    try {
      setPending(true);
      const res = await Api.PlanetApi.StrengthenPlante({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        if (res?.data?.success) {
          toastSuccess(t('Operate Succeeded'));
          setIsSuccess(1);
        } else {
          setIsSuccess(2);
          setDowngrade(res?.data?.sub_level);
          createPlanet('');
        }
      }
      setPending(false);
      setVisible(false);
    } catch (error) {
      toastError(t('Operate Failed'));
      setPending(false);
      setIsSuccess(0);
      console.error(error);
    }
  }, [parsedQs.id, t, toastError, toastSuccess, createPlanet]);

  return (
    <Box width='100%' height='100%'>
      {!guides.guideFinish && guides.finish && steps.length - 1 >= guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={0}
          options={{
            exitOnOverlayClick: false,
            tooltipPosition: 'top',
          }}
          onExit={step => {
            setStepsEnabled(false);
            setGuide(steps.length + 1);
            // dispatch(storeAction.toggleVisible({ visible: true }));
          }}
        />
      )}
      <Box
        ref={ref}
        position='absolute'
        width='800px'
        height='800px'
        left='0'
        right='0'
        top='0'
        bottom='0'
        margin='auto'
        zIndex={-1}
      />
      {isSuccess ? (
        <Flex
          mt='80px'
          height='658px'
          width='100%'
          alignItems='center'
          justifyContent='center'
        >
          <BgFlex flexDirection='column' alignItems='center'>
            {isSuccess === 1 ? (
              <Flex alignItems='baseline'>
                <Text height={126} fontSize='60px' fontStyle='normal' mark bold>
                  {t('Cultivate Succeeded')}
                </Text>
                <Box width={33}>
                  <Image
                    width={33}
                    height={33}
                    src='/images/commons/icon/up.png'
                  />
                  <Image
                    mt='-10px'
                    width={33}
                    height={33}
                    src='/images/commons/icon/up.png'
                  />
                </Box>
              </Flex>
            ) : (
              <Flex>
                <Box width={537}>
                  <Text fontSize='34px' fontStyle='normal' mark bold>
                    {t('Unfortunately! Cultivate Failed')}
                  </Text>
                  <Text fontSize='34px' fontStyle='normal' mark bold>
                    {t("Influenced by the black hole's magnetic field")}
                  </Text>
                </Box>
                <Box width={33}>
                  <Image
                    width={33}
                    height={33}
                    src='/images/commons/icon/down.png'
                  />
                  <Image
                    mt='-10px'
                    width={33}
                    height={33}
                    src='/images/commons/icon/down.png'
                  />
                </Box>
              </Flex>
            )}
            <Flex flexDirection='column' alignItems='center'>
              <Flex
                mt='10px'
                justifyContent='space-between'
                alignItems='center'
              >
                {isSuccess === 1 ? (
                  <Box>
                    <Text textAlign='center' fontSize='20px'>
                      {t('Power')}
                    </Text>
                    <Text fontSize='28px' fontStyle='normal' mark bold>
                      {formatDisplayApr(estimateCost?.now_power)}
                    </Text>
                  </Box>
                ) : (
                  <Box>
                    <Text textAlign='center' small>
                      {t('Level')}
                    </Text>
                    <Text fontSize='20px' fontStyle='normal' mark bold>
                      {estimateCost?.now_level}
                    </Text>
                  </Box>
                )}
                <Box margin='0 39px' width={58}>
                  <Image
                    width={58}
                    height={28}
                    src='/images/commons/icon/upgrade.png'
                  />
                </Box>
                {isSuccess === 1 ? (
                  <Box>
                    <Text textAlign='center' fontSize='20px'>
                      {t('Power')}
                    </Text>
                    <Text fontSize='28px' fontStyle='normal' mark bold>
                      {formatDisplayApr(estimateCost?.estimate_power)}
                    </Text>
                  </Box>
                ) : (
                  <Box>
                    <Text textAlign='center' small>
                      {t('Level')}
                    </Text>
                    <Text fontSize='20px' fontStyle='normal' mark bold>
                      {estimateCost?.now_level - downgrade}
                    </Text>
                  </Box>
                )}
              </Flex>
              <Button
                mt='200px'
                width='277px'
                height='50px'
                variant='purple'
                onClick={() => {
                  setIsSuccess(0);
                  if (isSuccess === 2) {
                    createPlanet(planetInfo?.picture1);
                  }
                  dispatch(fetchPlanetInfoAsync([Number(parsedQs.id)]));
                  getPlanetStrengthen();
                }}
              >
                <Text fontSize='16px' color='textPrimary' bold>
                  {t('Config')}
                </Text>
              </Button>
            </Flex>
          </BgFlex>
        </Flex>
      ) : (
        <Flex
          mt='80px'
          height='658px'
          width='100%'
          alignItems='center'
          justifyContent='center'
        >
          <Box className='planet_grow'>
            <GrowLevel
              nowLevel={estimateCost?.now_level}
              nextLevel={estimateCost?.next_level}
              now_power={estimateCost?.now_power}
              estimate_power={estimateCost?.estimate_power}
            />
          </Box>
          <Flex alignItems='flex-end'>
            <Box margin='0 120px'>
              <Flex justifyContent='center'>
                <Box width={30}>
                  <TokenImage
                    width={30}
                    height={30}
                    tokenAddress={getWEtherAddress()}
                  />
                </Box>
                <Text ml='15px' fontSize='22px' bold>
                  {t('BNB')}
                </Text>
                <Text ml='15px' fontSize='22px' fontStyle='normal' bold mark>
                  {estimateCost?.consume_bnb?.toString()}
                </Text>
              </Flex>
              <Button
                mt='19px'
                width='277px'
                height='50px'
                variant='purple'
                onClick={() => setVisible(true)}
              >
                <Text fontSize='16px' color='textPrimary' bold>
                  {t('Cultivate')}
                </Text>
              </Button>
            </Box>
            <GrowRule />
          </Flex>
          {/* <Box>
          <Extra info={estimateCost} />
          <Arms info={estimateCost} />
        </Box>  */}
        </Flex>
      )}

      <ModalWrapper
        title={t('Planet Cultivation')}
        visible={visible}
        setVisible={setVisible}
      >
        <Box padding='30px 25px'>
          <Flex
            flex='1'
            mt='100px'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
          >
            <Text fontSize='24px'>
              {t('CultivationConfirmDesc', {
                rate: t(successRate(estimateCost?.now_level)),
                value:
                  estimateCost?.now_level >= 1 && estimateCost?.now_level <= 6
                    ? ''
                    : t('CultivationConfirmDesc1'),
              })}
            </Text>
            <Flex mt='30px' width='100%' justifyContent='center'>
              <Button
                variant='purple'
                width='350px'
                onClick={() => ToStrengthenPlante()}
              >
                {t('Confirm Cultivating')}
              </Button>
            </Flex>
          </Flex>
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default Grow;
