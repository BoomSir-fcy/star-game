import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import { Box, Text, Flex, BorderCard, BorderCardProps } from 'uikit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import AsanySortable, { SortableItemProps } from '@asany/sortable';
import client, { isApp } from 'utils/client';
import Soldier from 'game/core/Soldier';
import { ReactSortable } from 'react-sortablejs';

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

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

const ItemBox = styled(Box)`
  margin-top: 16px;
  width: 126px;
  height: 126px;
  background: #161920;
  border: 1px solid #34363b;
  border-radius: 10px;
  box-shadow: 0px 7px 3px 0px rgba(0, 0, 0, 0.35);
  div {
    pointer-events: none;
  }
`;

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

let dragged = {} as any;
let targeted = {} as any;
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

  const dragStart = (e: any) => {
    if (isApp()) {
      const img = new Image();
      img.src = e.target.getElementsByTagName('img')[0]?.src;
      img.style.transform = 'rotate(90deg)';
      img.style.width = '100px';
      img.style.height = '100px';
      e.dataTransfer.setDragImage(img, 0, 0);
    }
    dragged = e.target;
  };

  const dragEnter = (e: any) => {
    e.preventDefault();
    const { target } = e;
    if (target.tagName !== 'DIV') {
      return;
    }
    targeted = target;
    handleUpdate();
  };

  const handleUpdate = useCallback(() => {
    setSortSoldiers(
      sortSoldiers.map((item: SortSoldier) => item.soldier),
      true,
    );
  }, [sortSoldiers, setSortSoldiers]);

  return (
    <BorderCard
      isActive
      overflow='auto'
      width='183px'
      height='476px'
      {...props}
    >
      <Text margin='20px 0 8px' fontSize='20px' textAlign='center'>
        攻击顺序
      </Text>
      <Flex
        position='relative'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        {/* <ReactSortable
          onEnd={() => {
            handleUpdate();
          }}
          list={sortSoldiers}
          setList={setState}
        > */}
        {sortSoldiers.map((item, index) => (
          <ItemBox
            key={item.id}
            draggable
            data-index={index}
            onDragStart={dragStart}
            onDragEnter={dragEnter}
          >
            <SortItem
              isActive={activeSoldier === item.soldier}
              id={`${item.id}`}
              src={item.src}
            />
          </ItemBox>
        ))}
        {/* </ReactSortable> */}
      </Flex>
    </BorderCard>
  );
};

export default SortBoard;
