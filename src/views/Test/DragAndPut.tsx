import useBuilding from 'building/hooks/useBuilding';
import Builder from 'building/core/Builder';
import React, { useCallback, useRef } from 'react';
import { Text, Card, Box, Button } from 'uikit';

const DragAndPut: React.FC = () => {
  const building = useBuilding({
    width: 1500,
    height: 900,
  });
  const ref = useRef<HTMLDivElement>(null);
  const createHandle = React.useCallback(() => {
    [
      [0, 0],
      [2, 0],
      [3, 1],
      [0, 2],
      [0, 3],
    ].forEach(item => {
      // const bb = new Builder();
      building.createBuilder(item[0], item[1]);
      // bb.setPointAsXY(item[0], item[1]);
    });
  }, [building]);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(building.view);
      building.creatTerrain([]);
      createHandle();
    }
  }, [building, ref, createHandle]);

  return (
    <Box width='100%' height='100%' position='relative'>
      <Box position='absolute' zIndex={2}>
        <Button onClick={createHandle}>创建</Button>
      </Box>
      <Box top={-250} position='absolute' ref={ref} />
    </Box>
  );
};

export default DragAndPut;
