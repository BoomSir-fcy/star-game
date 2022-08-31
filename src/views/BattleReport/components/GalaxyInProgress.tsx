import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, MarkText, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { GalaxReportListView } from 'state/types';
import { shortenAddress } from 'utils/contract';
import { Link } from 'react-router-dom';
import { setPKInfo, setPKRes } from 'state/game/reducer';
import { parseZip } from 'utils';

import { PkResult } from './PkResult';

dayjs.extend(utc);

const CardBox = styled(Flex)`
  position: relative;
  width: 500px;
  height: 100%;
  padding: 22px 30px;
  border-right: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  flex-direction: column;
  justify-content: space-between;
`;

const ArrowImg = styled.img`
  width: 30px;
  height: 20px;
`;

const PlayImg = styled.img``;

const MarkTextStyle = styled(MarkText)`
  padding: 0;
  font-style: normal;
  font-weight: bold;
`;

export const GalaxyInProgress: React.FC<{
  info?: GalaxReportListView;
}> = ({ info }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  const IsFrom = useMemo(() => {
    return (
      info?.fromAddress.toLocaleLowerCase() === account.toLocaleLowerCase()
    );
  }, [info, account]);

  // 战斗成功还是失败
  const BettleResult = useMemo(() => {
    if (IsFrom) {
      return info.success ? !!info.success : !info.success;
    }
    return info.success ? !info.success : !!info.success;
  }, [info, IsFrom]);

  return (
    <>
      <GraphicsCard
        style={{ padding: 0, border: 'none' }}
        width='max-content'
        height='auto'
        stripe
      >
        <CardBox>
          <Flex mb='20px' justifyContent='center'>
            <MarkText padding={0} fontStyle='normal' fontSize='20px' bold>
              {t('Occupy Star Report')}
            </MarkText>
          </Flex>
          <Flex mb='16px' justifyContent='space-between' alignItems='baseline'>
            <Flex>
              <Text mr='20px'>{t('Ends in:')}</Text>
              <Text>
                {dayjs.unix(info?.battleTime).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </Flex>
            {IsFrom ? (
              <Text color='progressGreenBar' fontSize='16px'>
                {t('ToOccupy')}
              </Text>
            ) : (
              <Text fontSize='16px' color='redText'>
                {t('Occupied')}
              </Text>
            )}
          </Flex>
          <Flex mb='16px' alignItems='center'>
            <Text mr='10px'>{t('Star Name')}:</Text>
            <MarkTextStyle mr='10px'>
              {info?.name}
              {/* {t('星系')} */}
            </MarkTextStyle>
            <ArrowImg src='/images/commons/icon/to-arrow.png' />
            <MarkTextStyle ml='10px'>
              #{info.number}&nbsp;
              {t('Star')}
            </MarkTextStyle>
          </Flex>
          <Flex alignItems='center'>
            <Text mr='10px'>{t('Battle Results')}:</Text>
            <Text color={BettleResult ? 'progressGreenBar' : 'redText'}>
              {IsFrom ? t('ToOccupy') : t('Occupied')}&nbsp;
              {BettleResult ? t('Success') : t('Fail')}
            </Text>
          </Flex>
        </CardBox>
      </GraphicsCard>
      <CardBox>
        <Flex height='100%' alignItems='center'>
          <PkResult result={BettleResult} />
          <Flex flexDirection='column' flex={1} ml='30px' height='100%'>
            <Flex mb={20} justifyContent='space-between' alignItems='center'>
              <MarkTextStyle>{t('Occupy Star Dashboard')}</MarkTextStyle>
              <Link
                onClick={event => {
                  try {
                    dispatch(setPKInfo(parseZip(info.detail)));
                    dispatch(setPKRes(BettleResult));
                  } catch (error) {
                    event.preventDefault();
                    console.log('解析报错');
                    console.error(error);
                  }
                }}
                to={`/plunder-pk?id=${info.id}&pid0=${
                  !IsFrom ? info.fromAddress : info.toAddress
                }`}
              >
                <PlayImg src='/images/battleReport/play.png' alt='' />
              </Link>
            </Flex>
            <Flex mb='10px' justifyContent='space-between'>
              <Text mr='10px'>{t('Planets in Battle')}:</Text>
              <Text>
                {info.planetId.substring(0, info.planetId.lastIndexOf(','))}
              </Text>
            </Flex>
            <Flex mb='10px' justifyContent='space-between'>
              <Text mr='10px'>{t('Challenger')}:</Text>
              <Box>
                <Text textAlign='right'>
                  {shortenAddress(IsFrom ? info.toAddress : info.fromAddress)}
                </Text>
                <Text textAlign='right'>{` ( ${t('Power')}: ${
                  info.power
                } )`}</Text>
              </Box>
            </Flex>
            <MarkTextStyle mb='6px'>{t('Battle Losses')}:</MarkTextStyle>
            <Flex justifyContent='space-between'>
              <Text>
                -{info.loseUnit} {t('Battle Unit')}
              </Text>
              <Text>
                -{info.loseDurability} {t('Building’s END')}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </CardBox>
    </>
  );
};
