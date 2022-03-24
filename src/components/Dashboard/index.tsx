import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Image } from 'uikit';
import Avatar from './Avatar';
import Info from './Info';

const FlexStyled = styled(Flex)`
  background: url('/images/commons/dashboard/b1.png');
  background-size: 100% 100%;
  width: 100%;
  height: 295px;
`;

const Dashboard = () => {
  return (
    <FlexStyled>
      <Avatar />
      <Flex flex={1}>
        <Info />
      </Flex>
    </FlexStyled>
  );
};

export default Dashboard;
