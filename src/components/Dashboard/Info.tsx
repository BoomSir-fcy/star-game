import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Text, Image } from 'uikit';
import { useStore } from 'state/util';
import { TokenImage } from 'components/TokenImage';
import { getDsgAddress } from 'utils/addressHelpers';
import StarCom from 'components/StarCom';
import Modal from 'components/Modal';
import DepositWithdrawal from 'components/NavPop/DepositWithdrawal';
import { UserBalanceView } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';

const ButtonLeft = styled(Button)`
  width: 274px;
  height: 52px;
  padding: 0;
`;

const ButtonTag1 = styled(Button)`
  width: 274px;
  padding: 0;
  height: 110px;
`;
const ButtonTag2 = styled(Button)`
  width: 323px;
  height: 110px;
  padding: 0;
`;

interface InfoProps extends ButtonGroupProps {
  onTodo?: () => void;
}

const Info: React.FC<InfoProps> = ({ onRefresh, onBack, children, onTodo }) => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [ActiveToken, setActiveToken] = useState<UserBalanceView>();

  const Balance = useStore(p => p.userInfo.userBalance);
  const Product = useStore(p => p.userInfo.userProduct);

  const DSGblance = useMemo(() => {
    const balance = Balance.filter(item => {
      return item.symbol === 'DSG';
    });
    return balance[0];
  }, [Balance]);

  const BOXblance = useMemo(() => {
    const balance = Balance.filter(item => {
      return item.symbol === 'BOX';
    });
    return balance[0];
  }, [Balance]);

  return (
    <Box width='100%'>
      <Flex height='179px' width='100%'>
        <Box width='312px' pl='20px' pt='22px'>
          <ButtonLeft
            onClick={() => {
              setActiveToken(DSGblance);
              setVisible(true);
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex flex={1}>
                <TokenImage
                  width={45}
                  height={48}
                  tokenAddress={getDsgAddress()}
                />
                <Text mt='8px' ml='8px'>
                  {DSGblance?.amount}
                </Text>
              </Flex>
              <Text mt='8px'>{DSGblance?.symbol}</Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              setActiveToken(BOXblance);
              setVisible(true);
            }}
            mt='28px'
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex flex={1}>
                <TokenImage
                  width={45}
                  height={48}
                  tokenAddress={getDsgAddress()}
                />
                <Text mb='8px' ml='8px'>
                  {BOXblance?.amount}
                </Text>
              </Flex>
              <Text mb='8px'>{BOXblance?.symbol}</Text>
            </Flex>
          </ButtonLeft>
        </Box>
        <Flex ml='16px' pt='32px'>
          <Box>
            <Link to='/star/planet'>
              <ButtonTag1 variant='custom'>
                <Flex alignItems='center' width='100%'>
                  <StarCom variant='none' ml='16px' />
                  <Box>
                    <Text textAlign='left'>{t('Planets')}</Text>
                    <Text textAlign='left'>{Product.planet_num}</Text>
                  </Box>
                </Flex>
              </ButtonTag1>
            </Link>
          </Box>
          <Box ml='22px'>
            <ButtonTag2 variant='custom'>
              <Flex pl='8px' alignItems='center' width='100%'>
                <Box width={70}>
                  <Image
                    src='/images/commons/dashboard/collect.png'
                    width={70}
                    height={70}
                  />
                </Box>
                <Box ml='8px'>
                  <Text textAlign='left'>
                    {t('Total capacity')}: {Product.stone_product}/s
                  </Text>
                  <Text textAlign='left'>
                    {t('Total ore')}: {Product.stone}
                  </Text>
                </Box>
              </Flex>
            </ButtonTag2>
            <ButtonTag2 ml='8px' variant='custom'>
              <Flex pl='8px' alignItems='center' width='100%'>
                <Box width={70}>
                  <Image
                    src='/images/commons/dashboard/p.png'
                    width={70}
                    height={70}
                  />
                </Box>
                <Box ml='8px'>
                  <Text textAlign='left'>
                    {t('Total capacity')}: {Product.population_product}/s
                  </Text>
                  <Text textAlign='left'>
                    {t('Total population')}: {Product.population}
                  </Text>
                </Box>
              </Flex>
            </ButtonTag2>
            <Link to='/test/card'>
              <ButtonTag2 variant='custom' ml='8px'>
                <Flex pl='8px' alignItems='center' width='100%'>
                  <Box width={70}>
                    <Image
                      src='/images/commons/dashboard/item.png'
                      width={70}
                      height={70}
                    />
                  </Box>
                  <Box ml='8px'>
                    <Text textAlign='left'>
                      {t('Total capacity')}: {Product.energy_product}/s
                    </Text>
                    <Text textAlign='left'>
                      {t('Total energy')}: {Product.energy}
                    </Text>
                  </Box>
                </Flex>
              </ButtonTag2>
            </Link>
          </Box>
        </Flex>
      </Flex>
      <Flex
        // height='80px'
        justifyContent='space-between'
        alignItems='center'
        mt='18px'
      >
        <Box height={80}>{children}</Box>
        <ButtonGroup onRefresh={onRefresh} onBack={onBack} />
      </Flex>
      <Modal
        title={`${ActiveToken?.symbol}钱包`}
        visible={visible}
        setVisible={setVisible}
      >
        <DepositWithdrawal
          close={() => {
            setVisible(false);
          }}
          TokenInfo={ActiveToken}
        />
      </Modal>
    </Box>
  );
};

export default Info;
