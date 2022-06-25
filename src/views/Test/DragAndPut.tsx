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

  return (
    <Box width='100%' height='100%' position='relative'>
      <Box top={-250} position='absolute' ref={ref} />
    </Box>
  );
};

export default DragAndPut;
