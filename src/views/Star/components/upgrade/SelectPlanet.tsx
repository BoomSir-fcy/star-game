import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, BgCard, BackButton, RefreshButton } from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import Layout from 'components/Layout';
import { Api } from 'apis';
import { useStore } from 'state';
import { setActiveMaterialMap } from 'state/planet/actions';
import { PlanetBox } from '../planet/PlanetBox';

const ScrollBox = styled(Flex)`
  margin-top: 22px;
  min-height: 550px;
  max-height: 730px;
  overflow-y: auto;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
`;

const MaterialBox = styled(Box)<{ disabled?: boolean }>`
  margin-bottom: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const SelectPlanet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.i);
  const [starList, setStarList] = useState([]);

  const activeMaterialMap = useStore(p => p.planet.activeMaterialMap);

  const init = useCallback(async () => {
    try {
      const res = await Api.PlanetApi.getMaterialList(planetId);
      if (Api.isSuccess(res)) {
        setStarList(res.data?.Data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [planetId]);

  useEffect(() => {
    init();
  }, [init]);

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
                    disabled={!!activeMaterialMap[item.id]}
                    mb='20px'
                    onClick={() => {
                      if (activeMaterialMap[item.id]) {
                        return;
                      }
                      dispatch(setActiveMaterialMap({ [item.id]: item }));
                      navigate(-1);
                    }}
                  >
                    <PlanetBox info={item} />
                  </MaterialBox>
                </React.Fragment>
              ))}
            </ScrollBox>
          </BgCard>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default SelectPlanet;
