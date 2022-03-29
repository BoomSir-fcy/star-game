import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Flex, Text, Button, Image, Box } from 'uikit';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'components/Modal';
import {
  useFetchInfoView,
  useFetchUserInfo,
  useFetchAllowance,
} from 'state/userInfo/hooks';
import { useStore } from 'state';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useConnectWallet } from 'contexts/ConnectWallet';
import StarGameBox from './components/StarGameBox';
import Flyer from './components/Flyer';
import Create, { ForwardRefRenderProps } from './components/Create';
import RegisterModal from './components/RegisterModal';
import { useCheckName, useRegisterWithDsg } from './hooks/signIn';
import { CheckNickNameState } from './types';
import { useLogin } from './hooks/login';

const StarGameBoxMove = styled(StarGameBox)<{ move?: boolean }>`
  transition: 0.3s;
  transform: translateY(${({ move }) => (move ? '-160px' : '0')});
`;

const EnterBoxMove = styled(Box)<{ move?: boolean }>`
  transition: 0.3s;
  transform: translateY(${({ move }) => (move ? '160px' : '0')});
`;

const CreateBoxShow = styled(Box)<{ show?: boolean }>`
  transition: 0.3s;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const Login = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const parsedQs = useParsedQueryString();

  const { onConnectWallet } = useConnectWallet();
  const { account } = useWeb3React();

  useFetchUserInfo();
  useFetchInfoView();
  useFetchAllowance();

  const { userInfoView, allowance, infoView } = useStore(p => p.userInfo);

  const { handleCheck } = useCheckName();
  const { handleRegister } = useRegisterWithDsg();
  const { handleLogin } = useLogin();

  const createRef = useRef<ForwardRefRenderProps>(null);
  const [visible, setVisible] = useState(false);

  const handleSign = useCallback(async () => {
    if (createRef?.current?.getState) {
      try {
        const { name } = createRef.current.getState();
        const state = await handleCheck(name);

        if (state === CheckNickNameState.EXACT_NAME) {
          setVisible(true);
        }
      } catch (error) {
        console.error(error);
        console.error('注册失败');
      }
    }
  }, [handleCheck, createRef, setVisible]);

  const onHandleRegister = useCallback(async () => {
    if (createRef?.current?.getState) {
      try {
        const { name, gender } = createRef.current.getState();
        const res = await handleRegister({
          nickname: name,
          superior: '0x0000000000000000000000000000000000000000',
          gender,
        });
        console.log(res);
      } catch (error) {
        console.error(error);
        console.error('注册失败');
      }
    }
  }, [handleRegister, createRef]);

  const handleEnter = useCallback(async () => {
    if (!account) {
      onConnectWallet();
      return;
    }
    // // TODO: 测试入口
    // if (account) {
    //   navigate('/mystery-box');
    //   return;
    // }
    if (parsedQs.s === '0') {
      const res = await handleLogin();
      if (res.code === 0) {
        navigate('/mystery-box');
      }

      return;
    }
    if (parsedQs.s === '1') {
      handleSign();
    }
    setVisible(false);
  }, [
    account,
    onConnectWallet,
    setVisible,
    parsedQs.s,
    handleSign,
    navigate,
    handleLogin,
  ]);

  useEffect(() => {
    if (!userInfoView.loading || !parsedQs.s) {
      console.log(userInfoView.isActive, 'isActive');
      if (account && !userInfoView.isActive) {
        navigate(`${pathname}?s=${1}`, { replace: true });
      } else {
        navigate(`${pathname}?s=${0}`, { replace: true });
      }
    }
  }, [
    account,
    pathname,
    navigate,
    userInfoView.loading,
    userInfoView.isActive,
    parsedQs.s,
  ]);

  const showCreate = useMemo(() => {
    return parsedQs.s === '1';
  }, [parsedQs.s]);

  return (
    <>
      <Flex
        height='100%'
        flexDirection='column'
        alignItems='center'
        justifyContent='space-around'
        position='relative'
      >
        <Flyer />
        <StarGameBoxMove move={showCreate} />
        <CreateBoxShow
          show={showCreate}
          position='absolute'
          top='150px'
          zIndex={1}
        >
          {/* 显示文字加载动画 */}
          {showCreate && <Create ref={createRef} />}
        </CreateBoxShow>
        <EnterBoxMove move={showCreate} position='relative' zIndex={2}>
          <Button onClick={handleEnter} variant='login'>
            ENTER
          </Button>
        </EnterBoxMove>
      </Flex>
      {account && (
        <RegisterModal
          visible={visible}
          setVisible={setVisible}
          price={infoView.price_}
          account={account}
          token={infoView.payToken_}
          onRegister={onHandleRegister}
        />
      )}
    </>
  );
};

export default Login;
