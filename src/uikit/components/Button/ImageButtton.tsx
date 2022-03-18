
import styled from "styled-components";
import Button from "./Button";
import { BaseButtonProps, PolymorphicComponent } from "./types";

const ImageButtton: PolymorphicComponent<BaseButtonProps, "button"> = styled(Button)<BaseButtonProps>`
  padding: 0;
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  background: none;
`;

export default ImageButtton;
