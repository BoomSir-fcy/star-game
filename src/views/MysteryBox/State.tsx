import React, { useCallback, useMemo, useState } from 'react';
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
  Input,
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
import { TokenImage } from 'components/TokenImage';
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance';
import { getDsgAddress } from 'utils/addressHelpers';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { mysteryConfig } from 'components/MysteryBoxCom/config';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useStore } from 'state';
import { useBuyMysteryBox, useOpenMysteryBox } from './hooks';
import OpenModal from './components/OpenModal';

const CardStyled = styled(Card)`
  width: 600px;
  height: 145px;
  padding-left: 35px;
`;

const MysteryBoxState = () => {
  const paramsQs = useParsedQueryString();

  useFetchBoxView();
  const { priceBNB, seedBlocks, loading } = useStore(p => p.mysteryBox.boxView);

  const quality = useMemo(() => {
    const q = Number(paramsQs.q) as MysteryBoxQualities;

    if (Object.values(mysteryBoxQualities).includes(q)) return q;
    return mysteryBoxQualities.ORDINARY;
  }, [paramsQs.q]);
  const price = useMemo(() => {
    console.log(priceBNB[quality], 'priceBNB');
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
  const onHandleOpen = useCallback(
    async name => {
      try {
        const res = await handleOpen(quality, name);
        setBought(false);
        setVisible(false);
      } catch (error) {
        console.error(error);
      }
    },
    [quality, handleOpen, setBought],
  );

  const existBox = useMemo(() => {
    return Boolean(Number(seedBlocks[quality])) || bought;
  }, [seedBlocks, quality, bought]);

  return (
    <Layout>
      <Dashboard />
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
              <Flex height='100%' alignItems='center'>
                <Box width={100}>
                  <TokenImage
                    width={80}
                    height={80}
                    tokenAddress={getDsgAddress()}
                  />
                </Box>
                <Box ml='20px'>
                  <Text color='textTips'>价值 BNB</Text>
                  {loading ? <Skeleton height={40} /> : <Text>{price} </Text>}
                </Box>
              </Flex>
            </CardStyled>
            <Input
              style={{ borderRadius: '50%' }}
              width={200}
              height={200}
              primary
            />

            <Flex mt='34px' justifyContent='center'>
              {existBox ? (
                <Button
                  disabled={handleLoading || loading}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  {handleLoading ? <Dots>正在打开</Dots> : '打开盲盒'}
                </Button>
              ) : (
                <Button
                  disabled={handleLoading || loading}
                  onClick={onHandleBuy}
                >
                  {handleLoading ? <Dots>购买中</Dots> : '购买盲盒'}
                </Button>
              )}
            </Flex>
          </Box>
        </Flex>
      </BgCard>
      <OpenModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onOpen={onHandleOpen}
      />
    </Layout>
  );
};

export default MysteryBoxState;
