import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link } from 'react-router-dom';
import { parseZip } from 'utils';
import { useDispatch } from 'react-redux';
import { setPKInfo, setPKisFrom, setPKRes } from 'state/game/reducer';
import { useWeb3React } from '@web3-react/core';
import { PlunderInfo } from 'state/types';
import { PkResult } from './components/PkResult';

dayjs.extend(utc);

const CardBox = styled(Flex)`
  min-width: 490px;
  /* height: 100%; */
  padding: 22px 30px;
  border-right: 1px solid #4ffffb;
  flex-direction: column;
  justify-content: space-between;
`;

const PlayImg = styled.img``;

const TextStyle = styled(Text)`
  font-size: 16px;
  width: 33%;
`;

const FlexStyle = styled(Flex)``;

export const PkBox: React.FC<{
  First: boolean;
  info: PlunderInfo;
}> = ({ First, info }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  const isFrom = useMemo(() => {
    return (
      account?.toLocaleLowerCase() === info.fromAddress.toLocaleLowerCase()
    );
  }, [account, info.fromAddress]);

  const LostDurability = useMemo(() => {
    let num = 0;
    if (isFrom) {
      num = info.success === 1 ? 0 : info.lostDurability;
    } else {
      num = info.success === 0 ? 0 : info.lostDurability;
    }
    return num;
  }, [info, isFrom]);

  // 失去 from地址的输赢是 inComeNum loseNum   to地址的输赢是loseNum inComeNum 取from的反
  const LostValue = useCallback(
    (inComeNum: number, loseNum: number) => {
      let num = 0;
      if (isFrom) {
        num = loseNum;
      } else {
        num = inComeNum;
      }
      return num;
    },
    [isFrom],
  );

  // 获得
  const GetValue = useCallback(
    (inComeNum: number, loseNum: number) => {
      let num = 0;
      if (isFrom) {
        num = inComeNum;
      } else {
        num = loseNum;
      }
      return num;
    },
    [isFrom],
  );

  const pkRes = useMemo(() => {
    return isFrom ? !!info.success : !info.success;
  }, [isFrom, info.success]);

  return (
    <CardBox className={First ? 'battle-items-0' : ''}>
      <Flex>
        <PkResult result={pkRes} />
        <Flex
          ml='46px'
          mr='80px'
          flexDirection='column'
          justifyContent='space-around'
        >
          <Box>
            <Text>{t('Battle Planet No.')}</Text>
            <Text>NO.{info.id}</Text>
          </Box>
          <Box>
            <Text>{t('Ends in:')}</Text>
            <Text>
              {dayjs.unix(info.createTime).format('YY-MM-DD HH:mm:ss')}
            </Text>
          </Box>
        </Flex>
        <Link
          onClick={event => {
            try {
              console.log(parseZip(info.detail), 'parseZip(info.detail)');
              dispatch(setPKInfo(parseZip(info.detail)));
              dispatch(setPKRes(pkRes));
              console.log(isFrom, 'isFrom');
              dispatch(setPKisFrom(isFrom));
            } catch (error) {
              event.preventDefault();
              console.log('解析报错');
              console.error(error);
            }
          }}
          to={`/plunder-pk?id=${info.id}&pid0=${
            !isFrom ? info.fromAddress : info.toAddress
          }`}
        >
          <PlayImg src='/images/battleReport/play.png' alt='' />
        </Link>
      </Flex>
      <Box>
        <TextStyle mb='8px'>{t('Battle Losses')} :</TextStyle>
        <FlexStyle mb='8px'>
          <TextStyle>
            -{isFrom ? info.blueLoseUnit : info.redLoseUnit} {t('Battle Unit')}
          </TextStyle>
          <TextStyle style={{ width: '60%' }}>
            -{LostDurability} {t('Building’s END')}
          </TextStyle>
        </FlexStyle>
        <FlexStyle>
          <TextStyle>
            -{LostValue(info.incomeEnergy, info.loseEnergy)} {t('Energy')}
          </TextStyle>
          <TextStyle>
            -{LostValue(info.incomeStone, info.loseStone)} {t('Ore')}
          </TextStyle>
          <TextStyle>
            -{LostValue(info.incomePopulation, info.losePopulation)}{' '}
            {t('Population')}
          </TextStyle>
        </FlexStyle>
      </Box>
      <Box>
        <TextStyle mb='8px'>{t('Get Resources')} :</TextStyle>
        <FlexStyle>
          <TextStyle>
            +{GetValue(info.incomeEnergy, info.loseEnergy)} {t('Energy')}
          </TextStyle>
          <TextStyle>
            +{GetValue(info.incomeStone, info.loseStone)} {t('Ore')}
          </TextStyle>
          <TextStyle>
            +{GetValue(info.incomePopulation, info.losePopulation)}{' '}
            {t('Population')}
          </TextStyle>
        </FlexStyle>
      </Box>
    </CardBox>
  );
};
