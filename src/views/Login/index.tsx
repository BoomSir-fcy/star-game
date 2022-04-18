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
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { useStore } from 'state';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useToast } from 'contexts/ToastsContext';
import { isAddress } from 'utils';
import { useConnectWallet } from 'contexts/ConnectWallet';
import { fetchUserProductAsync } from 'state/userInfo/reducer';
import { useTranslation } from 'contexts/Localization';
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
  const { t } = useTranslation();

  const { onConnectWallet } = useConnectWallet();
  const { account } = useWeb3React();

  const { toastSuccess, toastWarning, toastError } = useToast();
  const { fetch } = useFetchUserInfo();

  useFetchUserInfo();
  useFetchInfoView();
  useFetchAllowance();

  const { userInfoView, allowance, infoView } = useStore(p => p.userInfo);

  const { handleCheck } = useCheckName();
  const { handleRegister } = useRegisterWithDsg();
  const { handleLogin, getPlanetNum } = useLogin();

  const createRef = useRef<ForwardRefRenderProps>(null);
  const [visible, setVisible] = useState(false);
  let timer: any = 0;

  const handleSign = useCallback(async () => {
    if (createRef?.current?.getState) {
      try {
        const { name, superior } = createRef.current.getState();

        const state = await handleCheck(name);

        if (state === CheckNickNameState.NULL_NAME) {
          toastError(t('Enter your desired name'));
          return;
        }
        if (
          state === CheckNickNameState.SHORT_NAME ||
          state === CheckNickNameState.LONG_NAME
        ) {
          toastError(t('6~30 characters (Support English, Chinese, numbers)'));
          return;
        }

        if (superior && !isAddress(superior)) {
          toastError(t('Invalid invitation address'));
          return;
        }
        if (state === CheckNickNameState.BAD_NAME_WITH_CONTRACT) {
          // FIXME: 这个提示有问题
          toastError(t('Please enter the correct nickname'));
          return;
        }

        if (state === CheckNickNameState.EXACT_NAME) {
          setVisible(true);
        }
      } catch (error) {
        console.error(error);
        console.error(t('Registration failed'));
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
        timer = setInterval(async () => {
          toastWarning(t('loginSigninSearch'));
          const result = await Api.UserApi.getCheck({
            address: String(account),
          });
          if (Api.isSuccess(result) && result?.data?.register) {
            if (timer) clearInterval(timer);
            fetch();
            setVisible(false);
          }
        }, 6000);
      } catch (error) {
        console.error(error);
        toastError(t('RegistrationCheckBalance'));
      }
    }
  }, [
    handleRegister,
    toastError,
    toastWarning,
    fetch,
    setVisible,
    t,
    createRef,
    account,
  ]);

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
