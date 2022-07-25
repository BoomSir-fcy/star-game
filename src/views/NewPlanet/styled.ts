import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Flex } from 'uikit';

export const DragBox = styled(Flex)`
  width: 100%;
  height: 940px;
  align-items: flex-end;
  justify-content: space-between;
`;
export const PlanetBox = styled(Box)`
  position: relative;
  width: 1500px;
  height: calc(100% - 200px);
`;
export const AllianceBox = styled(Box)`
  width: calc(100% - 1500px - 30px);
  height: calc(100% - 170px);
  margin-bottom: 80px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  padding: 16px 20px;
`;
export const SearchBox = styled(Box)`
  position: absolute;
  right: 0;
  top: -70px;
`;

export const LinkStyled = styled(Link)`
  :hover {
    text-decoration: underline;
    text-decoration-color: #fff;
  }
`;
