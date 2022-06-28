import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import Text from '../Text/Text';
import bunnyHeadMain from './svg/bunnyhead-main.svg';
import bunnyHeadMax from './svg/bunnyhead-max.svg';
import bunnyButt from './svg/bunnybutt.svg';
import bunnyHead from './svg/dinosaur-head.png';
import bunnyButt1 from './svg/dinosaur-butt.png';

interface SliderLabelProps {
  progress: string;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean;
}

interface DisabledProp {
  disabled?: boolean;
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? 'not-allowed' : 'cursor';
};

const getBaseThumbStyles = ({ isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  // background-image: url(${bunnyHead});
  // background-size: 32px;
  // background-image: url(${isMax ? bunnyHeadMax : bunnyHeadMain});
  // background-color: transparent;
  cursor: ${getCursorStyle};
  width: 18px;
  height: 18px;
  background: #4FFFFB;
  border-radius: 50%;
  filter: ${disabled ? 'grayscale(100%)' : 'none'};
  // transform: translate(-2px, -2px);
  transition: 200ms transform;

  &:hover {
    transform: ${
      disabled ? 'scale(1) translate(0px, 0px)' : 'scale(1) translate(0px, 0px)'
    };
  }
`;

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`;

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`;

export const BunnyButt = styled.div<DisabledProp>`
  background: url(${bunnyButt1}) no-repeat;
  background-size: 32px;
  height: 32px;
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  position: absolute;
  width: 32px;
  left: -6px;
  top: 12px;
  z-index: 9;
`;

export const BunnySlider = styled.div`
  position: relative;
  width: 100%;
  bottom: 15px;
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 18px;
  position: relative;
  top: 10px;
  ::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }

  ::-moz-range-thumb {
    ${getBaseThumbStyles}
  }

  ::-ms-thumb {
    ${getBaseThumbStyles}
  }
`;

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) =>
    theme.colors[disabled ? 'textDisabled' : 'progressSliderBackground']};
  height: 8px;
  position: absolute;
  top: 18px;
  width: 100%;
  border-radius: 3px;
`;

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.progressGreenBar};
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  height: 8px;
  position: absolute;
  top: 18px;
  border-radius: 3px;
`;
