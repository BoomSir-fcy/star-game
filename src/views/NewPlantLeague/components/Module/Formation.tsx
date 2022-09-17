import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  Flex,
  Box,
  BgCard,
  MarkText,
  Text,
  Spinner,
  GraphicsCard,
} from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { useStore } from 'state';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { PlanetBall } from 'components';
import { QualityColor } from 'uikit/theme/colors';
import { useNavigate } from 'react-router-dom';
import ModalWrapper from 'components/Modal';
import GameFormation from './GameFormation';

const OutBox = styled(Box)`
  width: 1918px;
  height: 640px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  left: 0;
  bottom: -670px;
  display: none;
  &.show {
    animation: showModule 500ms linear;
    bottom: -20px;
    display: block;
    @keyframes showModule {
      0% {
        bottom: -670px;
      }
      100% {
        bottom: -20px;
      }
    }
  }
`;

const LoadingBox = styled(Flex)`
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FormationBox = styled(Box)`
  width: 316px;
  height: 276px;
  background: url('/images/commons/sky-bg3.jpg') no-repeat;
  background-size: cover;
`;

const ScrollBox = styled(Box)`
  height: 200px;
  overflow-y: auto;
`;

interface WorkErrListView {
  err_type: number;
  planet_id: number;
}

const Formation: React.FC<{
  Difficulty: number;
  FormationModule: boolean;
  setFormation: (e) => void;
}> = ({ Difficulty, FormationModule, setFormation }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toastError, toastSuccess } = useToast();
  const dispatch = useDispatch();
  const { order } = useStore(p => p.alliance.allianceView);
  const [LoadPlanet, setLoadPlanet] = useState<Api.Planet.PlanetInfo[]>();
  const [WorkErrList, setWorkErrList] = useState<WorkErrListView[]>([]);
  const [visible, setVisible] = useState(false);

  // 开始工作
  const StartOrStopWorking = useCallback(async () => {
    await Api.AllianceApi.AllianceWorking({ difficulty: Difficulty })
      .then(res => {
        if (Api.isSuccess(res)) {
          toastSuccess(t('Operate Succeeded'));
          dispatch(fetchAllianceViewAsync());
          navigate('/explore-progress');
        }
      })
      .catch(err => {
        toastError(t('Operate Failed'));
        console.error(err);
      });
  }, [toastSuccess, toastError, t, dispatch, Difficulty, navigate]);

  const addLoadPlanet = useCallback(() => {
    if (LoadPlanet?.length >= 5) {
      return;
    }
    const ids = LoadPlanet.map(obj => obj?.id);
    if (ids.indexOf(order[LoadPlanet?.length]?.planetId) === -1) {
      setLoadPlanet([...LoadPlanet, order[LoadPlanet?.length]?.planet]);
    }
  }, [LoadPlanet, order]);

  useEffect(() => {
    if (order?.length === 5) {
      setLoadPlanet([order[0]?.planet]);
    }
  }, [order]);

  const CanWork = useMemo(() => {
    let can = true;
    WorkErrList.forEach(item => {
      if (item.err_type === 7 || item.err_type === 8) {
        can = false;
      }
    });
    return can;
  }, [WorkErrList]);

  const getWorkCheck = useCallback(async () => {
    await Api.AllianceApi.getStartCheck()
      .then(res => {
        if (Api.isSuccess(res)) {
          setWorkErrList(res.data.err);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    getWorkCheck();
  }, [getWorkCheck]);

  return (
    <OutBox
      zIndex={1}
      position='absolute'
      padding='30px 50px'
      className={FormationModule ? 'show' : ''}
    >
      <Flex alignItems='center' justifyContent='space-between'>
        {(LoadPlanet || []).map(item => {
          // const item = planet?.planet;
          return (
            <Box
              display={LoadPlanet?.length >= 5 ? 'block' : 'none'}
              key={item.id}
            >
              <Flex mb='24px'>
                <PlanetBall
                  scale='xs'
                  shadow={QualityColor[item?.rarity]}
                  url={item?.picture1}
                />
                <Box ml='20px'>
                  <MarkText mb='10px' fontStyle='normal' fontSize='20px' bold>
                    Lv {item?.level}
                  </MarkText>
                  <MarkText fontStyle='normal' fontSize='20px' bold>
                    {item?.power}
                  </MarkText>
                </Box>
              </Flex>
              <FormationBox>
                <GameFormation
                  LoadPlanet={LoadPlanet}
                  addLoadPlanet={addLoadPlanet}
                  planetInfo={item}
                />
              </FormationBox>
              <Flex pt='30px' justifyContent='center'>
                <Button
                  variant='purple'
                  height={45}
                  width='180px'
                  onClick={() => {
                    navigate(`/star/embattle?id=${item.id}`);
                  }}
                >
                  <Text color='textPrimary'>{t('Set Battle Lineup')}</Text>
                </Button>
              </Flex>
            </Box>
          );
        })}
        {LoadPlanet?.length < 5 && (
          <LoadingBox>
            <Spinner size={200} />
          </LoadingBox>
        )}
      </Flex>

      <Flex justifyContent='center' pt='40px'>
        <GraphicsCard
          style={{ padding: '18px 40px' }}
          width='max-content'
          height='max-content'
          stripe
        >
          <Flex>
            <Button
              mr='60px'
              variant='purple'
              height={45}
              width='180px'
              onClick={() => {
                if (WorkErrList.length) {
                  setVisible(true);
                } else {
                  StartOrStopWorking();
                  setFormation(false);
                }
              }}
            >
              <Text color='textPrimary'>{t('Confirmed,Go!!')}</Text>
            </Button>
            <Button
              variant='purple'
              height={45}
              width='180px'
              onClick={() => {
                setFormation(false);
              }}
            >
              <Text color='textPrimary'>{t('Cancel')}</Text>
            </Button>
          </Flex>
        </GraphicsCard>
      </Flex>
      <ModalWrapper
        title={t('Tips')}
        visible={visible}
        setVisible={() => {
          setVisible(false);
        }}
      >
        <Box padding='30px 25px'>
          {/* 联盟存在以下问题，是否继续探索 */}
          <Text mb='20px' textAlign='center' fontSize='20px' bold>
            {CanWork ? t('workErrTips1') : t('workErrTips2')}
          </Text>
          <ScrollBox>
            {(WorkErrList || []).map(item => {
              return (
                <Flex
                  key={`${item.planet_id}${item.err_type}`}
                  alignItems='center'
                  width='60%'
                  margin='0 auto 10px'
                >
                  <Text mr='20px'>Token: {item.planet_id}</Text>
                  <Text color='redText'>{t(`workErr${item.err_type}`)}</Text>
                </Flex>
              );
            })}
          </ScrollBox>
          <Flex justifyContent='center' pt='20px'>
            {CanWork && (
              <Button
                mr='60px'
                variant='purple'
                height={45}
                width='180px'
                onClick={() => {
                  StartOrStopWorking();
                  setFormation(false);
                  setVisible(false);
                }}
              >
                <Text color='textPrimary'>{t('Confirmed,Go!!')}</Text>
              </Button>
            )}
            <Button
              variant='purple'
              height={45}
              width='180px'
              onClick={() => {
                setVisible(false);
              }}
            >
              <Text color='textPrimary'>{t('Cancel')}</Text>
            </Button>
          </Flex>
        </Box>
      </ModalWrapper>
    </OutBox>
  );
};

export default Formation;
