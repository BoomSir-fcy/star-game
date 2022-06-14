import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Image, BgCard, Text, Button, Label } from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import ScoringPanel from 'components/ScoringPanel';
import StarCom from 'components/StarCom';
import { Globe } from 'components';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import { useLocation } from 'react-router-dom';
import { storeAction, useStore } from 'state';
import { useDispatch } from 'react-redux';
import 'intro.js/introjs.css';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import eventBus from 'utils/eventBus';
import Extra from './components/grow/Extra';
import { StrengthenConsumeType } from './components/grow/type';
import { GrowPop } from './components/grow/growPop';

const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;

const TopBox = styled(Label)`
  padding: 30px 48px;
  height: max-content;
  margin-bottom: 30px;
`;
const CardBox = styled(Flex)`
  width: 235px;
  height: 110px;
  align-items: center;
  justify-content: center;
`;
const TopBox1 = styled(CardBox)`
  background: url('/images/grow/left.png') center left no-repeat;
  text-align: left;
`;
const TopBox2 = styled(CardBox)`
  background: url('/images/grow/right.png') center right no-repeat;
  text-align: right;
`;

const Grow: React.FC = () => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const dispatch = useDispatch();
  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const { toastError, toastSuccess, toastWarning, toastInfo } = useToast();
  const id = Number(parsedQs.id);
  const planetInfo = useStore(p => p.planet.planetInfo[id ?? 0]);

  const [visible, setVisible] = useState(false);
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
    now_level: null,
    next_level: null,
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

  return (
    <Box>
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
      <BgCard variant='big' padding='50px 33px'>
        <Flex>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality={mysteryBoxQualities.SUPER} />
            <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
              {/* <StarCom
                margin='auto'
                variant='none'
                scale='ld'
                picture={planetInfo?.picture}
                quality={planetInfo?.rarity}
                picture1={planetInfo?.picture1}
              /> */}
              <Globe
                scale='ld'
                margin='auto'
                shadow={QualityColor[planetInfo?.rarity]}
                url={planetInfo?.picture1}
              />
            </MysteryBoxStarStyled>
          </MysteryBoxStyled>
          <Flex className='planet'>
            <Box>
              <TopBox>
                <Flex
                  width='100%'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Flex flexDirection='column' justifyContent='space-between'>
                    <Text
                      color={RaceTypeColor[planetInfo?.race]}
                      mb='2px'
                      fontSize='22px'
                      bold
                    >
                      {planetInfo?.race ? t(`race-${planetInfo?.race}`) : ''}
                    </Text>
                    <ScoringPanel
                      count={Number(estimateCost?.now_level) || 0}
                    />
                  </Flex>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <TopBox1>
                      <Text bold fontSize='24px' color='legendText'>
                        {estimateCost?.now_level === 20
                          ? 'MAX'
                          : `${t('Strengthen')} + ${
                              estimateCost?.now_level || 0
                            }`}
                      </Text>
                    </TopBox1>
                    <Box width={82}>
                      <Image
                        width={82}
                        height={42}
                        src='/images/commons/icon/upgrade.png'
                      />
                    </Box>
                    <TopBox2>
                      <Text bold fontSize='24px' color='legendText'>
                        {estimateCost?.next_level === 20
                          ? 'MAX'
                          : `${t('Strengthen')} + ${
                              estimateCost?.next_level || 0
                            }`}
                      </Text>
                    </TopBox2>
                  </Flex>
                </Flex>
              </TopBox>
              <Extra info={estimateCost} />
              <Flex
                paddingTop='30px'
                justifyContent='center'
                alignItems='center'
              >
                <Button
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  {t('Start Cultivating')}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </BgCard>
      <GrowPop
        visible={visible}
        planetInfo={planetInfo}
        itemData={estimateCost}
        onClose={() => setVisible(false)}
        callBack={getPlanetStrengthen}
      />
    </Box>
  );
};

export default Grow;
