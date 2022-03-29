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
  value: string;
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
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <ModalWrapper title='建筑升级' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex alignItems='center'>
          <Text shadow='primary'>矿石建筑</Text>
          <Text ml='27px' small>
            2x2
          </Text>
        </Flex>
        <Flex flexWrap='wrap' pb='16px'>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/HP.png'
              title='HP值'
              value='10/80'
              extValue={-1}
              moreButton={<ThingaddBlood />}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/durability.png'
              title='耐久度'
              value='10/80'
              extValue={-1}
              moreButton={<ThingaddBlood />}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/icon/energy.png'
              title='能量消耗'
              value='10/80'
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/defense.png'
              title='防御值'
              value='10/80'
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/star/attackValue.png'
              title='攻击值'
              value='10/80'
              extValue={-1}
            />
          </Item>
          <Item>
            <UpgradeItem
              width={50}
              height={50}
              src='/images/commons/icon/population.png'
              title='人口消耗'
              value='10/80'
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
              number='100'
              unit='DSG'
            />
            <Button ml='34px'>确认升级</Button>
          </Flex>
        </ConfirmBox>
      </Box>
    </ModalWrapper>
  );
};
