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
