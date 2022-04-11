import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RadarChart from 'game/core/RadarChart';
import Soldier from 'game/core/Soldier';
import {
  Box,
  Flex,
  Text,
  BoxProps,
  Image,
  BorderCard,
  BorderCardProps,
  Divider,
  Card,
} from 'uikit';
import { Container } from './styled';
import PreviewSoldier from './PreviewSoldier';

interface PreviewProps extends BorderCardProps {
  solider: Soldier | null;
}

const StatusItem = () => {
  return (
    <Flex margin='6px 0' alignItems='center' width='200px'>
      <Image width={60} height={60} src='/images/commons/star/HP.png' />
      <Box>
        <Flex>
          <Text fontSize='20px' color='textTips'>
            HP 值
          </Text>
          <Image
            width={30}
            height={30}
            src='/images/commons/icon/add_blood.png'
          />
        </Flex>
        <Text fontSize='22px'>10 / 100</Text>
      </Box>
    </Flex>
  );
};
const Preview: React.FC<PreviewProps> = ({ solider, ...props }) => {
  const [radarChart] = useState(
    new RadarChart({
      width: 200,
      height: 200,
      colorPolygon: '#FFFFFF',
      colorText: '#FFFFFF',
      fillColor: 'rgba(211, 95, 96, 0.5)',
      data: [
        {
          attr: '爆发',
          value: 100,
        },
        {
          attr: '防御',
          value: 60,
        },
        {
          attr: '治疗',
          value: 50,
        },
        {
          attr: '控制',
          value: 60,
        },
        {
          attr: '辅助',
          value: 30,
        },
        {
          attr: '机动',
          value: 70,
        },
      ],
    }),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(radarChart.canvas);
    }
  }, [ref, radarChart]);
  return (
    <BorderCard isActive width='600px' height='476px' {...props}>
      <Flex
        mt='22px'
        padding='0 28px 0 36px'
        alignItems='center'
        justifyContent='space-between'
      >
        <Flex alignItems='center' flex={1}>
          <Text bold shadow='primary'>
            机甲1
          </Text>
          <Text mt='2px' ml='36px' fontSize='22px'>
            LV 1
          </Text>
          <Image
            width={30}
            height={30}
            src='/images/commons/icon/add_blood.png'
          />
          <Image
            width={30}
            height={30}
            src='/images/commons/icon/add_blood.png'
          />
        </Flex>
        <Image
          width={30}
          height={30}
          src='/images/commons/icon/add_blood.png'
        />
      </Flex>
      <Flex>
        <PreviewSoldier style={{ flexShrink: 0 }} sid={1} />
        <Flex flexWrap='wrap' justifyContent='space-between'>
          <StatusItem />
          <StatusItem />
          <StatusItem />
          <StatusItem />
        </Flex>
      </Flex>
      <Divider margin='8px auto 27px' width={532} />
      <Flex>
        <Box ml='22px' ref={ref} width={218} />
        <Card overflow='auto' width={354} height={217} padding='16px'>
          <Text fontSize='20' color='textTips'>
            提高角色最终命中率，同时处于反击状态。每提升1级，
            最终命中率提高3%，同时每提升1级，反击的为例提高。
          </Text>
        </Card>
      </Flex>
    </BorderCard>
  );
};

export default Preview;
