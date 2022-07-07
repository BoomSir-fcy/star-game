import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
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

import { getHideFooter, getHideHeader } from './config';
import HandleButtonGroup from './HandleButtonGroup';

interface ScaleProps {
  scale: number;
  index: boolean;
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
  transform-origin: top right;
  ${({ index }) => index && `z-index: 99;`}
`;

const FlexLeftTop = styled(Flex)<ScaleProps>`
  position: fixed;
  transform: ${({ scale }) => `scale(${scale})`};
  left: 0;
  transform-origin: top left;
  ${({ index }) => index && `z-index: 99;`}
`;

const BoxRightBottom = styled(Box)<ScaleProps>`
  position: fixed;
  right: 0;
  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: bottom right;
  bottom: 15px;
  ${({ index }) => index && `z-index: 99;`}
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
  const navigate = useNavigate();

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
  const zIndex = useStore(p => p.userInfo.zIndex);

  const hideHeader = useMemo(() => {
    return getHideHeader(location.pathname) || params?.hide;
  }, [location.pathname, params]);

  const hideFooter = useMemo(() => {
    return getHideFooter(location.pathname) || params?.hide;
  }, [location.pathname, params]);

  const onBackClick = React.useCallback(() => {
    if (hideFooter) {
      navigate('/star/planet');
    }
  }, [hideFooter, navigate]);
  return (
    <>
      {!hideHeader && (
        <>
          <FlexLeftTop scale={scale} index={zIndex}>
            <Avatar />
            <TokenInfo />
          </FlexLeftTop>
          <BoxRightTop scale={scale} index={zIndex}>
            <HandleButtonGroup
              onRefresh={onRefreshClick}
              onBack={onBackClick}
            />
          </BoxRightTop>
          {!hideFooter && (
            <BoxRightBottom scale={scale} index={zIndex}>
              <ButtonGroup />
            </BoxRightBottom>
          )}

          {/* <FlexStyled scale={scale}>
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
          </FlexStyled> */}
        </>
      )}
    </>
  );
};

export default Dashboard;
