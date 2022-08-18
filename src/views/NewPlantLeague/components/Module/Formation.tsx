import React, { useState, useCallback } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, GraphicsCard } from 'uikit';
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

const FormationBox = styled(Box)`
  width: 316px;
  height: 276px;
  background: url('/images/commons/sky-bg3.jpg') no-repeat;
  background-size: cover;
`;

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

  // 开始工作
  const StartOrStopWorking = useCallback(async () => {
    await Api.AllianceApi.AllianceWorking({ difficulty: Difficulty })
      .then(res => {
        if (Api.isSuccess(res)) {
          toastSuccess(t('Operate Succeeded'));
          dispatch(fetchAllianceViewAsync());
        }
      })
      .catch(err => {
        toastError(t('Operate Failed'));
        console.error(err);
      });
  }, [toastSuccess, toastError, t, dispatch, Difficulty]);

  return (
    <OutBox
      zIndex={1}
      position='absolute'
      padding='30px 50px'
      className={FormationModule ? 'show' : ''}
    >
      <Flex alignItems='center' justifyContent='space-between'>
        {(order || []).map(planet => {
          const item = planet?.planet;
          return (
            <Box key={item.id}>
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
                <GameFormation planetInfo={item} />
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
                StartOrStopWorking();
                setFormation(false);
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
    </OutBox>
  );
};

export default Formation;
