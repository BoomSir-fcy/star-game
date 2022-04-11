import React from 'react';
import { useStore } from 'state';
import { Box } from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';

import { DragCompoents } from './components/dragCompoents';

const Upgrade = () => {
  const parsedQs = useParsedQueryString();
  const [state, setState] = React.useState({
    data: [] as any[],
  });
  const id = Number(parsedQs.id);
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);

  React.useEffect(() => {
    if (planet?.areaX > 0 && planet?.areaY > 0) {
      const data: any = [];
      for (let i = 0; i < planet.areaX; i++) {
        for (let j = 0; j < planet.areaY; j++) {
          const buildings = selfBuilding?.find(
            (r: any) => r.index === i * planet.areaY + j,
          );
          if (buildings) {
            data.push({
              ...buildings,
              ...buildings.building,
              x: i,
              y: j,
              index: i * planet.areaY + j,
              isbuilding: true,
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

      setState({ ...state, data });
    }
  }, [planet, selfBuilding]);

  return (
    <Box>
      <DragCompoents
        rows={planet?.areaX}
        cols={planet?.areaY}
        planet_id={id}
        gridSize={476}
        itemData={state.data}
      />
    </Box>
  );
};

export default Upgrade;
