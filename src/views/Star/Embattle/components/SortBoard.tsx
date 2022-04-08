import React, { forwardRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Box, Text, BoxProps, BorderCard, BorderCardProps } from 'uikit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import AsanySortable, { SortableItemProps } from '@asany/sortable';
import client from 'utils/client';
import { Container } from './styled';

interface SortBoardProps extends BorderCardProps {
  list?: any[];
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
        <Text>{data.id}</Text>
      </BorderCard>
    </li>
  );
});

const SortBoard: React.FC<SortBoardProps> = ({ ...props }) => {
  const handleChange = useCallback((data, event) => {
    console.log(data, event);
  }, []);

  const items = useMemo(() => {
    return [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '8',
      },
      {
        id: '9',
      },
      {
        id: '21',
      },
    ];
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
          items={items}
          layout='list'
          onChange={handleChange}
          itemRender={SortItem}
        />
      </DndProvider>
    </BorderCard>
  );
};

export default SortBoard;
