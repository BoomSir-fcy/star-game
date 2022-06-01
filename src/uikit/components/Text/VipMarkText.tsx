import React, { useEffect, useRef } from 'react';
import Text from './Text';
import { TextProps } from './types';

const VipMark: React.FC<TextProps> = props => {
  return <Text {...props} vip />;
};

export default VipMark;
