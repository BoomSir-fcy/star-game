import styled from 'styled-components';
import { Box } from 'uikit';

export const AvatarBox = styled(Box)`
  position: relative;
  width: 241px;
  height: 236px;
`;
const positionCenter = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;

export const AvatarBorder = styled.img<{ active?: boolean }>`
  width: ${({ active }) => (active ? '100%' : '203px')};
  height: ${({ active }) => (active ? '100%' : '199px')};
  /* background: url('/images/login/a-b-man.png'); */
  ${positionCenter}
  z-index: 2;
  cursor: pointer;
`;

export const AvatarImage = styled.img<{ active?: boolean }>`
  width: ${({ active }) => (active ? '100%' : '200px')};
  height: ${({ active }) => (active ? '100%' : '200px')};
  ${positionCenter}
  z-index: 1;
`;
