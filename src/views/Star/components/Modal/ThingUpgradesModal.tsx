import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
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
      <Box ml='9px'>
        <Flex alignItems='center'>
          <Text color='textSubtle' small>
            {title}
          </Text>
          {moreButton}
        </Flex>
        <Flex alignItems='center'>
          <Text small>{value}</Text>
          <Text
            ml='14px'
            color={`${extValue > 0 ? 'textSuccess' : 'textDanger'}`}
            small
          >
            {extValue}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export const ThingUpgradesModal: React.FC<{
  visible: boolean;
  planet_id: number;
  itemData: Api.Building.Building;
  upgrade: any;
  onChange: (value: any) => void;
  onClose: () => void;
}> = ({ visible, planet_id, itemData, upgrade, onChange, onClose }) => {
  // console.log(upgrade, upgrade?.estimate_building_detail?.building);

  return (
    <ModalWrapper title='建筑升级' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex alignItems='center'>
          <Text shadow='primary'>{itemData?.propterty?.name_en}</Text>
          <Text ml='27px' small>
            {`${itemData?.propterty?.size.area_x}x${itemData?.propterty?.size.area_y}`}
          </Text>
        </Flex>
        <Flex flexWrap='wrap' pb='16px'>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/HP.png'
              title='HP值'
              value={itemData?.propterty?.hp}
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/durability.png'
              title='耐久度'
              value={`${itemData?.propterty?.per_durability}/${itemData?.propterty?.max_durability}`}
              extValue={-1}
              moreButton={
                <>
                  {itemData?.propterty?.per_durability !==
                    itemData?.propterty?.max_durability && (
                    <ThingRepair
                      itemData={itemData}
                      planet_id={planet_id}
                      building_id={itemData._id}
                      onCallback={() => {
                        console.log(222);
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
              src='/images/commons/icon/energy.png'
              title='能量消耗'
              value={`${itemData?.propterty?.per_cost_energy}/h`}
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/defense.png'
              title='防御值'
              value={itemData?.propterty?.defence}
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/attackValue.png'
              title='攻击值'
              value={itemData?.propterty?.attack}
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/icon/population.png'
              title='人口消耗'
              value={`${itemData?.propterty?.per_cost_population}/h`}
              extValue={-1}
            />
          </Item>
        </Flex>
        <ConfirmBox>
          <Text small>建筑升级所需支付</Text>
          <Flex
            mt='14px'
            flex={1}
            justifyContent='space-between'
            alignItems='center'
          >
            <TextList
              imgWidth={50}
              imgHeight={50}
              imgSrc='/images/commons/dsg-1.png'
              number={upgrade?.quick_upgrade_cost_star}
              unit='DSG'
            />
            <Button ml='34px' onClick={onChange}>
              确认升级
            </Button>
          </Flex>
        </ConfirmBox>
      </Box>
    </ModalWrapper>
  );
};
