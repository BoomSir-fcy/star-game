import { PlanetBall } from 'components';
import Globe from 'components/Globe';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Text, BoxProps, Flex, MarkText, Box } from 'uikit';
import { QualityColor } from 'uikit/theme/colors';
import { Qualities, qualities } from 'uikit/theme/types';

const StyledStar = styled.div<StarAddBtnProps>`
  position: relative;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: ${({ Leve }) =>
    Leve ? 'none' : `url('/images/commons/star/add.png') no-repeat`};
  background-size: 100%;
  border: 0;
  box-shadow: none;
  cursor: pointer;
  transition: 0.3s;
  z-index: 2;

  &:hover,
  &:active,
  &.star-active {
    background: ${({ Leve }) =>
      Leve ? 'none' : `url('/images/commons/star/add-active.png') no-repeat`};
    background-size: 100%;
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    transform: scale(1.1);
  }
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
const GlobeStyled = styled(PlanetBall)`
  margin: 0 auto;
`;

const LeveBox = styled(Flex)`
  position: absolute;
  z-index: 1;
  top: -10px;
  justify-content: center;
  width: 100%;
`;

const PowerBox = styled(Flex)`
  position: absolute;
  z-index: 1;
  top: 70px;
  justify-content: center;
  width: 100%;
`;

const MaskBox = styled(Flex)<{ height: string; width: string }>`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 50%;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  justify-content: center;
  align-items: center;
`;

interface StarAddBtnProps extends BoxProps {
  active?: boolean;
  owner?: string;
  No?: number;
  Leve?: string | number;
  url?: string;
  size?: string;
  width_height?: string;
  imgBorder?: Qualities;
  showIcon?: boolean;
  callBack?: () => void;
  onPlantClick?: () => void;
  name?: string;
  ball?: boolean;
  ballWorking?: boolean;
  resources?: boolean;
  resourcesText?: string;
  showPower?: boolean;
  power?: number;
}

const LeagueStarAddBtn: React.FC<StarAddBtnProps> = ({
  active,
  owner,
  No,
  Leve,
  children,
  url,
  size = '175px',
  width_height = '120px',
  imgBorder,
  showIcon,
  callBack,
  onPlantClick,
  name,
  ball,
  ballWorking,
  resources,
  resourcesText,
  showPower,
  power,
  ...props
}) => {
  const { className, ...restProps } = props;

  const renderChildren = useMemo(() => {
    if (!url) {
      return null;
    }
    if (url && ball) {
      return (
        <Flex height='100%' justifyContent='center' alignItems='center'>
          <GlobeStyled
            width={width_height}
            height={width_height}
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
        </Flex>
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
  }, [width_height, url, size, imgBorder, ball, ballWorking, onPlantClick]);

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
      {resources && (
        <MaskBox height={width_height} width={width_height}>
          <MarkText fontStyle='normal' fontSize='16px' bold>
            {resourcesText}
          </MarkText>
        </MaskBox>
      )}
      {Leve && (
        <LeveBox>
          <MarkText fontStyle='normal' fontSize='20px' bold>
            LV {Leve}
          </MarkText>
        </LeveBox>
      )}
      {showPower && (
        <PowerBox>
          <Flex
            alignItems='center'
            width='max-content'
            background='rgb(0 0 0 / 50%)'
            padding='0 10px'
            borderRadius='10px'
          >
            <Text fontSize='18px' mr='10px'>
              Power
            </Text>
            <MarkText fontStyle='normal' fontSize='20px' bold>
              {power}
            </MarkText>
          </Flex>
        </PowerBox>
      )}
      {renderChildren}
    </StyledStar>
  );
};
export default LeagueStarAddBtn;
