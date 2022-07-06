import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useImmer } from 'use-immer';
import { Flex, Box, MarkText, Image, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const Container = styled(Box)`
  position: relative;
  width: 546px;
  height: 286px;
  background: url('/images/commons/dashboard/token-buff.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  &.active {
    animation: bounceInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  &.removeActive {
    animation: bounceInLeft 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
    @keyframes bounceInLeft {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(585px, 0);
      }
    }
    ${({ theme }) => theme.mediaQueries.md} {
      @keyframes bounceInLeft {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(545px, 0);
        }
      }
    }
  }
  @keyframes bounceInRight {
    0% {
      transform: translate(200px, 0);
    }
    100% {
      transform: translate(0, 0);
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
  padding: 20px 28px 30px;
`;

export const BarRightWarp: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { t } = useTranslation();
  const [state, setState] = useImmer({
    visible: true,
  });

  return (
    <Container
      mt='20px'
      className={classNames(state?.visible ? 'active' : 'removeActive')}
    >
      <SideCloseButton
        variant='text'
        onClick={() =>
          setState(p => {
            p.visible = !state.visible;
          })
        }
      >
        <Box width='34px' height='42px'>
          <Image
            src='../images/commons/icon/icon-back.png'
            width={34}
            height={42}
          />
        </Box>
      </SideCloseButton>
      <Content>
        {children}
        {/* <Warp flexWrap='wrap'>wssss</Warp> */}
      </Content>
    </Container>
  );
};
