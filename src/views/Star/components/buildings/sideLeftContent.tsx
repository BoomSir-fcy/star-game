import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import Building from 'building/core/Building';
import Builder from 'building/core/Builder';
import { useStore, storeAction } from 'state';
import { Flex, Box, Button, Image, Text } from 'uikit';
import { getBuilderSpriteRes } from 'building/core/utils';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'contexts/Localization';
import { setNavZIndex } from 'state/userInfo/reducer';
import { raceData } from 'config/buildConfig';
import { GameThing } from '../gameModel';
import { useActiveBuilder } from '../../detailHooks';

const Container = styled(Box)`
  position: fixed;
  top: 0;
  left: -18px;
  height: 100%;
  z-index: 199;
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
const Content = styled(Box)<{ animation?: boolean }>`
  position: absolute;
  top: 0;
  width: 294px;
  height: 100%;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  opacity: 0;
  transition: all 0.5s ease;
  &.active {
    opacity: 1;
    left: 0;
    animation: ${({ animation }) =>
      animation &&
      'bounceSideInLeft 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate forwards'};
  }
  &.removeActive {
    animation: bounceSideInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  @keyframes bounceSideInLeft {
    0% {
      transform: translate(-200px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
  @keyframes bounceSideInRight {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-500px, 0);
    }
  }
`;

const ScrollView = styled(Flex)`
  padding: 20px;
  width: 100%;
  height: calc(100% - 20px);
  flex-wrap: wrap;
  overflow: hidden scroll;
`;

const BuildingsItem = styled(Box)`
  min-width: 0;
  max-width: 48%;
  margin-right: 20px;
  margin-bottom: 15px;
  &:nth-child(2n) {
    margin-right: 0;
  }
`;

interface SideLeftContentProps {
  building: Building;
  race: number;
  sideRightStatus: boolean;
  animation: boolean;
  onPreview: (val) => void;
  onChangeGuide: () => void;
}
export const SideLeftContent: React.FC<SideLeftContentProps> = ({
  building,
  race,
  sideRightStatus,
  animation,
  onPreview,
  onChangeGuide,
}) => {
  const dispatch = useDispatch();
  const activeBuilder = useActiveBuilder(building);
  const queueStore = useStore(p => p.buildling.queue);
  const buildings = useStore(p => p.buildling.buildings);

  const close = React.useCallback(() => {
    if (!animation) return;
    if (!activeBuilder?.id && queueStore.visible && !sideRightStatus) {
      dispatch(setNavZIndex(true));
      dispatch(storeAction.queueVisbleSide(false));
    }
  }, [activeBuilder, dispatch, queueStore.visible, sideRightStatus, animation]);

  React.useEffect(() => {
    if (!sideRightStatus) {
      dispatch(setNavZIndex(true));
      dispatch(storeAction.queueVisbleSide(false));
    }
  }, [dispatch, sideRightStatus]);

  React.useEffect(() => {
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('click', close);
    };
  }, [close]);

  const [moving, setMoving] = React.useState(false);

  const dragEndHandle = React.useCallback(
    (event: PointerEvent) => {
      event.preventDefault();
      if (moving) {
        setMoving(false);
        building?.offDragPreBuilder();
      }
    },
    [building, moving, setMoving],
  );

  const dragStartHandle = React.useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      item: Api.Building.Building,
    ) => {
      event.preventDefault();
      const builder = new Builder({
        src: `${item.index}`,
        id: `${item._id}`,
        building: item,
        race,
        areaX: item.propterty.size.area_x,
        areaY: item.propterty.size.area_y,
        isBuilding: false,
        enableDrag: true,
      });
      setMoving(true);
      building?.addDragPreBuilder(builder);
    },
    [building, race],
  );

  React.useEffect(() => {
    window.addEventListener('pointerup', dragEndHandle);
    return () => {
      window.removeEventListener('pointerup', dragEndHandle);
    };
  }, [dragEndHandle]);

  // 上阵
  const handleGoIntoBattle = (item: Api.Building.Building) => {
    const option = {
      src: `${item.index}`,
      id: `${item._id}`,
      building: item,
      race,
      areaX: item.propterty.size.area_x,
      areaY: item.propterty.size.area_y,
      isBuilding: false,
      enableDrag: true,
    };
    building?.addDragPreBuilderApp(option);
  };

  const getBuildings = React.useCallback(
    index => {
      const build = raceData[race]?.[index];
      return build;
    },
    [race],
  );

  const { t } = useTranslation();

  return (
    <Container>
      <Content
        animation={animation}
        className={classNames(queueStore.visible ? 'active' : 'removeActive')}
      >
        <SideCloseButton
          variant='text'
          onClick={() => {
            if (!activeBuilder?.id && !sideRightStatus) {
              dispatch(setNavZIndex(true));
            }
            dispatch(storeAction.queueVisbleSide(false));
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
        <ScrollView>
          {(buildings[1] ?? []).map(
            (row: Api.Building.Building, index: number) => (
              <BuildingsItem key={row.buildings_number}>
                {/* <Text>{getBuilderSpriteRes(race, `${row.index}`)}</Text> */}
                <GameThing
                  className={index === 0 && 'guide_step_6'}
                  scale='sm'
                  round
                  itemData={row}
                  level={row.propterty.levelEnergy}
                  src={getBuilderSpriteRes(race, `${row.index}`)}
                  text={t(getBuildings(row.index)?.name)}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    onPreview({ ...row, isPreview: true });
                  }}
                  onPointerDown={e => {
                    dragStartHandle(e, row);
                  }}
                  onAddClick={() => {
                    handleGoIntoBattle(row);
                    onPreview(row);
                    onChangeGuide();

                    dispatch(setNavZIndex(true));
                    dispatch(storeAction.queueVisbleSide(false));
                  }}
                />
              </BuildingsItem>
            ),
          )}
        </ScrollView>
      </Content>
    </Container>
  );
};
