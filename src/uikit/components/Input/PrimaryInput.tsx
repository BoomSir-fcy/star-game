import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { LayoutProps, layout, space } from 'styled-system';
import Input from './Input';
import { InputProps } from './types';

const Wrapper = styled.div<LayoutProps>`
  display: inline-block;
  background: linear-gradient(-29deg, #14f1fd, #1caaf4);
  border-radius: 10px;
  padding: 2px;
  ${layout}
  ${space}
`;

const InputStyled = styled(Input)`
  width: 100%;
  height: 100%;
  /* border: 2px solid transparent; */
  box-shadow: ${({ theme }) => theme.shadows.primary};
  border-radius: 10px;
  padding-left: 34px;
  font-size: 20px;
`;
interface PrimaryInputProps
  extends InputProps,
    React.InputHTMLAttributes<HTMLInputElement> {}
const PrimaryInput: React.FC<PrimaryInputProps> = ({ ...props }) => {
  return (
    <Wrapper {...props}>
      <InputStyled {...props} />
    </Wrapper>
  );
};

export default PrimaryInput;
