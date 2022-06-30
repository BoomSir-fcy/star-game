import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import { useTranslation } from 'contexts/Localization';

import { useStore } from 'state';
import { TextList } from './TextList';
import { ThingaddBlood, GameThing, ThingRepair } from '..';

const Item = styled(Box)`
  width: 33%;
  margin-top: 22px;
`;

const ConfirmBox = styled(Flex)`
  flex-direction: column;
  padding-top: 22px;
  border-top: 1px solid #2b2f39;
`;

const UpgradeItem: React.FC<{
  width: number;
  height: number;
  title: string;
  src: string;
  value: string | number;
  extValue: number;
  moreButton?: React.ReactNode;
}> = ({ width, height, title, src, value, extValue, moreButton }) => {
  return (
    <Flex alignItems='center'>
      <Box width={`${width}px`} height={`${height}px`}>
        <Image width={50} height={50} src={src} />
      </Box>
      <Box ml='9px' style={{ width: ' calc(100% - 55px)' }}>
        <Flex alignItems='center'>
          <Text color='textSubtle' small>
            {title}
          </Text>
          {moreButton}
        </Flex>
        <Flex alignItems='center'>
          <Text small ellipsis fontSize='18px' title={value.toString()}>
            {value}
          </Text>
          <Text
            ml='14px'
            color={`${extValue >= 0 ? 'textSuccess' : 'textDanger'}`}
            fontSize='16px'
            ellipsis
            title={extValue.toString()}
          >
            {extValue ? (extValue > 0 ? `+${extValue}` : `${extValue}`) : ''}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export const ThingUpgradesModal: React.FC<{
  visible: boolean;
  planet_id: number;
  itemData?: Api.Building.Building;
  onChange: (value: any) => void;
  onClose: () => void;
}> = ({ visible, planet_id, itemData, onChange, onClose }) => {
  const { t } = useTranslation();
  const upgrade = useStore(p => p.buildling.upgradesBuilding.upgrad);
  const { building_detail, estimate_building_detail } = upgrade;

  return (
    <ModalWrapper
      title={t('planetModalBuildingUpgrades')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='30px 25px'>
        <Flex alignItems='center'>
          <Text shadow='primary'>{building_detail?.propterty?.name_en}</Text>
          <Text ml='27px' small>
            {`${building_detail?.propterty?.size.area_x}x${building_detail?.propterty?.size.area_y}`}
          </Text>
        </Flex>
        <Flex flexWrap='wrap' pb='16px'>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/durability.png'
              title={t('planetDurability')}
              value={`${building_detail?.propterty?.now_durability}/${building_detail?.propterty?.max_durability}`}
              extValue={
                estimate_building_detail?.propterty?.now_durability -
                building_detail?.propterty?.now_durability
              }
              moreButton={
                <>
                  {building_detail?.propterty?.now_durability !==
                    building_detail?.propterty?.max_durability && (
                    <ThingRepair
                      itemData={itemData}
                      planet_id={planet_id}
                      building_id={itemData._id}
                      onCallback={() => {
                        // TODO: 更多
                      }}
                    />
                  )}
                </>
              }
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/icon/icon_energy.png'
              title={t('planetEnergyConsumption')}
              value={`${building_detail?.propterty?.per_cost_energy}/h`}
              extValue={
                estimate_building_detail?.propterty?.per_cost_energy -
                building_detail?.propterty?.per_cost_energy
              }
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/icon/icon_spice.png'
              title={t('planetPopulationConsumption')}
              value={`${building_detail?.propterty?.per_cost_population}/h`}
              extValue={
                estimate_building_detail?.propterty?.per_cost_population -
                building_detail?.propterty?.per_cost_population
              }
            />
          </Item>
        </Flex>
        <ConfirmBox>
          <Text small>{t('planetModalPaymentBuildingUpgrades')}</Text>
          <Flex
            mt='14px'
            flex={1}
            justifyContent='space-between'
            alignItems='center'
          >
            <TextList
              imgWidth={50}
              imgHeight={50}
              imgSrc='/images/tokens/0x2bf6502a30Af3378ACb51F056F47fc5e24aB8961.svg'
              number={estimate_building_detail?.upgrade_need?.upgrade_box || 0}
              unit='BOX'
            />
            <Button ml='34px' onClick={() => onChange(building_detail)}>
              {t('Confirm to upgrade')}
            </Button>
          </Flex>
        </ConfirmBox>
      </Box>
    </ModalWrapper>
  );
};
