import { createGlobalStyle } from 'styled-components';
import { mediaQueries } from './theme/base';

const ResetCSS = createGlobalStyle`
  /* prettier-ignore */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  /* prettier-ignore */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
    font-size: 16px;
  }
  body{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
  }
  body, html, #root, #detect-orient{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  body {
    overflow: hidden;
  }
  img{
    width: 100%;
    height: auto;
  }
  ol,
  ul {
    list-style: disc;
    list-style-position: inside;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  [role="button"] {
    cursor: pointer;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  * {
    font-family: 'SourceHanSansCN', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Number */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSubtle}; 
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px ${({ theme }) => theme.colors.input}; 
    border-radius: 10px;
  }

  /* Slider */ 
  input[type=range] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  input[type=range]:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }
  input[type=range]::-ms-track {
    width: 100%;
    cursor: pointer;
    /* Hides the slider so custom styles can be added */
    background: transparent; 
    border-color: transparent;
    color: transparent;
  }
  .show-media-lg {
    display: none;
    ${mediaQueries.lg} {
      display: block;
    }
  }
  .show-media-md {
    display: none;
    ${mediaQueries.md} {
      display: block;
    }
  }
  .show-media-nav {
    display: none;
    ${mediaQueries.nav} {
      display: block;
    }
  }
  .show-media-sm {
    display: none;
    ${mediaQueries.sm} {
      display: block;
    }
  }
  .show-media-xl {
    display: none;
    ${mediaQueries.xl} {
      display: block;
    }
  }
  .show-media-xs {
    display: none;
    ${mediaQueries.xs} {
      display: block;
    }
  }
  .hide-media-lg {
    display: block;
    ${mediaQueries.lg} {
      display: none;
    }
  }
  .hide-media-md {
    display: block;
    ${mediaQueries.md} {
      display: none;
    }
  }
  .hide-media-nav {
    display: block;
    ${mediaQueries.nav} {
      display: none;
    }
  }
  .hide-media-sm {
    display: block;
    ${mediaQueries.sm} {
      display: none;
    }
  }
  .hide-media-xl {
    display: block;
    ${mediaQueries.xl} {
      display: none;
    }
  }
  .hide-media-xs {
    display: block;
    ${mediaQueries.xs} {
      display: none;
    }
  }

  /* 引导页 */

  .introjs-tooltip {
    position: absolute;
    padding: 20px 30px;
    color: #fff;
    background-color: transparent !important;
    background-image: url('/images/commons/introjs-mask.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    max-width: 237px !important;
    max-height: 163px !important;
    width: 237px !important;
    height: 163px !important;
    ${mediaQueries.sm} {
      max-width: 285px !important;
      max-height: 196px !important;
      width: 285px !important;
      height: 196px !important;
    }
    ${mediaQueries.md} {
      max-width: 380px !important;
      max-height: 261px !important;
      width: 380px !important;
      height: 261px !important;
    }
    ${mediaQueries.xxl} {
      max-width: 475px !important;
      max-height: 327px !important;
      width: 475px !important;
      height: 327px !important;
    }
  }

  .introjs-tooltip-header {
    position: relative;
    padding: 0 !important;
    bottom: 8px;
    right: 1px;
  }

  .introjs-skipbutton {
    width: 43px;
    height: 43px;
    padding: 0 !important;
    background-image: url('/images/commons/introjs-close.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: transparent !important;
    width: 20px;
    height: 20px;
    margin-top: -3px;
    margin-right: -11px;
    ${mediaQueries.sm} {
      width: 25px;
      height: 25px;
      margin-right: -10px;
    }
    ${mediaQueries.md} {
      width: 34px;
      height: 34px;
      margin-right: -5px;
    }
    ${mediaQueries.xxl} {
      margin-right: 2px;
      width: 43px;
      height: 43px;
    }
  }
  
  .introjs-tooltip .introjs-tooltiptext {

    min-height: 90px;
    max-height: 90px;
    line-height: 1.5;
    font-size: 14px;
    padding: 4px;
    ${mediaQueries.sm} {
      min-height: 86px;
      max-height: 86px;
      font-size: 14px;
      padding: 8px;
    }
    ${mediaQueries.md} {
      min-height: 128px;
      max-height: 128px;
      font-size: 14px;
      padding: 12px;
    }
    ${mediaQueries.xxl} {
    font-weight: bold;

      min-height: 180px;
      max-height: 180px;
      font-size: 16px;
      padding: 20px;
    }
  }

  .introjs-tooltip .introjs-bullets {
    padding: 5px;
    ${mediaQueries.sm} {
      padding: 6px;


    }
    ${mediaQueries.md} {
      padding: 8px;


    }
    ${mediaQueries.xxl} {
      padding: 10px;
    
    }
  }
  .introjs-helperLayer {
    position: absolute;
    z-index: 9999998;
    border: 3px solid #FFFFFF;
    border-radius: 10px !important;
    pointer-events: none;
  }

  .introjs-tooltip .introjs-tooltipbuttons {
    border-top: 0 !important;
    padding: 5px;
    ${mediaQueries.sm} {
      padding: 6px;


    }
    ${mediaQueries.md} {
      padding: 8px;


    }
    ${mediaQueries.xxl} {
      padding: 10px;
    
    }
  }

  .introjs-arrow {
    opacity: 0 !important;
  }
  
  .introjs-button {
    display: flex !important;
    justify-content: center;
    align-items: center;
    width: 137px;
    height: 50px;
    font-weight: bold;
    color: #000000;
    padding: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
    background-color: transparent !important;
    background-image: url('/images/commons/btn/enter.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    width: 68px;
    height: 25px;
    ${mediaQueries.sm} {
      width: 82px;
    height: 30px;

    }
    ${mediaQueries.md} {
      width: 109px;
    height: 40px;

    }
    ${mediaQueries.xxl} {
      width: 137px;
    height: 50px;
    
    }
  }
  .introjs-disabled {
    background-image: url('/images/commons/btn/enter.png') !important;
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
`;

export default ResetCSS;
