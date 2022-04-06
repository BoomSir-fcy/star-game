import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Card, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';

import { TextList } from '../Modal';

const ImgCard = styled(Card)`
  border: 1px solid #4ac6ff;
`;

export const GrowPop: React.FC<{
  visible: boolean;
  onClose: () => void;
  callBack: () => void;
}> = ({ visible, onClose, callBack }) => {
  const parsedQs = useParsedQueryString();

  const ToStrengthenPlante = async () => {
    try {
      const res = await Api.PlanetApi.StrengthenPlante({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        console.log(res);
        callBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalWrapper title='星球培育 ' visible={visible} setVisible={onClose}>
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
              <Text small>星球培育所需支付</Text>
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
              <Button onClick={() => ToStrengthenPlante()}>确认培育</Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
