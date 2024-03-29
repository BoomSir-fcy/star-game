import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useImmer } from 'use-immer';
import { Flex, Box, GraphicsCard, Button, MarkText, Slider, Text } from 'uikit';
import { TokenImage } from 'components/TokenImage';

import { formatDisplayApr } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';

const Container = styled(GraphicsCard)`
  position: absolute;
  right: 580px;
  bottom: -250px;
  padding: 20px 30px;
`;

export const ResourceSlider: React.FC<{
  icon: string;
  title: string;
  defaultValue: number;
  maxValue: number;
  onChange: (val: number) => void;
}> = ({ icon, title, defaultValue, maxValue, onChange }) => {
  return (
    <Flex width='100%'>
      <TokenImage width={50} height={50} tokenAddress={icon} />
      <Flex flexDirection='column' flex={1} ml='9px'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text color='textSubtle'>{title}</Text>
          <Text>{maxValue}</Text>
        </Flex>
        <Slider
          name='lp-amount'
          min={0}
          max={100}
          value={defaultValue}
          onValueChanged={onChange}
          mt='5px'
        />
      </Flex>
    </Flex>
  );
};

export const BuildingResourceModal: React.FC<{
  type: number;
  maxValue: {
    stone: number;
    population: number;
    energy: number;
  };
  onClose: () => void;
  onFinish: (prams) => void;
}> = ({ type, maxValue, onClose, onFinish }) => {
  const { t } = useTranslation();
  const [state, setState] = useImmer({
    stone: 0,
    population: 0,
    energy: 0,
  });

  // React.useEffect(() => {
  //   window.addEventListener('click', onClose);
  //   return () => {
  //     window.removeEventListener('click', onClose);
  //   };
  // }, [onClose]);

  return (
    <Container width='547px' height='343px'>
      <MarkText bold fontStyle='normal' mb='25px'>
        {type === 1 ? t('Extract Resources') : t('Supplement Resources')}
      </MarkText>
      <Box mb='21px'>
        <ResourceSlider
          icon='ORE'
          title={t('Ore')}
          defaultValue={state.stone}
          maxValue={maxValue.stone}
          onChange={val =>
            setState(p => {
              p.stone = Number(val.toFixed(0));
            })
          }
        />
      </Box>
      <Box mb='21px'>
        <ResourceSlider
          icon='ENG'
          title={t('Energy')}
          defaultValue={state.energy}
          maxValue={maxValue.energy}
          onChange={val =>
            setState(p => {
              p.energy = Number(val.toFixed(0));
            })
          }
        />
      </Box>
      <Box>
        <ResourceSlider
          icon='SPICES'
          title={t('Population')}
          defaultValue={state.population}
          maxValue={maxValue.population}
          onChange={val =>
            setState(p => {
              p.population = Number(val.toFixed(0));
            })
          }
        />
      </Box>
      <Flex justifyContent='center' mt='15px'>
        <Button
          width='226px'
          height='53px'
          variant='purple'
          onClick={() => onFinish(state)}
        >
          <Text bold fontSize='16px' color='#4FFFFB'>
            {t('确认提取')}
          </Text>
        </Button>
      </Flex>
    </Container>
  );
};
