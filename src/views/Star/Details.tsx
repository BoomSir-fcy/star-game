import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStore, storeAction } from 'state';
import { Box } from 'uikit';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import useParsedQueryString from 'hooks/useParsedQueryString';
import { useGuide } from 'hooks/useGuide';
import { DragCompoents } from './components/dragCompoents';

const Details = () => {
  const parsedQs = useParsedQueryString();
  const location = useLocation();
  const dispatch = useDispatch();
  const { guides, setGuide } = useGuide(location.pathname);
  const [state, setState] = React.useState([]);
  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [steps, setSteps] = React.useState([
    {
      element: '.planet_header',
      intro: '每个星球都有自己的产能和资源，来源于建筑的建造策略。',
    },
    {
      element: '.common_nav',
      intro: '左侧导航可以对星球升级，培育，布阵等进行管理。',
    },
    {
      element: '.star_manager',
      intro:
        '每个星球都有建造格子，格子数量与品质挂钩。合理的建造策略，也是致胜的方法之一。',
    },
    {
      element: '.buildings',
      intro: '建造列表会展示可以建造的单位，包括消耗，类型，产能等',
    },
    {
      element: '.building_0',
      intro: '开始创建星球的第一个建筑，拖住建筑放置到棋盘合适的地方。',
    },
    {
      element: '.building_1',
      intro: '继续建造一个建筑。',
    },
  ]);
  const id = Number(parsedQs.id);
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);

  const updateGrid = React.useCallback(data => {
    setState(data);
  }, []);

  React.useEffect(() => {
    if (planet?.areaX > 0 && planet?.areaY > 0) {
      const data: any = [];
      for (let i = 0; i < planet.areaX; i++) {
        for (let j = 0; j < planet.areaY; j++) {
          const buildings = selfBuilding?.find(
            r => r.index === i * planet.areaY + j,
          );
          if (buildings?.building?._id) {
            data.push({
              ...buildings,
              ...buildings.building,
              x: i,
              y: j,
              index: i * planet.areaY + j,
              isbuilding: true,
              isactive: false,
            });
          } else {
            data.push({
              index: i * planet.areaY + j,
              isbuilding: false,
              propterty: {
                size: {
                  area_x: 1,
                  area_y: 1,
                },
              },
              x: i,
              y: j,
            });
          }
        }
      }
      updateGrid(data);
    }
  }, [planet, selfBuilding, updateGrid]);

  React.useEffect(() => {
    dispatch(storeAction.toggleVisible({ visible: false }));
  }, [dispatch]);

  return (
    <Box>
      {guides.finish && steps.length - 1 > guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
            disableInteraction: false,
          }}
          onChange={currentStep => {
            if (currentStep > guides.step) {
              setGuide(currentStep);
            }
          }}
          onExit={() => {
            setStepsEnabled(false);
            dispatch(storeAction.toggleVisible({ visible: true }));
          }}
        />
      )}
      <DragCompoents
        rows={planet?.areaX}
        cols={planet?.areaY}
        planet_id={id}
        gridSize={476}
        itemData={state}
      />
    </Box>
  );
};

export default Details;
