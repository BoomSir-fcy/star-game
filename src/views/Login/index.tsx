import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { AddressZero } from '@ethersproject/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'components/Modal';
import { Flex, Text, Button, Image, Box } from 'uikit';
import {
  useFetchInfoView,
  useFetchUserInfo,
  useFetchAllowance,
} from 'state/userInfo/hooks';
import { useDispatch } from 'react-redux';
import { useStore } from 'state';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useToast } from 'contexts/ToastsContext';
import { isAddress } from 'utils';
import { useConnectWallet } from 'contexts/ConnectWallet';
import { fetchUserProductAsync } from 'state/userInfo/reducer';
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
  transform: translateY(${({ move }) => (move ? '200px' : '0')});
`;

const CreateBoxShow = styled(Box)<{ show?: boolean }>`
  transition: 0.3s;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const Login = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const parsedQs = useParsedQueryString();
  const dispatch = useDispatch();

  const { onConnectWallet } = useConnectWallet();
  const { account } = useWeb3React();

  const { toastSuccess, toastError } = useToast();

  useFetchUserInfo();
  useFetchInfoView();
  useFetchAllowance();

  const { userInfoView, allowance, infoView } = useStore(p => p.userInfo);

  const { handleCheck } = useCheckName();
  const { handleRegister } = useRegisterWithDsg();
  const { handleLogin, getPlanetNum } = useLogin();

  const createRef = useRef<ForwardRefRenderProps>(null);
  const [visible, setVisible] = useState(false);

  const handleSign = useCallback(async () => {
    if (createRef?.current?.getState) {
      try {
        const { name, superior } = createRef.current.getState();

        const state = await handleCheck(name);

        if (state === CheckNickNameState.NULL_NAME) {
          toastError('请输入您想要的名称');
          return;
        }
        if (
          state === CheckNickNameState.SHORT_NAME ||
          state === CheckNickNameState.LONG_NAME
        ) {
          toastError('请输入6~30个字符，支持中英文、数字');
          return;
        }

        if (superior && !isAddress(superior)) {
          toastError('无效邀请地址');
          return;
        }
        if (state === CheckNickNameState.BAD_NAME_WITH_CONTRACT) {
          // FIXME: 这个提示有问题
          toastError('请输正确的昵称');
          return;
        }

        if (state === CheckNickNameState.EXACT_NAME) {
          setVisible(true);
        }
      } catch (error) {
        console.error(error);
        console.error('注册失败');
      }
    }
  }, [handleCheck, createRef, setVisible, toastError]);

  const onHandleRegister = useCallback(async () => {
    if (createRef?.current?.getState) {
      try {
        const { name, gender, superior } = createRef.current.getState();
        const res = await handleRegister({
          nickname: name,
          superior: superior || AddressZero,
          gender,
        });
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
        const num = await getPlanetNum();
        console.log(num);

        if (num.code === 0) {
          const planetNum = num.data?.List?.planet_num;
          console.log(planetNum);

          if (planetNum > 0) {
            navigate('/star/planet');
          } else {
            navigate('/mystery-box');
          }
        } else {
          navigate('/mystery-box');
        }
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
    dispatch,
  ]);

  useEffect(() => {
    if (!userInfoView.loading || !parsedQs.s) {
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
