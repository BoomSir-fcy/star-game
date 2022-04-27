import React, { useEffect, useState } from 'react';
import { Box, Text, Fringe, Button, Flex, RefreshButton, Spinner } from 'uikit';
import styled from 'styled-components';
import Layout from 'components/Layout';
import { useStore } from 'state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setState } from 'state/game/reducer';
import { useFetchGameMatchUser } from 'state/game/hooks';
import { GamePkState } from 'state/types';
import { GlobalVideo } from 'components/Video';
import Dashboard from 'components/Dashboard';
import { GameBoard } from 'game';
import PeopleCard from './components/PeopleCard';
import VsVideo from './components/VsVideo';
import SpinnerBox from './components/SpinnerBox';
import GamePK from './components/GamePK';
import {
  BoxStyled,
  PeopleCardLeft,
  PeopleCardRight,
  VsVideoStyled,
  ButtonBox,
  GameBox,
} from './components/styled';
import useFetchMatchUser from './hooks/useFetchMatchUser';

const Plunder = () => {
  // const [state, setState] = useState(GamePkState.MATCHING);
  const state = useStore(p => p.game.state);

  const dispatch = useDispatch();

  const { fetch, mineData, data, loading } = useFetchMatchUser();

  useEffect(() => {
    if (loading) {
      dispatch(setState(GamePkState.MATCHING));
    } else {
      dispatch(setState(GamePkState.MATCHED));
    }
  }, [loading, dispatch]);

  useEffect(() => {
    console.log(8888);
    fetch(1); //
    fetch();
  }, [fetch]);

  const navigate = useNavigate();

  return (
    <Layout>
      <Dashboard />
      <BoxStyled position='relative'>
        <PeopleCardLeft state={state} />
        <Fringe />
        <GlobalVideo src='/video/pk-2.mp4' loop top={300} left={712} />
        {state === GamePkState.MATCHING && (
          <GlobalVideo src='/video/loading.mp4' loop top={300} right={0} />
        )}
        <PeopleCardRight state={state} />

        <ButtonBox justifyContent='center' alignItems='center'>
          <Button
            variant='vs'
            onClick={() => {
              // setState(prev => {
              //   if (prev === GamePkState.DEFEAT) return GamePkState.MATCHING;
              //   return prev + 1;
              // });
              dispatch(setState(GamePkState.START));
              navigate('/plunder-pk');
            }}
            disabled={!GamePkState.MATCHED}
          >
            开始掠夺
          </Button>
          <RefreshButton
            disabled={!!GamePkState.MATCHING}
            onClick={() => fetch()}
            variant='vsRefresh'
          />
        </ButtonBox>
      </BoxStyled>
    </Layout>
  );
};

export default Plunder;
