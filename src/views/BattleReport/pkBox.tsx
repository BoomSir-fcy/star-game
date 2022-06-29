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

  const GetValue = useCallback(
    (loseNum: number, inComeNum: number) => {
      let num = 0;
      if (isFrom) {
        num = info.success ? inComeNum : loseNum;
      } else {
        num = info.success ? loseNum : inComeNum;
      }
      return num;
    },
    [isFrom, info.success],
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
            <Text>{t('战斗星球编号')}</Text>
            <Text>NO.{info.id}</Text>
          </Box>
          <Box>
            <Text>{t('结束时间')}</Text>
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
        <TextStyle mb='8px'>{t('战斗损耗 ')}:</TextStyle>
        <FlexStyle mb='8px'>
          <TextStyle>
            -{isFrom ? info.blueLoseUnit : info.redLoseUnit} {t('战斗单位')}
          </TextStyle>
          <TextStyle>
            -{isFrom ? info.lostDurability : 0} {t('建筑耐久度')}
          </TextStyle>
        </FlexStyle>
        <FlexStyle>
          <TextStyle>
            -{GetValue(0, info.incomeEnergy)} {t('Energy')}
          </TextStyle>
          <TextStyle>
            -{GetValue(0, info.incomeStone)} {t('Ore')}
          </TextStyle>
          <TextStyle>
            -{GetValue(0, info.incomePopulation)} {t('Population')}
          </TextStyle>
        </FlexStyle>
      </Box>
      <Box>
        <TextStyle mb='8px'>{t('获得资源 ')}:</TextStyle>
        <FlexStyle>
          <TextStyle>
            +{GetValue(0, info.incomeEnergy)} {t('Energy')}
          </TextStyle>
          <TextStyle>
            +{GetValue(0, info.incomeEnergy)} {t('Ore')}
          </TextStyle>
          <TextStyle>
            +{GetValue(0, info.incomeEnergy)} {t('Population')}
          </TextStyle>
        </FlexStyle>
      </Box>
    </CardBox>
  );
};
