import React, { useState, useRef, useEffect } from 'react';
import { Box, Text } from 'uikit';
import Boards from 'game/core/boards';

const Embattle = () => {
  const [boards] = useState(new Boards());

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      boards.render(ref.current);
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
