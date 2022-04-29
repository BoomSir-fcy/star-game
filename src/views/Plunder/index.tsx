import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Fringe, Button, Flex, RefreshButton, Spinner } from 'uikit';
import styled from 'styled-components';
import Layout from 'components/Layout';
import { useStore } from 'state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPKInfo, setState } from 'state/game/reducer';
import { useFetchGameMatchUser } from 'state/game/hooks';
import { GamePkState } from 'state/types';
import { GlobalVideo } from 'components/Video';
import useParsedQueryString from 'hooks/useParsedQueryString';
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
import usePlunder from './hooks/usePlunder';

const Plunder = () => {
  // const [state, setState] = useState(GamePkState.MATCHING);
  const { state, matchUser, mineUser } = useStore(p => p.game);

  const { fetch } = useFetchGameMatchUser();

  const dispatch = useDispatch();

  const { handlePlunder } = usePlunder();

  // const { fetch, mineData, data, loading } = useFetchMatchUser();

  // useEffect(() => {
  //   if (loading) {
  //     dispatch(setState(GamePkState.MATCHING));
  //   } else {
  //     dispatch(setState(GamePkState.MATCHED));
  //   }
  // }, [loading, dispatch]);

  const navigate = useNavigate();

  const handleConfirming = useCallback(async () => {
    if (matchUser?.address) {
      dispatch(setState(GamePkState.CONFIRMING));
      const res = await handlePlunder(matchUser?.address);
      if (res) {
        dispatch(setState(GamePkState.START));
        navigate('/plunder-pk');
      } else {
        dispatch(setState(GamePkState.MATCHED));
      }
    }
  }, [handlePlunder, matchUser, dispatch, navigate]);

  return (
    <Layout>
      <BoxStyled position='relative'>
        <PeopleCardLeft state={state} {...mineUser} />
        <Fringe />
        {state === GamePkState.CONFIRMING ? (
          <GlobalVideo src='/video/confirming.mp4' loop top={300} left={712} />
        ) : (
          <GlobalVideo src='/video/pk-2.mp4' loop top={300} left={712} />
        )}
        {state === GamePkState.MATCHING && (
          <GlobalVideo src='/video/loading.mp4' loop top={300} right={0} />
        )}
        <PeopleCardRight state={state} {...matchUser} />

        <ButtonBox justifyContent='center' alignItems='center'>
          <Button
            variant='vs'
            onClick={() => {
              handleConfirming();
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
