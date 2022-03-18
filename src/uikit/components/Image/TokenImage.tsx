import styled from "styled-components";
import Image from "./Image";
import Logo from "./Logo";

const TokenImage = styled(Logo)<{shadow?: boolean}>`
  overflow: hidden;
  &:before {
    border-radius: 50%;
    /* border: 1px solid rgba(0, 0, 0, 0.25); */
    box-shadow: ${({ shadow }) => shadow ? '0px 0px 5px 0px rgba(25, 95, 81, 0.5)' : 'none' };
    transform: scale(0.92);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 7;
  }
`;

export default TokenImage;
