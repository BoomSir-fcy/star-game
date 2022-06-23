import useBuilding from 'building/hooks/useBuilding';
import Builder from 'building/core/Builder';
import React, { useRef } from 'react';
import { Text, Card, Box, Button } from 'uikit';

const DragAndPut: React.FC = () => {
  const building = useBuilding({
    width: 1500,
    height: 900,
  });
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(building.view);
      building.creatTerrain([]);
    }
  }, [building, ref]);

  return (
    <Box width='100%' height='100%' position='relative'>
      <Box position='absolute' zIndex={2}>
        <Button
          onClick={() => {
            const bb = new Builder();
            building.addBuilder(bb);
          }}
        >
          创建
        </Button>
      </Box>
      <Box top={-250} position='absolute' ref={ref} />
    </Box>
  );
};

export default DragAndPut;
