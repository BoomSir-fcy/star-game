import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  Flex,
  Box,
  Text,
  Image,
  BackButton,
  RefreshButton,
  MarkText,
} from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import { setRefresh } from 'state/alliance/reducer';

const TitleBox = styled(Flex)`
  width: 512px;
  height: 52px;
  background: url('/images/battleReport/top.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: center;
`;

const RecordBox = styled(Flex)`
  width: 316px;
  height: 90px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 45px;
  margin-left: 20px;
`;

interface contInfo {
  Cont: number;
  WinCont: number;
  FailedCont: number;
}

export const BattleTop: React.FC<{
  cont: contInfo;
  upDate: (e) => void;
}> = ({ cont, upDate }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
      <Box mr='40px'>
        <BackButton />
        <RefreshButton
          ml='33px'
          onRefresh={() => {
            upDate(0);
            dispatch(setRefresh());
          }}
        />
      </Box>
      <TitleBox>
        <MarkText fontSize='18px' bold fontStyle='italic'>
          {t('Battle details')}
        </MarkText>
      </TitleBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          {t('total number of battles')}
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          {cont.Cont}
        </MarkText>
      </RecordBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          {t('Victories')}
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          {cont.WinCont}
        </MarkText>
      </RecordBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          {t('Number of failed games')}
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          {cont.FailedCont}
        </MarkText>
      </RecordBox>
    </Flex>
  );
};
