import styled from 'styled-components';
import { Box } from 'uikit';

export const AvatarBox = styled(Box)<{ width?: string; height?: string }>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 10px;
  flex-shrink: 0;
`;

export const AvatarImage = styled.img<{ width?: string; height?: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 10px;
`;
