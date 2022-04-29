import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import {
  Box,
  Text,
  BgCard,
  Flex,
  Card,
  Image,
  Button,
  Skeleton,
  Dots,
} from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
  MysteryBoxQualities,
} from 'components/MysteryBoxCom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TokenImage } from 'components/TokenImage';
import { getBalanceNumber } from 'utils/formatBalance';
import { getDsgAddress } from 'utils/addressHelpers';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { mysteryConfig } from 'components/MysteryBoxCom/config';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import { useBuyMysteryBox, useOpenMysteryBox } from './hooks';
import OpenModal from './components/OpenModal';
import { queryMintEvent } from './event';

const CardStyled = styled(Card)`
  width: 600px;
  height: 145px;
  padding-left: 35px;
`;

const MysteryBoxState = () => {
  const paramsQs = useParsedQueryString();
  const navigate = useNavigate();

  useFetchBoxView();
  const { priceBNB, seedBlocks, loading } = useStore(p => p.mysteryBox.boxView);
  const { account } = useWeb3React();
  const { t } = useTranslation();

  const quality = useMemo(() => {
    const q = Number(paramsQs.q) as MysteryBoxQualities;

    if (Object.values(mysteryBoxQualities).includes(q)) return q;
    return mysteryBoxQualities.ORDINARY;
  }, [paramsQs.q]);
  const price = useMemo(() => {
    return getBalanceNumber(new BigNumber(priceBNB[quality]), 18);
  }, [priceBNB, quality]);

  const [bought, setBought] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const { handleBuy } = useBuyMysteryBox();
  const onHandleBuy = useCallback(async () => {
    try {
      setHandleLoading(true);
      const res = await handleBuy(quality, priceBNB[quality]);
      setHandleLoading(false);
      setBought(true);
    } catch (error) {
      setHandleLoading(false);

      console.error(error);
    }
  }, [quality, handleBuy, priceBNB, setBought, setHandleLoading]);

  const { handleOpen } = useOpenMysteryBox();
  const [visible, setVisible] = useState(false);
  const [openedBox, setOpenedBox] = useState(false);

  const fetchHandle = useCallback(async () => {
    if (account) {
      const event = await queryMintEvent(account);
      return event;
    }
    return [];
  }, [account]);

  // 递归扫描获得星球id
  const getPlanetId = useCallback(
    async (blockHash: string) => {
      const event = await fetchHandle();
      if (!blockHash || !event.length) return null;
      const index = event.findIndex(
        item => item.blockHash?.toLowerCase() === blockHash.toLowerCase(),
      );
      if (index === -1) {
        getPlanetId(blockHash);
      }
      const planetId = event[index]?.args?.planetId;
      return new BigNumber(planetId.toJSON().hex).toNumber();
    },
    [fetchHandle],
  );

  const onHandleOpen = useCallback(
    async name => {
      try {
        const res = await handleOpen(quality, name);
        // const event = await fetchHandle();
        const planetId = await getPlanetId(res?.blockHash);
        // 盲盒打开特效视频
        setOpenedBox(true);
        setBought(false);
        setTimeout(() => {
          setVisible(false);
          navigate(`/mystery-box/detail?i=${planetId}`);
        }, 3000);
      } catch (error) {
        console.error(error);
      }
    },
    [quality, handleOpen, setBought, navigate, getPlanetId],
  );

  useEffect(() => {
    fetchHandle();
  }, [fetchHandle]);

  const existBox = useMemo(() => {
    return Boolean(Number(seedBlocks[quality])) || bought;
  }, [seedBlocks, quality, bought]);

  return (
    <Layout>
      {/* <Dashboard /> */}
      <BgCard margin='auto' variant='longMedium'>
        <Flex alignItems='center' justifyContent='center'>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality={quality} />
            <MysteryBoxBoxStyled quality={quality} />
          </MysteryBoxStyled>
          <Box>
            <CardStyled>
              <Flex height='100%' alignItems='center'>
                <Box width={100}>
                  <Image
                    width={100}
                    height={100}
                    src={`/images/mystery-box/g-${mysteryConfig[quality]?.srcName}.png`}
                  />
                </Box>
                <Box ml='20px'>
                  <Text fontSize='24px' color='textTips'>
                    {mysteryConfig[quality]?.label}
                  </Text>
                  <Text>{mysteryConfig[quality]?.tips}</Text>
                </Box>
              </Flex>
            </CardStyled>
            <CardStyled mt='23px'>
              {existBox ? (
                <Flex height='100%' justifyContent='center' alignItems='center'>
                  <Text color='textTips'>
                    {t('The purchase is successful, try your luck now!')}
                  </Text>
                </Flex>
              ) : (
                <Flex height='100%' alignItems='center'>
                  <Box width={100}>
                    <TokenImage
                      width={80}
                      height={80}
                      tokenAddress={getDsgAddress()}
                    />
                  </Box>
                  <Box ml='20px'>
                    <Text color='textTips'>{t('ValueBNB')} BNB</Text>
                    {loading ? <Skeleton height={40} /> : <Text>{price} </Text>}
                  </Box>
                </Flex>
              )}
            </CardStyled>
            <Flex mt='34px' justifyContent='center'>
              {existBox ? (
                <Button
                  disabled={handleLoading || loading}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  {handleLoading ? (
                    <Dots>{t('Opening')}</Dots>
                  ) : (
                    <Text fontSize='inherit'>{t('Open the blind box')}</Text>
                  )}
                </Button>
              ) : (
                <Button
                  disabled={handleLoading || loading}
                  onClick={onHandleBuy}
                >
                  {handleLoading ? (
                    <Dots>{t('Purchasing')}</Dots>
                  ) : (
                    <Text fontSize='inherit'>{t('Buy blind box')}</Text>
                  )}
                </Button>
              )}
            </Flex>
          </Box>
        </Flex>
      </BgCard>
      <OpenModal
        visible={visible}
        openedBox={openedBox}
        quality={quality}
        onClose={() => {
          setVisible(false);
          setOpenedBox(false);
        }}
        onOpen={onHandleOpen}
      />
    </Layout>
  );
};

export default MysteryBoxState;
