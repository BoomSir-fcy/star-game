import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Flex, Text, Button, Image, Box } from 'uikit';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'components/Modal';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useConnectWallet } from 'contexts/ConnectWallet';
import StarGameBox from './components/StarGameBox';
import Flyer from './components/Flyer';
import Create from './components/Create';

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
  const [visible, setVisible] = useState(true);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const parsedQs = useParsedQueryString();

  const { onConnectWallet } = useConnectWallet();
  const { account } = useWeb3React();

  const handleEnter = useCallback(() => {
    if (!account) {
      onConnectWallet();
      return;
    }
    if (parsedQs.s === '') {
      // TODO: 注册登录
      // navigate(`${pathname}?s=${1}`, { replace: true });
    }
    setVisible(true);
  }, [account, onConnectWallet, setVisible, parsedQs.s]);

  useEffect(() => {
    if (account) {
      navigate(`${pathname}?s=${1}`, { replace: true });
    }
  }, [account, pathname, navigate]);

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
          <Create />
        </CreateBoxShow>
        <EnterBoxMove move={showCreate} position='relative' zIndex={2}>
          <Button onClick={handleEnter} variant='login'>
            ENTER
          </Button>
        </EnterBoxMove>
      </Flex>
      {/* <Modal visible={visible} setVisible={setVisible}>
        <Image src='/images/commons/dsg-1.png' width={500} height={300} />
      </Modal> */}
    </>
  );
};

export default Login;
