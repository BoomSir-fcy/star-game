import React, { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import MiniSwap from 'libs/mini-swap';

import { Box, Text, Flex, LinkExternal } from 'uikit';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'contexts/Localization';
import useTheme from 'hooks/useTheme';
import { useConnectWallet } from 'contexts/ConnectWallet';
import { getBoxAddress, getWEtherAddress } from 'utils/addressHelpers';
import resetTheme from './resetTheme';
import RightWarp from './RightWarp';

const Swap = () => {
  const { chainId } = useWeb3React();
  const { t, currentLanguage, getHTML } = useTranslation();

  const isDark = true;
  const { onConnectWallet } = useConnectWallet();

  const handleInputChange = useCallback(currency => {
    console.debug(currency);
  }, []);

  const outputCurrencyId = useMemo(() => {
    // const ETHER = getWEtherAddress;
    return getBoxAddress();
  }, []);

  const { theme } = useTheme();

  return (
    <>
      <Box
        // maxWidth={506}
        margin='auto'
        height='500vh'
        paddingTop='calc(250vh - 200px)'
        style={{ transform: 'scale(1.2)' }}
      >
        <Box padding={35} pt='0' maxWidth={506} margin='auto'>
          <MiniSwap
            // titlehelper={t(
            //   "When you search for some topics about tokens, the platform will automatically provide token quick swap function, providing one-stop crypto services. Right now Metatime supports mainstream digital tokens, and will continue to access more tokens, please look forward to staking function.t"
            // )}
            powered={
              <Flex padding='0 20px 20px'>
                <Text>{t('Powered by')} &nbsp;</Text>
                <LinkExternal
                  height='24px'
                  fontSize='16px'
                  href='https://dsgmetaverse.com/'
                >
                  DSGmetaverse
                </LinkExternal>
              </Flex>
            }
            // subTitleTips={<Text>推荐自@0x526w.....已自动为您匹配$To ken$</Text>}
            onInputCurrencyChange={handleInputChange}
            outputCurrencyId={outputCurrencyId}
            // inputCurrencyId={inputCurrencyId}
            resetTheme={resetTheme}
            onConnectWallet={onConnectWallet}
            chainId={chainId}
            isDark={isDark}
            lang={currentLanguage.locale}
          />
        </Box>
      </Box>
      <RightWarp top='calc(250vh - 200px) !important'>
        <Box height='100%' overflow='auto'>
          <Text bold mark mt='8px'>
            {t('Tips')}
          </Text>
          <Text mt='8px'>1 {t('swap-tips1')} </Text>
          <Text mt='8px'>
            2{' '}
            {getHTML('swap-tips2', {
              link: `<a style="color: ${theme.colors.textPrimary}" target="_blank" href='https://crypto-galaxy-1.gitbook.io/crypto-galaxy/tokenomics/core-token-box'>https://crypto-galaxy-1.gitbook.io/crypto-galaxy/tokenomics/core-token-box</a>`,
            })}
            {/* <Text
              color="primary"
              as="a"
              target="_blank"
              href="https://crypto-galaxy-1.gitbook.io/crypto-galaxy/tokenomics/core-token-box"
            >
              https://crypto-galaxy-1.gitbook.io/crypto-galaxy/tokenomics/core-token-box
            </Text>
            ）。 */}
          </Text>
          <Text mt='8px'>
            <Text mt='8px'>3 {t('swap-tips3')} </Text>
          </Text>
        </Box>
      </RightWarp>
    </>
  );
};

export default Swap;
