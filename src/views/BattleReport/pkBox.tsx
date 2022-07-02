import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link } from 'react-router-dom';
import { parseZip } from 'utils';
import { useDispatch } from 'react-redux';
import { setPKInfo, setPKRes } from 'state/game/reducer';
import { useWeb3React } from '@web3-react/core';
import { PlunderInfo } from 'state/types';
import { PkResult } from './components/PkResult';

dayjs.extend(utc);

const CardBox = styled(Flex)`
  min-width: 490px;
  height: 100%;
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
  info: PlunderInfo;
}> = ({ info }) => {
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
    <CardBox>
      <Flex>
        <PkResult result={pkRes} />
        <Flex
          ml='46px'
          mr='80px'
          flexDirection='column'
          justifyContent='space-around'
        >
          <Box>
            <Text>{t('Battle planet number')}</Text>
            <Text>NO.{info.id}</Text>
          </Box>
          <Box>
            <Text>{t('End Time')}</Text>
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
        {/* <Flex ml='29px' flex='1' flexDirection='column'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text fontSize='20px'>
              {dayjs.unix(info.createTime).format('YY-MM-DD HH:mm:ss')}
            </Text>
            <Link
              onClick={event => {
                try {
                  console.log(parseZip(info.detail), 'parseZip(info.detail)');
                  dispatch(setPKInfo(parseZip(info.detail)));
                  dispatch(setPKRes(pkRes));
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
          <Flex flexWrap='wrap' height='100%' alignItems='stretch'>
            {BoxList.map((item, index) => (
              <Flex width='50%' key={item.title}>
                <Image src={item.img} width={54} height={55} />
                <Box ml='24px'>
                  <Text fontSize='18px'>{item.title}</Text>
                  <Text
                    fontSize='20px'
                    shadow={index < 2 ? 'green' : 'secondary'}
                  >
                    {index < 2 ? '+ ' : ''}
                    {item.num || 0}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex> */}
      </Flex>
      <Box>
        <TextStyle mb='8px'>{t('Battle attrition')} :</TextStyle>
        <FlexStyle mb='8px'>
          <TextStyle>
            -{isFrom ? info.blueLoseUnit : info.redLoseUnit} {t('Combat unit')}
          </TextStyle>
          <TextStyle style={{ width: '60%' }}>
            -{LostDurability} {t('Building durability')}
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
        <TextStyle mb='8px'>{t('Get resources')} :</TextStyle>
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
