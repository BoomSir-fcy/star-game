import styled from 'styled-components';
import { Colors } from '../../theme/types';
import { Box } from '../Box';

export const Divider = styled(Box)<{ color?: string }>`
  background-color: ${({ theme, color }) =>
    (theme.colors[color as keyof Colors] || color) ?? theme.colors.border};
  height: 1px;
`;
