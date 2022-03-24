import { HTMLAttributes } from "react";
import { SpaceProps } from "styled-system";

export interface NavConfig {
  label: string;
  id: string|number;
  path?: string;
  [key: string]: any;
}

export interface NavProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  nav?: NavConfig[]
  activeId?: number|string
  onChangeNav?: (config: NavConfig) => void
}
