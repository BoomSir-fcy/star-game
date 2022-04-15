import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Flex, Box, Image } from 'uikit';
import { useDispatch } from 'react-redux';
import {
  fetchUserBalanceAsync,
  fetchUserProductAsync,
} from 'state/userInfo/reducer';
import Avatar from './Avatar';
import Info from './Info';
import { ButtonGroupProps } from './ButtonGroup';

const FlexStyled = styled(Flex)`
  background: url('/images/commons/dashboard/b1.png');
  background-size: 100% 100%;
  width: 100%;
  height: 295px;
`;

const Dashboard: React.FC<ButtonGroupProps> = ({
  onRefresh,
  children,
  className,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserBalanceAsync());
    dispatch(fetchUserProductAsync());
  }, [dispatch]);

  return (
    <FlexStyled>
      <Avatar />
      <Flex flex={1}>
        <Info onRefresh={onRefresh} className={className}>
          {children}
        </Info>
      </Flex>
    </FlexStyled>
  );
};

export default Dashboard;
