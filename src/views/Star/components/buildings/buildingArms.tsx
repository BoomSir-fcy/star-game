import React from 'react';
import styled from 'styled-components';
import { Flex, Box, GraphicsCard, MarkText, Text, Image } from 'uikit';
import { getSpriteRes } from 'game/core/utils';
import { useImmer } from 'use-immer';
import { useTranslation } from 'contexts/Localization';
import { raceData } from 'config/raceConfig';
import { ArmsInfo } from '../arms';

const ArmsContent = styled(Box)`
  width: 92px;
  margin-right: 9px;
  margin-bottom: 15px;
  cursor: pointer;
  &:nth-child(5n) {
    margin-right: 0;
  }
`;

const Preview = styled(GraphicsCard)`
  position: relative;
  padding: 0;
  overflow: hidden;
`;

const PreviewNumber = styled(Text)`
  position: absolute;
  left: 5px;
  top: 5px;
`;

const ArmsPreview: React.FC<{
  data: Api.Building.Arms;
  onClick: () => void;
}> = ({ data, onClick }) => {
  const getArms = React.useCallback(() => {
    const arms = raceData[data?.game_base_unit?.race]?.children.find(
      ({ id }) => id === Number(data?.game_base_unit.index),
    );
    return arms;
  }, [data?.game_base_unit.index, data?.game_base_unit?.race]);

  const getSoldierSrc = React.useCallback(() => {
    let img = '';
    if (data?.game_base_unit?.race) {
      img = getSpriteRes(
        data?.game_base_unit?.race,
        data?.game_base_unit?.index,
        2,
      );
    }
    return img;
  }, [data]);

  return (
    <ArmsContent
      onClick={event => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
      }}
    >
      <Preview isRadius stripe width='92px' height='92px'>
        <PreviewNumber>{data?.count}</PreviewNumber>
        <Image src={getSoldierSrc()} width={92} height={92} />
      </Preview>
      <Text mt='11px' textAlign='center' ellipsis>
        {getArms()?.name}
      </Text>
    </ArmsContent>
  );
};

export const BuildingArms: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  const { t } = useTranslation();
  const [state, setState] = useImmer({
    visible: false,
    index: '' as number | string,
    arms: {},
  });

  const close = React.useCallback(() => {
    setState(p => {
      p.visible = false;
      p.index = '';
    });
  }, [setState]);

  React.useEffect(() => {
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('click', close);
    };
  }, [close]);

  return (
    <Box>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
        {t('Arm details')}
      </MarkText>
      <Flex flexWrap='wrap'>
        {(currnet_building?.petri_dish?.arms ?? []).map((item, index) => (
          <ArmsPreview
            data={item}
            key={item.unique_id}
            onClick={() => {
              setState(p => {
                p.visible = !(state.visible && index === state.index);
                p.index = index;
                p.arms = item;
              });
            }}
          />
        ))}
      </Flex>

      {state.visible && state.index >= 0 && (
        <ArmsInfo armsData={state.arms} top='40%' />
      )}
    </Box>
  );
};
