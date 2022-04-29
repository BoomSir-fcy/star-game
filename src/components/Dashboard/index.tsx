import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Flex, Box, Image } from 'uikit';

import {
  fetchUserBalanceAsync,
  fetchUserProductAsync,
} from 'state/userInfo/reducer';
import Avatar from './Avatar';
import Info from './Info';
import { ButtonGroupProps } from './ButtonGroup';

import { getHideHeader } from './config';

const FlexStyled = styled(Flex)`
  background: url('/images/commons/dashboard/b1.png');
  background-size: 100% 100%;
  width: 100%;
  height: 295px;
  + div {
    top: calc(50% + 295px);
  }
`;

const Dashboard: React.FC<ButtonGroupProps> = ({
  onRefresh,
  children,
  className,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUserBalanceAsync());
    dispatch(fetchUserProductAsync());
  }, [dispatch]);

  return (
    <>
      {!getHideHeader(location.pathname) && (
        <FlexStyled>
          <Avatar />
          <Flex flex={1}>
            <Info onRefresh={onRefresh} className={className}>
              {children}
            </Info>
          </Flex>
        </FlexStyled>
      )}
    </>
  );
};

export default Dashboard;
