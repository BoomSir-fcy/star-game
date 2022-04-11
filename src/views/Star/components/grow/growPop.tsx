import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Card, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';

import { TextList } from '../Modal';

const ImgCard = styled(Card)`
  border: 1px solid #4ac6ff;
`;

export const GrowPop: React.FC<{
  visible: boolean;
  onClose: () => void;
  callBack: () => void;
}> = ({ visible, onClose, callBack }) => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const { toastError, toastSuccess, toastWarning } = useToast();

  const ToStrengthenPlante = async () => {
    try {
      const res = await Api.PlanetApi.StrengthenPlante({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        toastSuccess(t('Successful operation'));
        console.log(res);
        callBack();
      }
    } catch (error) {
      toastError(t('Operation failed'));
      console.log(error);
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
          <ImgCard width={295} height={295}>
            <Image width={295} height={295} src='/images/model/combat_01.png' />
          </ImgCard>
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
                  imgSrc='/images/commons/dsg-1.png'
                  number='100'
                  unit='DSG'
                />
              </Box>
            </Box>
            <Flex width='100%' justifyContent='center'>
              <Button onClick={() => ToStrengthenPlante()}>
                {t('Confirm the cultivation')}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
