import React from 'react';
import { Box, Flex, Button, Text } from 'uikit';
import ModalWrapper from 'components/Modal';
import { Api } from 'apis';

import { useTranslation } from 'contexts/Localization';

import { TextList } from './TextList';
import { GameThing } from '../gameModel';

import { useBuildingRepair } from '../gameModel/hooks';

export const ThingRepairModal: React.FC<{
  visible: boolean;
  itemData: any;
  planet_id: number;
  building_id: string | number;
  onChange: () => void;
  onClose: () => void;
}> = ({ visible, itemData, onChange, onClose, planet_id, building_id }) => {
  const { t } = useTranslation();
  const { getCose } = useBuildingRepair();
  const [state, setStae] = React.useState({
    cost_population: '',
    cost_stone: '',
    quick_repair_cost_dsg: '',
  });

  React.useEffect(() => {
    const init = async () => {
      try {
        const res = await getCose({ planet_id, building_id });
        if (Api.isSuccess(res)) {
          setStae(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [building_id, planet_id, getCose]);

  return (
    <ModalWrapper
      title={t('planetModalTitleRepairDurability')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='30px 25px'>
        <Flex>
          <GameThing src={itemData?.picture} scale='lg' border />
          <Flex
            flex='1'
            ml='23px'
            justifyContent='space-between'
            alignItems='flex-start'
            flexDirection='column'
          >
            <Box width='100%'>
              <Text small>{t('planetModalRepairAllDurabilityFee')}</Text>
              <Box mb='15px'>
                <TextList
                  imgWidth={50}
                  imgHeight={50}
                  imgSrc='/images/commons/dsg-1.png'
                  number={state.quick_repair_cost_dsg}
                  unit='DSG'
                />
              </Box>
              <TextList
                imgWidth={50}
                imgHeight={50}
                imgSrc='/images/commons/star/durability.png'
                number={state.cost_population}
                unit={t('planetPopulation')}
              />
            </Box>
            <Button onClick={onChange}>{t('planetConfirmRepair')}</Button>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
