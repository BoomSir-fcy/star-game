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
import useGrowThree from './components/grow/useGrowThree';
import {
  Arms,
  Extra,
  GrowRule,
  GrowLevel,
  StrengthenConsumeType,
} from './components/grow';

const Grow: React.FC = () => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const dispatch = useDispatch();
  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const { toastError, toastSuccess } = useToast();
  const id = Number(parsedQs.id);
  const planetInfo = useStore(p => p.planet.planetInfo[id ?? 0]);

  const [pending, setPending] = useState(false);
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

  const [stepsEnabled, setStepsEnabled] = useState(true);
  const steps = useMemo(
    () => [
      {
        element: '.planet',
        intro: t(
          'Cultivation can greatly improve its combat effectiveness and capacity acquisition, including the growth of various attributes',
        ),
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
        toastSuccess(t('Operate Succeeded'));
        dispatch(fetchPlanetInfoAsync([Number(parsedQs.id)]));
      }
      setPending(false);
    } catch (error) {
      toastError(t('Operate Failed'));
      setPending(false);
      console.error(error);
    }
  }, [parsedQs.id, t, dispatch, toastError, toastSuccess]);

  const ref = React.useRef(null);

  useGrowThree(ref.current, planetInfo?.picture1);

  return (
    <Box width='86%' mt='6%'>
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
            setGuide(step + 1);
            // dispatch(storeAction.toggleVisible({ visible: true }));
          }}
        />
      )}
      <Box
        left='14%'
        bottom='-1%'
        ref={ref}
        position='absolute'
        width='800px'
        height='800px'
        zIndex={-1}
      />
      <Flex justifyContent='space-between' alignItems='flex-end'>
        <Box>
          <GrowLevel
            nowLevel={estimateCost?.now_level}
            nextLevel={estimateCost?.next_level}
            now_power={estimateCost?.now_power}
            estimate_power={estimateCost?.estimate_power}
          />
          <GrowRule />
        </Box>
        <Box>
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
            onClick={ToStrengthenPlante}
          >
            <Text fontSize='16px' color='textPrimary' bold>
              {t('Cultivate')}
            </Text>
          </Button>
        </Box>
        <Box>
          <Extra info={estimateCost} />
          <Arms info={estimateCost} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Grow;
