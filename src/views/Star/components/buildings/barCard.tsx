import React from 'react';
import styled from 'styled-components';
import { Flex, Box, MarkText } from 'uikit';

const RecordBox = styled(Flex)`
  width: 200px;
  height: 58px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
`;

export const BarCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ title, children, onClick }) => {
  return (
    <RecordBox onClick={onClick}>
      <MarkText ml='24px' mt='10px' fontSize='16px' bold fontStyle='normal'>
        {title}
      </MarkText>
      {children}
    </RecordBox>
  );
};
