import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image } from 'uikit';
import StarCom from 'components/StarCom';
import { useTranslation } from 'contexts/Localization';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link } from 'react-router-dom';
import { parseZip } from 'utils';
import { useDispatch } from 'react-redux';
import { setPKInfo } from 'state/game/reducer';
import { useWeb3React } from '@web3-react/core';
import { PkResult } from './components/PkResult';

dayjs.extend(utc);

const CardBox = styled(Card)`
  width: 820px;
  height: 240px;
  padding: 22px 30px;
  margin-bottom: 20px;
`;

const PlayImg = styled.img``;

export const PkBox: React.FC<{
  info: any;
}> = ({ info }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  const BoxList = useMemo(() => {
    const List = [
      {
        title: t('Get Ore'),
        img: '/images/commons/icon/icon_minera.png',
        num: info.ore,
      },
      {
        title: t('Get Energy'),
        img: '/images/commons/icon/icon_energy.png',
        num: info.incomeEnergy,
      },
      {
        title: t('Attrition combat unit'),
        img: '/images/commons/star/HP.png',
        num:
          account?.toLocaleLowerCase() === info.fromAddress.toLocaleLowerCase()
            ? info.blueLoseUnit
            : info.redLoseUnit,
      },
      {
        title: t('Lose Building Durability'),
        img: '/images/commons/star/durability.png',
        num: info.success ? 0 : info.lostDurability,
      },
    ];
    return List;
  }, [t, info, account]);

  const pkRes = useMemo(() => {
    return account?.toLocaleLowerCase() === info.fromAddress.toLocaleLowerCase()
      ? info.success
      : !info.success;
  }, [account, info.fromAddress, info.success]);

  return (
    <CardBox>
      <Flex>
        <PkResult result={pkRes} />
        <Flex ml='29px' flex='1' flexDirection='column'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text fontSize='20px'>
              {dayjs.unix(info.createTime).format('YY-MM-DD HH:mm:ss')}
            </Text>
            <Link
              onClick={event => {
                try {
                  dispatch(setPKInfo(JSON.parse(parseZip(info.detail))));
                  dispatch(setPKRes(pkRes));
                } catch (error) {
                  event.preventDefault();
                  console.log('解析报错');
                }
              }}
              to={`/plunder-pk?id=${info.id}`}
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
                    {index < 2 ? '+ ' : '- '}
                    {item.num}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </CardBox>
  );
};
function setPKRes(detail: any): any {
  throw new Error('Function not implemented.');
}
