import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Flex, Box, Image, TweenText } from 'uikit';

import eventBus from 'utils/eventBus';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useFetchUserBalance, useFetchUserProduct } from 'state/userInfo/hooks';
import Avatar from './Avatar';
import Info from './Info';
import TokenInfo from './TokenInfo';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';

import { getHideHeader } from './config';
import HandleButtonGroup from './HandleButtonGroup';

interface ScaleProps {
  scale: number;
}
const FlexStyled = styled(Flex)<ScaleProps>`
  /* background: url('/images/commons/dashboard/b1.png'); */
  background-size: 100% 100%;
  width: 100%;
  height: 295px;
  margin-bottom: 30px;
  transform: ${({ scale }) => `scale(${scale})`};
`;

const BoxRightTop = styled(Box)<ScaleProps>`
  position: fixed;
  top: 15px;
  right: 0;
  transform: ${({ scale }) => `scale(${scale})`};
  z-index: 99;
  transform-origin: top right;
`;

const FlexLeftTop = styled(Flex)<ScaleProps>`
  position: fixed;
  transform: ${({ scale }) => `scale(${scale})`};
  left: 0;
  transform-origin: top left;
  z-index: 99;
`;

const BoxRightBottom = styled(Box)<ScaleProps>`
  position: fixed;
  right: 0;
  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: bottom right;
  bottom: 15px;
  z-index: 99;
`;

interface DashboardProps extends ButtonGroupProps {
  scale: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  onRefresh,
  children,
  className,
  scale,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const params = useParsedQueryString();

  const { fetch: FetchBlance } = useFetchUserBalance();
  const { fetch: FetchProduct } = useFetchUserProduct();

  const onRefreshClick = () => {
    eventBus.dispatchEvent(new MessageEvent('onRefresh'));
  };

  // useEffect(() => {
  //   FetchBlance();
  //   FetchProduct();
  // }, [location.pathname, FetchBlance, FetchProduct]);

  const Product = useStore(p => p.userInfo.userProduct);

  const hideHeader = useMemo(() => {
    return getHideHeader(location.pathname) || params?.hide;
  }, [location.pathname, params]);

  return (
    <>
      {!hideHeader && (
        <>
          <FlexLeftTop scale={scale}>
            <Avatar />
            <TokenInfo />
          </FlexLeftTop>
          <BoxRightTop scale={scale}>
            <HandleButtonGroup />
          </BoxRightTop>
          <BoxRightBottom scale={scale}>
            <ButtonGroup />
          </BoxRightBottom>
          <FlexStyled scale={scale}>
            {/* <Flex flex={1}>
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
            </Flex> */}
          </FlexStyled>
        </>
      )}
    </>
  );
};

export default Dashboard;
