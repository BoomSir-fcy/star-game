import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  BgCard,
  BackButton,
  RefreshButton,
  Button,
  GraphicsCard,
} from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import Layout from 'components/Layout';
import { Api } from 'apis';
import { useStore } from 'state';
import { setActiveMaterialMap } from 'state/planet/actions';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { Nav } from 'components';
import { PlanetSearch, PlanetRaceTabs } from '..';
import { PlanetBox } from './PlanetBox';

const ScrollBox = styled(Box)`
  margin-top: 22px;
  min-height: 550px;
  max-height: 672px;
  overflow-y: auto;
`;

const MaterialBox = styled(Box)<{ disabled?: boolean }>`
  position: relative;
  margin-bottom: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;
const ChooseBox = styled(Flex)`
  position: absolute;
  right: 25px;
  top: 22px;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  background: url('/images/commons/icon/choose.png') no-repeat;
  background-size: 100% 100%;
`;
const LinkStyled = styled(Link)`
  :hover {
    text-decoration: underline;
    text-decoration-color: #fff;
  }
`;

const SelectPlanet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.i);
  const { t } = useTranslation();
  const { toastWarning } = useToast();
  const [starList, setStarList] = useState([]);
  const [state, setState] = useState({
    page: 1,
    token: 0,
    race: 0,
  });

  const { activeMaterialMap, activePlanet } = useStore(p => p.planet);

  const init = useCallback(async () => {
    try {
      const params = {
        planet_id: planetId,
        find_planet_id: state.token,
        race: state.race,
        rarity: Number(parsedQs.t) || 0,
      };
      const res = await Api.PlanetApi.getMaterialList(params);
      if (Api.isSuccess(res)) {
        setStarList(res.data?.Data || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, [planetId, state, parsedQs.t]);

  useEffect(() => {
    init();
  }, [parsedQs.t, state.race, state.token, init]);

  // 可最多添加5个星球
  const addMaterialPlanet = useCallback(
    (item: any) => {
      if (!activeMaterialMap[item?.id]) {
        // 选择
        if (Object.keys(activeMaterialMap).length >= 5) {
          // 满了
          toastWarning(t('Choose up to 5 planets'));
          return;
        }
        dispatch(setActiveMaterialMap({ [item.id]: item }));
      } else {
        // 取消选择
        dispatch(setActiveMaterialMap({ [item.id]: null }));
      }
    },
    [activeMaterialMap, t, dispatch, toastWarning],
  );

  return (
    <Layout>
      <Flex width='100%'>
        <Box>
          <Flex padding='0 20px' mb='60px'>
            <BackButton />
            <RefreshButton ml='33px' />
          </Flex>
          <Nav
            activeId={Number(parsedQs.t)}
            nav={[
              {
                id: 0,
                label: t('All'),
                path: `/upgrade-list?t=0&i=${planetId}`,
              },
              {
                id: 1,
                label: t('rarity-1'),
                path: `/upgrade-list?t=1&i=${planetId}`,
              },
              {
                id: 2,
                label: t('rarity-2'),
                path: `/upgrade-list?t=2&i=${planetId}`,
              },
              {
                id: 3,
                label: t('rarity-3'),
                path: `/upgrade-list?t=3&i=${planetId}`,
              },
              {
                id: 4,
                label: t('rarity-4'),
                path: `/upgrade-list?t=4&i=${planetId}`,
              },
              {
                id: 5,
                label: t('rarity-5'),
                path: `/upgrade-list?t=5&i=${planetId}`,
              },
              {
                id: 6,
                label: t('rarity-6'),
                path: `/upgrade-list?t=6&i=${planetId}`,
              },
            ]}
          />
        </Box>
        <Flex ml='30px' mr='30px' flex={1}>
          <GraphicsCard
            width='100%'
            height='100%'
            borderWidth={2}
            padding='26px 30px'
          >
            <Flex justifyContent='space-between'>
              <PlanetRaceTabs
                current={state.race}
                callBack={id => setState({ ...state, race: id })}
              />
              <PlanetSearch
                onEndCallback={value =>
                  setState({ ...state, token: value ? Number(value) : 0 })
                }
              />
            </Flex>
            <ScrollBox>
              {(starList ?? []).map((item: any) => (
                <React.Fragment key={`${item.id}_${item.name}`}>
                  <MaterialBox
                    mb='20px'
                    onClick={() => {
                      addMaterialPlanet(item);
                    }}
                  >
                    <PlanetBox
                      info={item}
                      active={
                        Object.keys(activeMaterialMap).indexOf(`${item.id}`) !==
                        -1
                      }
                      onSelect={() => {
                        addMaterialPlanet(item);
                      }}
                    />
                  </MaterialBox>
                </React.Fragment>
              ))}
              {!starList?.length && (
                <Flex
                  mt='50px'
                  width='100%'
                  justifyContent='center'
                  alignItems='center'
                >
                  <LinkStyled to='/mystery-box'>
                    <Text fontSize='18px'>
                      {t('No data, Go to open the blind box')} &gt;
                    </Text>
                  </LinkStyled>
                </Flex>
              )}
            </ScrollBox>
            {/* {starList?.length && (
              <Flex mt='10px' justifyContent='center'>
                <Button
                  disabled={!starList?.length}
                  onClick={() => navigate(-1)}
                >
                  {t('Join in')}
                </Button>
              </Flex>
            )} */}
          </GraphicsCard>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default SelectPlanet;
