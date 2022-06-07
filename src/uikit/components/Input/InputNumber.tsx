import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Flex, Text, FlexProps } from 'uikit';

const Btn = styled(Button)`
  width: 36px;
  height: 36px;
  padding: 0;
  align-items: flex-start;
  border: 1px solid #25babe;
  border-radius: 10px;
`;

interface InputNumberProps extends FlexProps {
  max?: number;
  value?: number;
  onChangeNum?: (v: number) => void;
}
const InputNumber: React.FC<InputNumberProps> = ({
  max,
  value,
  onChangeNum,
}) => {
  const [val, setVal] = useState(value || 1);

  useEffect(() => {
    if (value) setVal(value);
  }, [value]);

  const handleAdd = useCallback(() => {
    if (val >= max) return;
    setVal(p => p + 1);
    if (onChangeNum) onChangeNum(val + 1);
  }, [val, max, onChangeNum]);

  const handleSub = useCallback(() => {
    if (val <= 1) return;
    setVal(p => p - 1);
    if (onChangeNum) onChangeNum(val - 1);
  }, [val, onChangeNum]);
  return (
    <Flex width='147px' justifyContent='space-between' alignItems='center'>
      <Btn onClick={handleAdd}>+</Btn>
      <Text>{val}</Text>
      <Btn onClick={handleSub}>-</Btn>
    </Flex>
  );
};

export default InputNumber;
