import { createGlobalStyle } from "styled-components";
import { mediaQueries } from "./theme/base";

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
`;

export default ResetCSS;
