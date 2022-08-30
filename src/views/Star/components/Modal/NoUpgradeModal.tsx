import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Box, Flex, Button, Text, Image } from 'uikit';
import ModalWrapper from 'components/Modal';
import { useTranslation } from 'contexts/Localization';
import { useStore, storeAction } from 'state';
import { useDispatch } from 'react-redux';
import { BuildRaceData } from 'config/buildConfig';

export const NoUpgradeModal: React.FC<{
  planetId: number;
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose, planetId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
  const planet = useStore(p => p.planet.planetInfo[planetId ?? 0]);

  const NoUpBuildList = useMemo(() => {
    const leve = planet?.level;
    const arr = selfBuilding?.filter(item => {
      return item?.building?.propterty?.levelEnergy < leve;
    });
    return arr;
  }, [selfBuilding, planet]);

  return (
    <ModalWrapper
      title={t('Tips')}
      visible={visible}
      setVisible={() => {
        dispatch(storeAction.setUpgradeUnsuccessful(false));
        onClose();
      }}
    >
      <Box padding='20px 30px 0' width='100%'>
        <Text mb='30px' bold fontSize='18px' width='100%' textAlign='center'>
          {t('UpErr1')}
        </Text>
        <Text mb='10px' fontSize='16px'>
          {t('UpErr2')}
        </Text>
        <Text fontSize='16px'>{t('UpErr3')}</Text>
        {NoUpBuildList.length > 0 && (
          <>
            <Text
              bold
              pt='20px'
              width='100%'
              textAlign='center'
              mb='16px'
              fontSize='18px'
            >
              {t('UpErr4')}
            </Text>
            <Flex flexWrap='wrap'>
              {NoUpBuildList.map((item, index) => (
                <Flex>
                  <Text small>{`(${index + 1})`}&nbsp; </Text>
                  <Text
                    small
                    color='#4FFFFB'
                    mr='10px'
                    mb='4px'
                    key={`${item.building._id}_${item.building.index}`}
                  >
                    {t(
                      `${
                        BuildRaceData[item.building?.race][item.building?.index]
                          .name
                      }`,
                    )}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </>
        )}
        <Box pt='20px' margin='0 auto' width='max-content'>
          <Button
            variant='purple'
            width='277px'
            height='45px'
            padding='0'
            onClick={() => {
              dispatch(storeAction.setUpgradeUnsuccessful(false));
              onClose();
            }}
          >
            <Text>
              {NoUpBuildList.length ? t('UpErrBtn1') : t('UpErrBtn2')}
            </Text>
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
