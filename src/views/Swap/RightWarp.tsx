import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useImmer } from 'use-immer';
import { Flex, Box, MarkText, Image, Button, BoxProps } from 'uikit';
import { useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import { setAssetsVisible } from 'state/planet/actions';
import { useLocation } from 'react-router-dom';

const Container = styled(Box)`
  position: fixed;
  width: 546px;
  height: 286px;
  background: url('/images/commons/dashboard/token-buff.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  top: 0;
  right: 10px;
  &.active {
    animation: bounceInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  &.removeActive {
    animation: bounceInLeft 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
    @keyframes bounceInLeft {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(585px);
      }
    }
    ${({ theme }) => theme.mediaQueries.md} {
      @keyframes bounceInLeft {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(545px);
        }
      }
    }
  }
  @keyframes bounceInRight {
    0% {
      transform: translateX(200px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

const SideCloseButton = styled(Button)`
  position: absolute;
  right: 525px;
  top: calc(50% - 87px);
  width: 43px;
  height: 173px;
  z-index: 15;
  padding: 0;
  background-image: url('../images/commons/sideCloseButton.png');
  &:active {
    transform: rotate(0deg) !important;
  }
`;

const Content = styled(Box)`
  position: relative;
  padding: 20px 25px 30px;
  height: 100%;
`;

interface RightWarpProps extends BoxProps {
  children: React.ReactNode;
}
const RightWarp: React.FC<RightWarpProps> = ({ children, ...props }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const [Visible, setVisible] = useState(true);

  return (
    <Container
      mt='20px'
      {...props}
      className={classNames(Visible ? 'active' : 'removeActive')}
    >
      <SideCloseButton
        variant='text'
        onClick={() => {
          setVisible(!Visible);
        }}
      >
        <Box width='34px' height='42px'>
          <Image
            src='../images/commons/icon/icon-back.png'
            width={34}
            height={42}
          />
        </Box>
      </SideCloseButton>
      <Content>{children}</Content>
    </Container>
  );
};

export default RightWarp;
