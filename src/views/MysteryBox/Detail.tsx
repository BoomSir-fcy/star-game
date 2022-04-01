import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Card, Text, Flex, BgCard, Label, Button } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import StarCom from 'components/StarCom';
import { useStore } from 'state';
import { useDispatch } from 'react-redux';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import Attributes from './components/Attributes';
import Extra from './components/Extra';
import Race from './components/Race';

const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;
const StarLabelStyled = styled(Card)`
  position: absolute;
  width: 435px;
  height: 110px;
  bottom: 7px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 10px 20px;
  z-index: 3;
`;

const MysteryBoxDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paramsQs = useParsedQueryString();
  const id = Number(paramsQs.i);

  const { planetInfo } = useStore(p => p.planet);

  const info = useMemo(() => {
    return planetInfo?.length ? planetInfo[0] : ({} as any);
  }, [planetInfo]);

  useEffect(() => {
    if (id) dispatch(fetchPlanetInfoAsync([id]));
  }, [id, dispatch]);
  return (
    <Layout>
      <Dashboard />
      <Flex>
        <MysteryBoxStyled>
          <MysteryBoxBaseStyled quality={mysteryBoxQualities.ORDINARY} />
          <MysteryBoxStarStyled quality={mysteryBoxQualities.ORDINARY}>
            <StarCom variant='none' scale='ld' />
          </MysteryBoxStarStyled>
          <StarLabelStyled>
            <Flex flexDirection='column' alignItems='center'>
              <Text ellipsis bold>
                {info?.name}
              </Text>
              <Text mt='10px' ellipsis small>
                Token: {info?.id}
              </Text>
            </Flex>
          </StarLabelStyled>
        </MysteryBoxStyled>
        <BgCard variant='sFull'>
          <Flex padding='38px 53px' justifyContent='space-between'>
            <Attributes info={info}>
              <Race info={info} />
            </Attributes>
            <Extra info={info} ml='20px'>
              <Flex mt='30px' justifyContent='center'>
                <Button
                  variant='transparent'
                  onClick={() => {
                    navigate('/star/planet');
                    navigate('/star');
                  }}
                >
                  管理星球
                </Button>
              </Flex>
            </Extra>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default MysteryBoxDetail;
