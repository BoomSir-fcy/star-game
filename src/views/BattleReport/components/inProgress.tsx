import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, MarkText, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link } from 'react-router-dom';
import { parseZip } from 'utils';
import { useDispatch } from 'react-redux';
import { setPKInfo, setPKRes } from 'state/game/reducer';
import { useWeb3React } from '@web3-react/core';
import { RecordInfo } from 'state/types';

dayjs.extend(utc);

const CardBox = styled(Flex)`
  position: relative;
  min-width: 490px;
  height: 100%;
  padding: 22px 30px;
  border-right: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  flex-direction: column;
  justify-content: space-between;
`;

const PlayImg = styled.img``;

const TextStyle = styled(Text)`
  font-size: 16px;
  width: 33%;
`;

const FlexStyle = styled(Flex)``;

export const InProgress: React.FC<{
  info: RecordInfo;
}> = ({ info }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  return (
    <GraphicsCard
      style={{ padding: 0, border: 'none' }}
      width='max-content'
      height='100%'
      stripe
    >
      <CardBox>
        <Box>
          <Flex mb='10px' justifyContent='space-between' alignItems='baseline'>
            <MarkText fontSize='20px' bold>
              {t('%num%th exploration', { num: info.workCount })}
            </MarkText>
            {info.working ? (
              <Text color='#59E97B' fontSize='16px'>
                {t('探索中')}
              </Text>
            ) : (
              <Text fontSize='16px'>{t('探索完成')}</Text>
            )}
          </Flex>
          <Flex mb='10px'>
            <Text mr='30px'>{t('预计探索时间')}</Text>
            <Text>
              {dayjs.unix(info.startTime).format('YYYY-MM-DD HH:mm:ss')}
              &nbsp;~&nbsp;
              {dayjs.unix(info.endTime).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </Flex>
          <Text>
            {t('产生几次战斗 : ')}
            {info.plunderCount}
          </Text>
        </Box>
        <Box>
          <MarkText mb='10px' fontSize='16px' bold>
            {t('探索汇总')}
          </MarkText>
          <TextStyle mb='8px'>{t('战斗损耗 ')}:</TextStyle>
          <FlexStyle mb='8px'>
            <TextStyle>
              -{info.loseUnit} {t('战斗单位')}
            </TextStyle>
            <TextStyle>
              -{info.lostDurability} {t('建筑耐久度')}
            </TextStyle>
          </FlexStyle>
          <FlexStyle>
            <TextStyle>
              -{info.loseEnergy} {t('Energy')}
            </TextStyle>
            <TextStyle>
              -{info.loseStone} {t('Ore')}
            </TextStyle>
            <TextStyle>
              -{info.losePopulation} {t('Population')}
            </TextStyle>
          </FlexStyle>
        </Box>
        <Box>
          <TextStyle mb='8px'>{t('获得资源 ')}:</TextStyle>
          <FlexStyle>
            <TextStyle>
              +{info.getEnergy} {t('Energy')}
            </TextStyle>
            <TextStyle>
              +{info.getStone} {t('Ore')}
            </TextStyle>
            <TextStyle>
              +{info.getPopulation} {t('Population')}
            </TextStyle>
          </FlexStyle>
        </Box>
      </CardBox>
    </GraphicsCard>
  );
};
