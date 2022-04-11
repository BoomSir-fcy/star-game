import React from 'react';
import { Box, Flex, Button, Text, Image } from 'uikit';
import { useStore } from 'state';
import { Api } from 'apis';

import ModalWrapper from 'components/Modal';
import { GameThing } from '../gameModel';

export const ThingDestoryModal: React.FC<{
  planet_id: number;
  itemData: Api.Building.Building;
  upgrade: any;
  onChange: () => void;
  onClose: () => void;
}> = ({ planet_id, itemData, upgrade, onChange, onClose }) => {
  const visible = useStore(p => p.buildling.destroyBuilding);

  return (
    <ModalWrapper title='摧毁建筑' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex>
          <GameThing src={itemData?.picture} scale='lg' border />
          <Flex ml='23px' justifyContent='space-between' flexDirection='column'>
            <Box>
              <Text shadow='primary' bold>
                矿石建筑
              </Text>
              <Text color='textSubtle' mt='22px' small>
                作用：储存星球建筑产出的所有资源
              </Text>
            </Box>
            <Button onClick={onChange}>确认摧毁</Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
