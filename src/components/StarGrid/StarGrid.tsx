import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text } from 'uikit';

const Container = styled(Flex)`
  width: 476px;
  height: 476px;
  justify-content: center;
  align-self: auto;
  flex-wrap: wrap;
  border: 1px solid #fff;
`;

const Normal = styled(Flex)<{ row: number }>`
  justify-content: center;
  align-items: center;
  width: ${({ row }) => row * 158}px;
  height: ${({ row }) => row * 158}px;
  border: 1px solid #fff;
  transition: all 0.5s;
`;

export const StarGrid: React.FC<any> = React.memo(props => {
  const { items, onLayoutChange } = props;
  const [state, setState] = useState({
    data: props.data,
    target: {} as any,
    dragged: {} as any,
  });
  const { data } = state;

  const handleData = (target: any) => {
    state.dragged.style.opacity = '1';
    state.dragged.style.transform = 'scale(1)';
    const from = state.dragged?.dataset?.id;
    const to = target?.dataset?.id;
    const listData = data;

    console.log(from, to);
    if (from !== to) {
      listData.splice(to, 0, listData.splice(from, 1)[0]);
      // [listData[from], listData[to]] = [listData[to], listData[from]];
      setState({
        ...state,
        target,
        data: listData,
        dragged: target,
      });
    }
  };

  const dragStart = (e: React.MouseEvent) => {
    setState({
      ...state,
      dragged: e.target,
    });
  };

  const dragEnd = () => {
    state.dragged.style.opacity = '1';
    state.dragged.style.transform = 'scale(1)';
  };

  const drop = (e: React.MouseEvent) => {
    e.preventDefault();
    state.dragged.style.opacity = '1';
    state.dragged.style.transform = 'scale(1)';
  };

  const dragOver = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const dragEnter = (event: any) => {
    event.preventDefault();
    const targetBox = event.target;
    targetBox.style.opacity = '0.6';
    targetBox.style.transform = 'scale(1.1)';
    handleData(targetBox);
  };

  return (
    <Container>
      {state.data.map((item: any, index: number) => {
        return (
          <Normal
            data-id={index}
            key={`${item.index}`}
            row={item.row}
            style={{ background: item.bgColor }}
            draggable='true'
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            onDragEnter={dragEnter}
            onDragOver={dragOver}
            onDrop={drop}
            data-item={JSON.stringify(item)}
          >
            {item.index}
          </Normal>
        );
      })}
    </Container>
  );
});
