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

export const BattleTop: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
      <Box mr='40px'>
        <BackButton />
        <RefreshButton ml='33px' />
      </Box>
      <TitleBox>
        <MarkText fontSize='18px' bold fontStyle='italic'>
          战报详情
        </MarkText>
      </TitleBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          总战斗场数
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          10
        </MarkText>
      </RecordBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          胜利场数
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          10
        </MarkText>
      </RecordBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          失败场数
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          10
        </MarkText>
      </RecordBox>
    </Flex>
  );
};
