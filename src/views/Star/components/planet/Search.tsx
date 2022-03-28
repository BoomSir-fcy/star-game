import React from 'react';
import styled from 'styled-components';
import { Flex, Text, Input } from 'uikit';

const SearchInput = styled(Input)`
  width: 510px;
  height: 55px;
  padding-left: 50px;
  font-size: 24px;
  background: ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${({ theme }) => theme.radii.card};
`;
export const PlanetSearch = () => {
  return (
    <form>
      <Flex width='100%' justifyContent='center' alignItems='center'>
        <Text mr='27px'>Token</Text>
        <SearchInput placeholder='输入星球token搜索' />
      </Flex>
    </form>
  );
};
