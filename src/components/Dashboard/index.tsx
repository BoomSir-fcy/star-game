import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Flex, BgCard, Image, TweenText } from 'uikit';

import eventBus from 'utils/eventBus';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';

import {
  fetchUserBalanceAsync,
  fetchUserProductAsync,
} from 'state/userInfo/reducer';
import useParsedQueryString from 'hooks/useParsedQueryString';
import Avatar from './Avatar';
import Info from './Info';
import { ButtonGroupProps } from './ButtonGroup';

import { getHideHeader } from './config';

const FlexStyled = styled(Flex)`
  background: url('/images/commons/dashboard/b1.png');
  background-size: 100% 100%;
  width: 100%;
  height: 295px;
  margin-bottom: 30px;
`;

const Dashboard: React.FC<ButtonGroupProps> = ({
  onRefresh,
  children,
  className,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const params = useParsedQueryString();

  const onRefreshClick = () => {
    eventBus.dispatchEvent(new MessageEvent('onRefresh'));
  };

  useEffect(() => {
    dispatch(fetchUserBalanceAsync());
    dispatch(fetchUserProductAsync());
  }, [dispatch]);

  const Product = useStore(p => p.userInfo.userProduct);

  const hideHeader = useMemo(() => {
    return getHideHeader(location.pathname) || params?.hide;
  }, [location.pathname, params]);

  return (
    <>
      {!hideHeader && (
        <FlexStyled>
          <Avatar />
          <Flex flex={1}>
            <Info onRefresh={() => onRefreshClick()} className={className}>
              {location.pathname === '/mystery-box' && !Product.planet_num && (
                <BgCard variant='short'>
                  <Flex alignItems='center' height='100%' width='100%'>
                    <TweenText
                      width='100%'
                      textAlign='center'
                      fontSize='22px'
                      to={t(
                        "You don't have a planet yet, please acquire a planet to start your Galaxy journey",
                      )}
                      shadow='primary'
                    />
                  </Flex>
                </BgCard>
              )}
              {children}
            </Info>
          </Flex>
        </FlexStyled>
      )}
    </>
  );
};

export default Dashboard;
