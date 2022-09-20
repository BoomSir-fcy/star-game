import React from 'react';
import { Box, Flex, Button, Text } from 'uikit';
import ModalWrapper from 'components/Modal';
import { Api } from 'apis';
import { getBuilderSpriteRes } from 'building/core/utils';

import { useTranslation } from 'contexts/Localization';

import { TextList } from './TextList';
import { GameThing } from '../gameModel';

import { useBuildingRepair } from '../gameModel/hooks';

export const ThingRepairModal: React.FC<{
  visible: boolean;
  itemData?: any;
  planet_id: number | number[];
  building_id?: string | number;
  onChange: () => void;
  onClose: () => void;
}> = ({ visible, itemData, onChange, onClose, planet_id, building_id }) => {
  const { t } = useTranslation();
  const { getCose, getBatcheCost } = useBuildingRepair();
  const [state, setStae] = React.useState({
    population: '',
    stone: '',
    energy: '',
  });

  React.useEffect(() => {
    const init = async () => {
      try {
        const res =
          typeof planet_id === 'object'
            ? await getBatcheCost(planet_id)
            : await getCose({ planet_id, building_id });
        if (Api.isSuccess(res)) {
          setStae(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [building_id, planet_id, getCose, getBatcheCost]);

  return (
    <ModalWrapper
      title={t('planetModalTitleRepairDurability')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='30px 25px'>
        <Flex alignItems='flex-start'>
          {typeof planet_id !== 'object' && (
            <GameThing
              src={getBuilderSpriteRes(itemData?.race, `${itemData?.index}`)}
              // src={itemData?.picture}
              scale='lg'
              border
            />
          )}
          <Flex
            flex='1'
            ml={`${typeof planet_id === 'object' ? '0' : '23px'}`}
            justifyContent='space-between'
            alignItems='flex-start'
            flexDirection='column'
          >
            <Box width='100%' mb='20px'>
              <Text small mb='10px'>
                {t('planetModalRepairAllDurabilityFee')}
              </Text>
              <Box mb='15px'>
                <TextList
                  imgWidth={50}
                  imgHeight={50}
                  imgSrc='/images/commons/icon/icon_minera.png'
                  number={state.stone}
                  unit={t('Ore')}
                />
              </Box>
              <Box mb='15px'>
                <TextList
                  imgWidth={50}
                  imgHeight={50}
                  imgSrc='/images/commons/icon/icon_energy.png'
                  number={state.energy}
                  unit={t('Energy')}
                />
              </Box>
              <TextList
                imgWidth={50}
                imgHeight={50}
                imgSrc='/images/commons/icon/icon_spice.png'
                number={state.population}
                unit={t('Population')}
              />
            </Box>
            <Button
              width='50%'
              variant='purple'
              onClick={onChange}
              style={{
                margin: 'auto',
              }}
            >
              {t('planetConfirmRepair')}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
