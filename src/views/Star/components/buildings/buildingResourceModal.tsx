import React from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import {
  Flex,
  Box,
  GraphicsCard,
  Button,
  MarkText,
  Slider,
  Text,
  Image,
} from 'uikit';
import { TokenImage } from 'components/TokenImage';

import { useTranslation } from 'contexts/Localization';
import { formatLocalisedCompactBalance } from 'utils/formatBalance';

const Container = styled(GraphicsCard)`
  position: absolute;
  right: 580px;
  bottom: 50px;
  padding: 20px 30px;
`;

const Close = styled(Box)`
  position: absolute;
  top: -10px;
  right: -20px;
  width: 43px;
  height: 43px;
  cursor: pointer;
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
          <Text
            small
            title={`${Math.floor(
              Number((defaultValue / 100) * maxValue),
            )}/${maxValue}`}
          >
            {formatLocalisedCompactBalance(
              Math.floor(Number((defaultValue / 100) * maxValue)),
            )}
            /{formatLocalisedCompactBalance(maxValue)}
          </Text>
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
    <Container width='547px' height='370px'>
      <Box position='relative'>
        <Close onClick={onClose}>
          <Image
            width={43}
            height={43}
            src='../images/commons/introjs-close.png'
          />
        </Close>
        <MarkText bold fontStyle='normal'>
          {t('Extract Resources')}
        </MarkText>
        <Text pt='10px' small color='textTips' mb='20px'>
          {t("The Planet's total resource storage")}
        </Text>
        <Box mb='21px'>
          <ResourceSlider
            icon='ORE'
            title={t('Ore')}
            defaultValue={state.stone}
            maxValue={maxValue.stone}
            onChange={val =>
              setState(p => {
                p.stone = Math.floor(Number(val));
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
                p.energy = Math.floor(Number(val));
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
                p.population = Math.floor(Number(val));
              })
            }
          />
        </Box>
        <Flex justifyContent='center' mt='15px'>
          <Button
            width='226px'
            height='53px'
            variant='purple'
            onClick={() => {
              const params = {
                stone:
                  state.stone === 100
                    ? maxValue?.stone
                    : Math.floor(Number((state.stone / 100) * maxValue?.stone)),
                population:
                  state.population === 100
                    ? maxValue?.population
                    : Math.floor(
                        Number((state.population / 100) * maxValue?.population),
                      ),
                energy:
                  state.energy === 100
                    ? maxValue?.energy
                    : Math.floor(
                        Number((state.energy / 100) * maxValue?.energy),
                      ),
              };
              onFinish(params);
            }}
          >
            <Text bold fontSize='16px' color='#4FFFFB'>
              {t('Confirm Extract')}
            </Text>
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
