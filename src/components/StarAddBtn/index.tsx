import Globe from 'components/Globe';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Text, BoxProps, Flex } from 'uikit';
import { QualityColor } from 'uikit/theme/colors';
import { Qualities, qualities } from 'uikit/theme/types';

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
    imgBorder
      ? `2px solid ${theme.colors[imgBorder || qualities.ORDINARY]}}`
      : 'none'};
`;
const GlobeStyled = styled(Globe)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const RemoveIcon = styled.img`
  position: absolute;
  top: 10px;
  right: 18px;
  width: 37px;
  height: 37px;
  /* line-height: 30px; */
  /* text-align: center; */
  /* background: red; */
  /* border-radius: 50%; */
  /* color: red; */
  /* font-size: 60px; */
  z-index: 2;
`;
interface StarAddBtnProps extends BoxProps {
  active?: boolean;
  owner?: string;
  No?: number;
  Leve?: string | number;
  url?: string;
  size?: string;
  imgBorder?: Qualities;
  showIcon?: boolean;
  callBack?: () => void;
  onRemove?: () => void;
  onPlantClick?: () => void;
  name?: string;
  ball?: boolean;
  ballWorking?: boolean;
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
  showIcon,
  callBack,
  onRemove,
  onPlantClick,
  name,
  ball,
  ballWorking,
  ...props
}) => {
  const { className, ...restProps } = props;

  const renderChildren = useMemo(() => {
    if (!url) {
      return null;
    }
    if (url && ball) {
      return (
        <GlobeStyled
          width='150px'
          height='150px'
          shadow={QualityColor[imgBorder]}
          url={url}
          rotate={ballWorking}
          onClick={event => {
            if (onPlantClick) {
              event.stopPropagation();
              onPlantClick();
            }
          }}
        />
      );
    }
    return (
      <StarImage
        onClick={event => {
          if (onPlantClick) {
            event.stopPropagation();
            onPlantClick();
          }
        }}
        imgBorder={imgBorder}
        size={size}
        src={url}
      />
    );
  }, [url, size, imgBorder, ball, ballWorking, onPlantClick]);

  return (
    <StyledStar
      onClick={() => {
        if (callBack) {
          callBack();
        }
      }}
      className={`${active ? 'star-active' : ''} ${className}`}
      size={size}
      {...restProps}
    >
      {showIcon && url && (
        <RemoveIcon
          onClick={e => {
            e.stopPropagation();
            if (onRemove) {
              onRemove();
            }
          }}
          src='/images/commons/icon/remove.png'
          alt=''
        />
      )}
      {owner && (
        <OwnerFlex>
          <Text small>{owner}</Text>
        </OwnerFlex>
      )}
      {No && (
        <>
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
          {name && (
            <Text ml='6px' fontSize='20px' shadow='primary'>
              {name}
            </Text>
          )}
        </>
      )}
      {renderChildren}
    </StyledStar>
  );
};
export default StarAddBtn;
