import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { Box, Text, Image, BorderCard, BorderCardProps } from 'uikit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import AsanySortable, { SortableItemProps } from '@asany/sortable';
import client from 'utils/client';
import Soldier from 'game/core/Soldier';

export interface SortSoldier {
  id: string;
  src: string | undefined;
  soldier: Soldier;
}
interface SortBoardProps extends BorderCardProps {
  sortSoldiers: SortSoldier[];
  setSortSoldiers: (soldiers: any) => void;
}

const defaultStyle = {
  backgroundColor: 'white',
  width: '122px',
  height: '122px',
  display: 'inline-block',
  margin: '12px auto 0',
};

const SortItem = forwardRef((props: SortableItemProps<any>, ref: any) => {
  const { data, style, drag, className, animated, remove } = props;
  console.log(data, 'data');
  return (
    <li
      className={className}
      style={{ ...defaultStyle, position: 'relative', ...style }}
      ref={drag(ref)}
      {...animated}
    >
      <BorderCard width='100%' height='100%' isActive>
        <Box width={122} height={122}>
          <img
            alt=''
            style={{ width: '122px', height: '122px' }}
            src='/assets/modal/m0-1.png'
          />
          <Box width='100%' height='100%' position='absolute' top={0} left={0}>
            <Text mt='2px' ml='8px'>
              1
            </Text>
          </Box>
        </Box>
      </BorderCard>
    </li>
  );
});

const SortBoard: React.FC<SortBoardProps> = ({ sortSoldiers, ...props }) => {
  const handleChange = useCallback((data, event) => {
    console.log(data, event);
  }, []);

  return (
    <BorderCard
      overflow='auto'
      isActive
      width='183px'
      height='476px'
      {...props}
    >
      <Text fontSize='20px' textAlign='center'>
        攻击顺序
      </Text>
      <DndProvider backend={client.isApp ? TouchBackend : HTML5Backend}>
        <AsanySortable
          accept={['sortable-card']}
          tag='ul'
          style={{ listStyle: 'none', padding: 0 }}
          items={sortSoldiers}
          layout='grid'
          onChange={handleChange}
          itemRender={SortItem}
        />
      </DndProvider>
    </BorderCard>
  );
};

export default SortBoard;
