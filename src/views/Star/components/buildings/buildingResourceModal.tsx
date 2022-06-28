import React from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { Flex, Box, GraphicsCard, Button, MarkText, Slider, Text } from 'uikit';
import { TokenImage } from 'components/TokenImage';
import { useTranslation } from 'contexts/Localization';

const Container = styled(GraphicsCard)`
  position: absolute;
  right: 580px;
  bottom: -250px;
  padding: 20px 30px;
`;

const ResourceSlider: React.FC<{
  icon: string;
  title: string;
  defaultValue: number;
  maxValue: number;
  onChange: (val: number) => void;
}> = ({ icon, title, defaultValue, maxValue, onChange }) => {
  const { t } = useTranslation();
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
          onValueChanged={value => onChange(value)}
          mt='5px'
        />
      </Flex>
    </Flex>
  );
};

export const BuildingResourceModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { t } = useTranslation();
  const [state, setState] = useImmer({
    ore: 0,
  });

  React.useEffect(() => {
    window.addEventListener('click', onClose);
    return () => {
      window.removeEventListener('click', onClose);
    };
  }, [onClose]);

  return (
    <Container width='547px' height='343px'>
      <MarkText bold fontStyle='normal' mb='25px'>
        提取资源
      </MarkText>
      <Box mb='21px'>
        <ResourceSlider
          icon='ORE'
          title={t('Ore')}
          defaultValue={state.ore}
          maxValue={100}
          onChange={val =>
            setState(p => {
              p.ore = val;
            })
          }
        />
      </Box>
      <Box mb='21px'>
        <ResourceSlider
          icon='ENG'
          title={t('Energy')}
          defaultValue={state.ore}
          maxValue={100}
          onChange={val =>
            setState(p => {
              p.ore = val;
            })
          }
        />
      </Box>
      <Box>
        <ResourceSlider
          icon='SPICES'
          title={t('Population')}
          defaultValue={state.ore}
          maxValue={100}
          onChange={val =>
            setState(p => {
              p.ore = val;
            })
          }
        />
      </Box>
      <Flex justifyContent='center' mt='15px'>
        <Button width='226px' height='53px' variant='purple'>
          <Text bold fontSize='16px' color='#4FFFFB'>
            {t('确认提取')}
          </Text>
        </Button>
      </Flex>
    </Container>
  );
};
