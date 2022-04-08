import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Flex } from 'uikit';
import Boards from 'game/core/Boards';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard from './components/SortBoard';

const Embattle = () => {
  const [boards] = useState(new Boards());

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(boards.app?.view);
    }
  }, [ref, boards]);

  return (
    <Box position='relative'>
      <Box ref={ref} />
      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        left='824px'
      >
        <Preview />
        <SortBoard ml='8px' />
      </Flex>
      <Box
        style={{ userSelect: 'none' }}
        position='absolute'
        top='490px'
        left='0'
      >
        <PreviewList boards={boards} />
      </Box>
    </Box>
  );
};

export default Embattle;
