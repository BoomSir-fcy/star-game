import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { Box, Button, Text } from 'uikit';

const Container = styled(Box)`
  position: relative;
  z-index: 10;
`;

const SideButton = styled(Box)`
  position: absolute;
  left: -15px;
  top: 0;
  z-index: 8;
`;

const Content = styled(Box)`
  position: absolute;
  left: -15px;
  top: 0;
  width: 200px;
  height: 300px;
  background-color: #fff;
  opacity: 0;
  z-index: 5;
  &.active {
    opacity: 1;
    transition: all ease;
    animation: bounceInLeft 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
    @keyframes bounceInLeft {
      0% {
        opacity: 0;
        transform: translate3d(-200px, 0, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
  }
`;

export const SideLeftContent = () => {
  const [state, setState] = React.useState({
    visible: false,
  });

  const close = () => {
    setState({ ...state, visible: false });
  };

  // React.useEffect(() => {
  //   window.addEventListener('click', close);
  //   return () => {
  //     window.removeEventListener('click', close);
  //   };
  // });

  return (
    <Container>
      <SideButton>
        {!state.visible && (
          <Button
            variant='text'
            onClick={() => setState({ visible: !state.visible })}
          >
            展开
          </Button>
        )}
      </SideButton>
      <Content className={classNames(state.visible && 'active')}>
        <Text>当前行星资源</Text>
      </Content>
    </Container>
  );
};
