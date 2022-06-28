import React, { useState } from 'react';
import { useGalaxyList } from 'state/galaxy/hooks';
import { Text, Flex, Box } from 'uikit';
import { ItemGalaxyBox } from 'views/NewGalaxy/style';

const ItemGalaxy: React.FC = () => {
  return (
    <ItemGalaxyBox width={300} height={300}>
      123
    </ItemGalaxyBox>
  );
};

export default ItemGalaxy;
