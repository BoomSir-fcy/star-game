import React from 'react';
import styled, { DefaultTheme, keyframes } from 'styled-components';
import getThemeValue from 'uikit/util/getThemeValue';
import Svg from '../Svg';
import { SvgProps } from '../types';

const Icon: React.FC<SvgProps> = props => {
  return (
    <Svg viewBox='0 0 100 100' {...props}>
      <path
        className='stroke dur1'
        d='M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z'
      />
      <path
        className='stroke dur2'
        d='M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
  c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z'
      />
      <path
        className='stroke dur3'
        d='M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
  L82,35.7z'
      />
    </Svg>
  );
};

interface ThemedProps extends SvgProps {
  theme: DefaultTheme;
}
const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme);
};

const rotate = keyframes`
  from { transform: rotate(0); } to { transform: rotate(360deg); }
`;
const rotate1 = keyframes`
  from { transform: rotate(360deg); } to { transform: rotate(0deg); }
`;

export default styled(Icon)`
  .stroke {
    fill: ${getColor};
  }
  .dur1 {
    transform-origin: center;
    animation: 2s linear infinite ${rotate};
  }
  .dur2 {
    transform-origin: center;
    animation: 1s linear infinite ${rotate};
  }
  .dur3 {
    transform-origin: center;
    animation: 1.5s linear infinite ${rotate1};
  }
`;
