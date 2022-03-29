import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Text, BoxProps, Flex } from 'uikit';

const StyledStar = styled.div<StarAddBtnProps>`
  position: relative;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: url('/images/commons/star/add.png') no-repeat;
  background-size: 100%;
  border: 0;
  box-shadow: none;
  cursor: pointer;
  transition: 0.3s;
  z-index: 2;

  &:hover,
  &:active,
  &.star-active {
    background: url('/images/commons/star/add-active.png') no-repeat;
    background-size: 100%;
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    transform: scale(1.1);
  }
`;

const OwnerFlex = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: center;
  width: 134px;
  height: 34px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
  border-radius: ${({ theme }) => theme.radii.tag};
`;

const NumberFlex = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: center;
  width: 134px;
  height: 34px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px 0px 3px 1px rgba(255, 255, 255, 0.35);
  border-radius: ${({ theme }) => theme.radii.tag};
`;

const StarImage = styled.img<StarAddBtnProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: ${({ size }) => `calc(${size} / 1.5)`};
  height: ${({ size }) => `calc(${size} / 1.5)`};
  border-radius: 50%;
  z-index: 1;
  border: ${({ imgBorder, theme }) =>
    imgBorder ? `2px solid ${theme.colors.goldBorder}` : 'none'};
`;
interface StarAddBtnProps extends BoxProps {
  active?: boolean;
  owner?: string;
  No?: number;
  Leve?: string;
  url?: string;
  size?: string;
  imgBorder?: boolean;
}

const StarAddBtn: React.FC<StarAddBtnProps> = ({
  active,
  owner,
  No,
  Leve,
  children,
  url,
  size = '175px',
  imgBorder,
  ...props
}) => {
  const { className, ...restProps } = props;

  return (
    <StyledStar
      className={`${active ? 'star-active' : ''} ${className}`}
      size={size}
      {...restProps}
    >
      {owner && (
        <OwnerFlex>
          <Text small>{owner}</Text>
        </OwnerFlex>
      )}
      {No && (
        <NumberFlex>
          <Text fontSize='20px' shadow='primary'>
            No.{No}
          </Text>
          {Leve && (
            <Text ml='6px' fontSize='20px' shadow='primary'>
              LV {Leve}
            </Text>
          )}
        </NumberFlex>
      )}
      {url && <StarImage imgBorder={imgBorder} size={size} src={url} />}
    </StyledStar>
  );
};
export default StarAddBtn;
