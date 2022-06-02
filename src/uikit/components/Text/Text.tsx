import styled, { DefaultTheme } from 'styled-components';
import { space, typography, layout } from 'styled-system';
import getThemeValue from '../../util/getThemeValue';
import { TextProps } from './types';

interface ThemedProps extends TextProps {
  theme: DefaultTheme;
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme);
};

const getTextShadows = ({ shadow, theme }: ThemedProps) => {
  return getThemeValue(`textShadows.${shadow}`, shadow)(theme);
};

const getFontSize = ({ fontSize, small }: TextProps) => {
  return small ? '20px' : fontSize || '28px';
};

const Text = styled.div<TextProps>`
  ${({ mark }) =>
    mark
      ? `
      font-weight: bold;
      font-style: italic;

      color: #ffffff;
      text-shadow: 0px 3px 0.4em #79c6c4;

      background: linear-gradient(
        0deg,
        rgba(79, 255, 251, 1) 0%,
        rgba(255, 255, 255, 1) 60.4873046875%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `
      : ''};

  ${({ vip }) =>
    vip
      ? `
      font-weight: bold;
      font-style: italic;

      color: #ffffff;
      text-shadow: 0px 3px 0.4em #79c6c4;

      background: linear-gradient(130deg, #FBEEBA 0%, #F1D37E 14.990234375%, #D1AB64 33.0078125%, #D5C089 48.9990234375%, #D5BF86 66.9921875%, #F4D784 84.0087890625%, #FBEEBA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `
      : ''};
  color: ${getColor};
  text-shadow: ${getTextShadows};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  font-family: ${({ bold }) =>
    bold ? 'SourceHanSansCN-Bold' : 'SourceHanSansCN'};
  line-height: 1.5;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis, maxLine }) =>
    (ellipsis || maxLine) &&
    (maxLine
      ? `
      overflow: hidden;
      display:-webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:${maxLine};
      `
      : `white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;`)}

  ${space}
  ${typography}
  ${layout}
`;

Text.defaultProps = {
  color: 'text',
  small: false,
  ellipsis: false,
};

export default Text;
