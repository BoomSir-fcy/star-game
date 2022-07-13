import React from 'react';
import { Box, Flex, Button, Text, Image } from 'uikit';
import { useStore } from 'state';
import {
  getBuilderSpriteRes,
  getBuildingOfRaceAndIndex,
} from 'building/core/utils';
import { useTranslation } from 'contexts/Localization';

import ModalWrapper from 'components/Modal';
import { GameThing } from '../gameModel';

export const ThingDestoryModal: React.FC<{
  visible: boolean;
  planet_id: number;
  onChange: () => void;
  onClose: () => void;
}> = ({ visible, planet_id, onChange, onClose }) => {
  const { t } = useTranslation();
  const destory = useStore(p => p.buildling.destroyBuilding);

  return (
    <ModalWrapper
      title={t('planetModalDestroyBuilding')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='30px 25px'>
        <Flex>
          <GameThing
            src={getBuilderSpriteRes(
              destory?.destory?.race,
              `${destory?.destory?.index}`,
            )}
            // src={destory?.destory?.picture}
            scale='lg'
            border
          />
          <Flex ml='23px' justifyContent='space-between' flexDirection='column'>
            <Box>
              <Text shadow='primary' bold>
                {/* {destory?.destory?.propterty?.name_en} */}
                {
                  getBuildingOfRaceAndIndex(
                    destory?.destory?.race,
                    destory?.destory?.index,
                  )?.name
                }
              </Text>
              <Text color='textSubtle' mt='22px' small>
                {t('planetDetailsTypeEffect')}
                {destory?.destory?.describe}
              </Text>
            </Box>
            <Button onClick={onChange}>{t('planetConfirmDestroy')}</Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
