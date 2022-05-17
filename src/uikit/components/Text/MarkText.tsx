import React, { useEffect, useRef } from "react";
import Text from "./Text";
import { TextProps } from "./types";

const MarkText: React.FC<TextProps> = (props) => {
  return <Text {...props} mark />;
};

export default MarkText;
