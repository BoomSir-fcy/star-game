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
import { ReactSortable } from 'react-sortablejs';

export interface SortSoldier {
  id: string;
  src: string | undefined;
  soldier: Soldier;
}
interface SortBoardProps extends BorderCardProps {
  sortSoldiers: SortSoldier[];
  activeSoldier: Soldier | null;
  setSortSoldiers: (soldiers: Soldier[], update?: boolean) => void;
}

const defaultStyle = {
  backgroundColor: 'white',
  width: '122px',
  height: '122px',
  display: 'inline-block',
  margin: '12px auto 0',
};

interface SortItemProps extends Partial<SortSoldier> {
  isActive: boolean;
}
const SortItem: React.FC<SortItemProps> = ({
  id,
  src,
  isActive,
  soldier,
  ...props
}) => {
  return (
    <BorderCard
      margin='auto'
      width='122px'
      height='122px'
      isActive={isActive}
      position='relative'
    >
      <Box width={122} height={122}>
        <img alt='' style={{ width: '122px', height: '122px' }} src={src} />
        <Box width='100%' height='100%' position='absolute' top={0} left={0}>
          <Text mt='2px' ml='8px'>
            {id}
          </Text>
        </Box>
      </Box>
    </BorderCard>
  );
};

const SortBoard: React.FC<SortBoardProps> = ({
  sortSoldiers,
  activeSoldier,
  setSortSoldiers,
  ...props
}) => {
  const setState = useCallback(
    data => {
      setSortSoldiers(data.map((item: SortSoldier) => item.soldier));
    },
    [setSortSoldiers],
  );

  // const [state, setState] = useState([
  //   { id: 1, name: 'shrek' },
  //   { id: 2, name: 'fiona' },
  // ]);

  const handleUpdate = useCallback(() => {
    setSortSoldiers(
      sortSoldiers.map((item: SortSoldier) => item.soldier),
      true,
    );
  }, [sortSoldiers, setSortSoldiers]);

  return (
    <BorderCard overflow='auto' width='183px' height='476px' {...props}>
      <Text margin='20px 0 8px' fontSize='20px' textAlign='center'>
        攻击顺序
      </Text>
      <Box position='relative'>
        <ReactSortable
          onEnd={() => {
            handleUpdate();
          }}
          list={sortSoldiers}
          setList={setState}
        >
          {sortSoldiers.map(item => (
            <div style={{ marginTop: '16px' }} key={item.id}>
              <SortItem
                isActive={activeSoldier === item.soldier}
                id={`${item.id}`}
                src={item.src}
              />
            </div>
          ))}
        </ReactSortable>
      </Box>
    </BorderCard>
  );
};

export default SortBoard;
