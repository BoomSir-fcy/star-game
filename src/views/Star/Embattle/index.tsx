import React, { useState, useRef, useEffect } from 'react';
import { Box, Text } from 'uikit';
import Boards from 'game/core/Boardse';

const Embattle = () => {
  const [boards] = useState(new Boards());

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(boards.app?.view);
    }
  }, [ref, boards]);

  return (
    <Box>
      <Text>啊啊啊</Text>
      <Box ref={ref} />
    </Box>
  );
};

export default Embattle;
