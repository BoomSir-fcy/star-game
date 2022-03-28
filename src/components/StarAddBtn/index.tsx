import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Text, BoxProps, ImageButtton, Flex } from 'uikit';

const StyledStar = styled(ImageButtton)<StarAddBtnProps>`
  position: relative;
  width: 157px;
  height: 157px;
  background: url('/images/commons/star/add.png');
  background-size: 100%;
  border: 0;
  box-shadow: none;
  transition: 0.3s;

  &:hover,
  &:active,
  &.star-active {
    background: url('/images/commons/star/add-active.png');
    background-size: 100%;
    width: 157px;
    height: 157px;
  }
`;

const OwnerFlex = styled(Flex)`
  position: absolute;
  bottom: 0;
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
  justify-content: center;
  align-items: center;
  width: 134px;
  height: 34px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px 0px 3px 1px rgba(255, 255, 255, 0.35);
  border-radius: ${({ theme }) => theme.radii.tag};
`;

interface StarAddBtnProps extends BoxProps {
  active?: boolean;
  owner?: string;
  No?: number;
  Leve?: string;
}

const StarAddBtn: React.FC<StarAddBtnProps> = ({
  active,
  owner,
  No,
  Leve,
  children,
  ...props
}) => {
  return (
    <StyledStar className={active ? 'star-active' : ''} {...props}>
      {owner && (
        <OwnerFlex>
          <Text small>{owner}</Text>
        </OwnerFlex>
      )}
      {children}
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
    </StyledStar>
  );
};
export default StarAddBtn;
