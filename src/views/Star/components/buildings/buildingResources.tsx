import { useTranslation } from 'contexts/Localization';
import React from 'react';
import { Flex, Box, MarkText, Text, Button } from 'uikit';
import { useImmer } from 'use-immer';

import { BuildingProgress } from './buildingProgress';
import { BuildingResourceModal } from './buildingResourceModal';

export const BuildingResources: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
  estimate?: Api.Building.BuildingDetail;
}> = ({ currnet_building, estimate }) => {
  const { t } = useTranslation();
  const { store } = currnet_building;
  const [state, setState] = useImmer({
    visible: false,
  });

  return (
    <Box position='relative'>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='25px'>
        {t('store resources')}
      </MarkText>
      <Flex width='100%' flexDirection='column'>
        <Box mb='20px'>
          <BuildingProgress
            token='ORE'
            title={t('Ore')}
            value={store?.store_stone + store?.charge_stone}
            nextValue={
              estimate?.store?.store_max_stone - store?.store_max_stone
            }
            progressbar={
              ((store?.store_stone + store?.charge_stone) /
                store?.store_max_stone) *
              100
            }
          />
        </Box>
        <Box mb='20px'>
          <BuildingProgress
            token='ENG'
            title={t('Energy')}
            value={store?.store_energy + store?.charge_energy}
            nextValue={
              estimate?.store?.store_max_energy - store?.store_max_energy
            }
            progressbar={
              ((store?.store_energy + store?.charge_energy) /
                store?.store_max_energy) *
              100
            }
          />
        </Box>
        <Box mb='20px'>
          <BuildingProgress
            token='SPICES'
            title={t('Population')}
            value={store?.store_population + store?.charge_population}
            nextValue={
              estimate?.store?.store_max_population -
              store?.store_max_population
            }
            progressbar={
              ((store?.store_population + store?.charge_population) /
                store?.store_max_population) *
              100
            }
          />
        </Box>
      </Flex>
      <Flex justifyContent='space-between'>
        <Button
          width='226px'
          height='53px'
          variant='purple'
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            setState(p => {
              p.visible = true;
            });
          }}
        >
          <Text bold fontSize='16px' color='#4FFFFB'>
            {t('Supplement Resources')}
          </Text>
        </Button>
        <Button
          width='226px'
          height='53px'
          variant='purple'
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            setState(p => {
              p.visible = true;
            });
          }}
        >
          <Text bold fontSize='16px' color='#4FFFFB'>
            {t('Extract Resources')}
          </Text>
        </Button>
      </Flex>

      {/* 充提资源 */}
      {state.visible && (
        <BuildingResourceModal
          onClose={() =>
            setState(p => {
              p.visible = false;
            })
          }
        />
      )}
    </Box>
  );
};
