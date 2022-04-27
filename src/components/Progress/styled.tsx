import styled from 'styled-components';
import { layout, LayoutProps } from 'styled-system';
import { BarProps } from './types';

export const Progressbar = styled.div`
  position: relative;
  display: block;
  /* width: 560px; */
  height: 20px;
  /* padding: 10px 20px; */
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  box-shadow: 0px 4px 4px -4px rgba(255, 255, 255, 0.4),
    0px -3px 3px -3px rgba(255, 255, 255, 0.25),
    inset 0px 0px 12px 0px rgba(0, 0, 0, 0.5);
  /* overflow: hidden; */
  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 18px;
    /* top: 10px; */
    /* left: 20px; */
    border-radius: 20px;
    background: #222;
    box-shadow: inset 0px 0px 6px 0px rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(0, 0, 0, 0.8);
  }
`;

export const Bar = styled.div<BarProps>`
  position: absolute;
  display: block;
  width: 0px;
  height: 16px;
  /* top: 12px; */
  /* left: 22px; */
  overflow: hidden;
  background: rgb(232, 25, 87);
  ${layout}

  background: linear-gradient(
    to bottom,
    rgba(232, 25, 87, 1) 0%,
    rgba(170, 0, 51, 1) 100%
  );
  border-radius: 16px;
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e81957', endColorstr='#aa0033',GradientType=0 );

  box-shadow: 0px 0px 12px 0px rgba(232, 25, 87, 1),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.45),
    inset 1px 0px 0px 0px rgba(255, 255, 255, 0.25),
    inset -1px 0px 0px 0px rgba(255, 255, 255, 0.25);

  &::before {
    position: absolute;
    display: block;
    content: '';
    width: 565px;
    height: 150%;
    top: -25%;
    left: -25px;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.01) 50%,
      rgba(255, 255, 255, 0) 51%,
      rgba(255, 255, 255, 0) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#59ffffff', endColorstr='#00ffffff',GradientType=1 );
  }

  &::after {
    position: absolute;
    display: block;
    content: '';
    width: 64px;
    height: 16px;
    right: 0;
    top: 0;
    border-radius: 0px 16px 16px 0px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 98%,
      rgba(255, 255, 255, 0) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#00ffffff',GradientType=1 );
  }
`;
