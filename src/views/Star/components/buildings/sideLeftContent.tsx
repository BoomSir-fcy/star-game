import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useStore, storeAction } from 'state';
import { Flex, Box, Button, Image, Text } from 'uikit';
import { useDispatch } from 'react-redux';
import { GameThing } from '../gameModel';

const Container = styled(Box)`
  position: fixed;
  top: 0;
  left: -16px;
  z-index: 999;
`;
const SideCloseButton = styled(Button)`
  position: absolute;
  left: 290px;
  top: calc(50% - 87px);
  width: 43px;
  height: 173px;
  z-index: 15;
  padding: 0;
  background-image: url('../images/commons/sideCloseButton.png');
  transform: rotate(180deg) !important;
  &:active {
    transform: rotate(180deg) !important;
  }
`;
const Content = styled(Box)`
  position: absolute;
  top: 0;
  width: 294px;
  height: 100vh;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  opacity: 0;
  transition: all ease;
  &.active {
    opacity: 1;
    left: 0;
    animation: bounceSideInLeft 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  &.removeActive {
    animation: bounceSideInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  @keyframes bounceSideInLeft {
    0% {
      transform: translate3d(-200px, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes bounceSideInRight {
    0% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    100% {
      opacity: 0;
      transform: translate3d(-500px, 0, 0);
    }
  }
`;

const ScrollView = styled(Box)`
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

const BuildingsItem = styled(Box)`
  position: relative;
  margin-right: 20px;
  margin-bottom: 15px;
  &.active {
    .game-thing {
      background-color: #000;
      &::after {
        position: absolute;
        display: block;
        content: '';
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        border-radius: 10px;
        border: 2px solid #fff;
        box-shadow: ${({ theme }) => theme.shadows.highlight};
        z-index: 5;
      }
    }
  }
  &:nth-child(2n) {
    margin-right: 0;
  }
`;

export const SideLeftContent = () => {
  const dispatch = useDispatch();
  const queueStore = useStore(p => p.buildling.queue);
  const buildings = useStore(p => p.buildling.buildings);

  const close = React.useCallback(() => {
    dispatch(storeAction.queueVisbleSide(false));
  }, [dispatch]);

  React.useEffect(() => {
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('click', close);
    };
  }, [close]);

  return (
    <Container>
      <Content
        className={classNames(queueStore.visible ? 'active' : 'removeActive')}
      >
        <SideCloseButton variant='text' onClick={close}>
          <Box width='34px' height='42px'>
            <Image
              src='../images/commons/icon/icon-back.png'
              width={34}
              height={42}
            />
          </Box>
        </SideCloseButton>
        <ScrollView>
          <Flex flexWrap='wrap'>
            {(buildings[1] ?? []).map(
              (row: Api.Building.Building, index: number) => (
                <BuildingsItem
                  key={row.buildings_number}
                  className={classNames(`building_${index}`)}
                >
                  <GameThing
                    scale='sm'
                    round
                    itemData={row}
                    level={row.propterty.levelEnergy}
                    src={row.picture}
                    text={row?.propterty.name_cn}
                  />
                </BuildingsItem>
              ),
            )}
          </Flex>
        </ScrollView>
      </Content>
    </Container>
  );
};
