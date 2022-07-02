import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useImmer } from 'use-immer';
import { Flex, Box, MarkText, Image, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const Container = styled(Box)`
  position: relative;
  width: 261px;
  height: 173px;
  background: url('/images/commons/dashboard/token-group.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  margin-left: -5px;
  &.active {
    animation: bounceInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  &.removeActive {
    animation: bounceInLeft 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  @keyframes bounceInRight {
    0% {
      transform: translate(200px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
  @keyframes bounceInLeft {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(272px, 0);
    }
  }
`;

const SideCloseButton = styled(Button)`
  position: absolute;
  right: 255px;
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
`;

const Warp = styled(Flex)`
  padding: 20px 25px;
`;

export const BarRightWarp: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
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
        <Box
          position='absolute'
          left='0'
          right='0'
          top='-10px'
          style={{ margin: 'auto', textAlign: 'center' }}
        >
          <MarkText fontSize='14px' fontStyle='normal' bold>
            {title}
          </MarkText>
        </Box>
        {children}
        {/* <Warp flexWrap='wrap'>wssss</Warp> */}
      </Content>
    </Container>
  );
};
