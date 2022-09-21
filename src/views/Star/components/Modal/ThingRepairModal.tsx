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

  const [nowResource, setnowResource] = React.useState({
    already_energy: null,
    already_population: null,
    already_stone: null,
  });

  React.useEffect(() => {
    const getStorage = async () => {
      const id = typeof planet_id === 'object' ? planet_id[0] : planet_id;
      try {
        const res = await Api.BuildingApi.getMaxReCharge(id);
        if (Api.isSuccess(res)) {
          const obj = {
            already_energy: res.data?.already_energy,
            already_population: res.data?.already_population,
            already_stone: res.data?.already_stone,
          };
          setnowResource(obj);
        }
      } catch (error) {
        console.error(error);
      }
    };
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
    if (typeof planet_id !== 'object' || planet_id.length === 1) {
      getStorage();
    }
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
                  alreadyNumber={nowResource.already_stone}
                  unit={t('Ore')}
                />
              </Box>
              <Box mb='15px'>
                <TextList
                  imgWidth={50}
                  imgHeight={50}
                  imgSrc='/images/commons/icon/icon_energy.png'
                  number={state.energy}
                  alreadyNumber={nowResource.already_energy}
                  unit={t('Energy')}
                />
              </Box>
              <TextList
                imgWidth={50}
                imgHeight={50}
                imgSrc='/images/commons/icon/icon_spice.png'
                number={state.population}
                alreadyNumber={nowResource.already_population}
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
