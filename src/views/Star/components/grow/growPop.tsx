import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Card, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import StarCom from 'components/StarCom';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';

import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { StrengthenConsumeType } from './type';

import { TextList } from '../Modal';

const ImgCard = styled(Card)`
  border: 1px solid #4ac6ff;
`;

export const GrowPop: React.FC<{
  visible: boolean;
  planetInfo: Api.Planet.PlanetInfo;
  itemData: StrengthenConsumeType;
  onClose: () => void;
  callBack: () => void;
}> = ({ visible, itemData, onClose, callBack, planetInfo }) => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const dispatch = useDispatch();

  const ToStrengthenPlante = async () => {
    try {
      const res = await Api.PlanetApi.StrengthenPlante({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        toastSuccess(t('Operate Succeeded'));
        dispatch(fetchPlanetInfoAsync([Number(parsedQs.id)]));
        callBack();
      }
      onClose();
    } catch (error) {
      toastError(t('Operate Failed'));
      console.error(error);
    }
  };

  return (
    <ModalWrapper
      title={t('Planet Cultivation')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='30px 25px'>
        <Flex>
          {/* <ImgCard width={295} height={295}>
            <Image width={295} height={295} src='/images/model/combat_01.png' />
          </ImgCard> */}
          <StarCom
            scale='ld'
            picture1={planetInfo?.picture1}
            picture={planetInfo?.picture}
            quality={planetInfo?.rarity}
          />

          <Flex
            flex='1'
            ml='23px'
            justifyContent='space-between'
            alignItems='flex-start'
            flexDirection='column'
          >
            <Box width='100%'>
              <Text small>{t('Payment for Planet Cultivation')}</Text>
              <Box mb='15px'>
                <TextList
                  imgWidth={50}
                  imgHeight={50}
                  imgSrc='/images/tokens/BNB.svg'
                  number={itemData?.consume_bnb?.toString()}
                  unit={t('BNB')}
                />
              </Box>
            </Box>
            <Flex width='100%' justifyContent='center'>
              <Button onClick={() => ToStrengthenPlante()}>
                {t('Confirm Cultivating')}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
