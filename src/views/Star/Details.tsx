import React from 'react';
import { useStore } from 'state';
import { Box } from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';

import { DragCompoents } from './components/dragCompoents';

const Upgrade = () => {
  const parsedQs = useParsedQueryString();
  const id = Number(parsedQs.id);
  const [state, setState] = React.useState({
    // data: [
    //   {
    //     index: 1,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 2,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 3,
    //     row: 2,
    //     icon: '/images/model/edifice_01.png',
    //   },
    //   {
    //     index: 4,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 5,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 6,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 7,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 8,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    //   {
    //     index: 9,
    //     row: 1,
    //     icon: '/images/model/combat_01.png',
    //   },
    // ],
    data: [] as any[],
  });
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);

  // console.log(selfBuilding);

  React.useEffect(() => {
    if (planet?.areaX > 0 && planet?.areaY > 0) {
      const data: any = [];
      for (let i = 0; i < planet.areaX; i++) {
        for (let j = 0; j < planet.areaY; j++) {
          const buildings = selfBuilding?.find(
            index => index.index === i * planet.areaY + j,
          );
          // console.log(buildings);
          if (buildings) {
            data.push({
              ...buildings,
              ...buildings.building,
              index: i * planet.areaY + j,
              isbuilding: true,
            });
          } else {
            data.push({
              index: i * planet.areaY + j,
              isbuilding: false,
              picture: '',
              propterty: {
                size: {
                  area_x: 1,
                  area_y: 1,
                },
              },
              position: {
                x: 0,
                y: 0,
              },
            });
          }
        }
      }

      setState({ ...state, data });
    }
  }, [planet, selfBuilding]);

  return (
    <Box>
      <DragCompoents
        planet_id={id}
        rows={planet?.areaX}
        cols={planet?.areaY}
        gridSize={158}
        itemData={state.data}
      />
    </Box>
  );
};

export default Upgrade;
