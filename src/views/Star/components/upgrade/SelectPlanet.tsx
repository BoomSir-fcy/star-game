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
} from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import Layout from 'components/Layout';
import { Api } from 'apis';
import { useStore } from 'state';
import { setActiveMaterialMap } from 'state/planet/actions';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { PlanetBox } from '../planet/PlanetBox';

const ScrollBox = styled(Flex)`
  margin-top: 22px;
  min-height: 550px;
  max-height: 672px;
  overflow-y: auto;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
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

  const activeMaterialMap = useStore(p => p.planet.activeMaterialMap);

  const init = useCallback(async () => {
    try {
      const res = await Api.PlanetApi.getMaterialList(planetId);
      if (Api.isSuccess(res)) {
        setStarList(res.data?.Data || []);
        // setStarList([]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [planetId]);

  useEffect(() => {
    init();
  }, [init]);

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
        </Box>
        <Flex ml='7px' flex={1}>
          <BgCard variant='full' fringe padding='40px 37px'>
            <ScrollBox>
              {(starList ?? []).map((item: any) => (
                <React.Fragment key={`${item.id}_${item.name}`}>
                  <MaterialBox
                    // disabled={!!activeMaterialMap[item.id]}
                    mb='20px'
                    onClick={() => {
                      addMaterialPlanet(item);
                      // if (activeMaterialMap[item.id]) {
                      //   return;
                      // }
                      // dispatch(setActiveMaterialMap({ [item.id]: item }));
                      // navigate(-1);
                    }}
                  >
                    <PlanetBox info={item} providedExp />
                    <ChooseBox>
                      <Text fontSize='22px'>
                        {Object.keys(activeMaterialMap).indexOf(
                          `${item.id}`,
                        ) !== -1
                          ? Object.keys(activeMaterialMap).indexOf(
                              `${item.id}`,
                            ) + 1
                          : ''}
                      </Text>
                    </ChooseBox>
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
                    <Text small>
                      {t('No data, Go to open the blind box')} &gt;
                    </Text>
                  </LinkStyled>
                </Flex>
              )}
            </ScrollBox>
            {starList?.length && (
              <Flex mt='10px' justifyContent='center'>
                <Button
                  disabled={!starList.length}
                  onClick={() => navigate(-1)}
                >
                  {t('Join in')}
                </Button>
              </Flex>
            )}
          </BgCard>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default SelectPlanet;
