import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Text, Image } from 'uikit';
import { useStore } from 'state/util';
import { TokenImage } from 'components/TokenImage';
import { getBoxAddress, getDsgAddress } from 'utils/addressHelpers';
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
  className?: string;
}

const Info: React.FC<InfoProps> = ({
  onRefresh,
  onBack,
  children,
  onTodo,
  className,
}) => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [ActiveToken, setActiveToken] = useState<UserBalanceView>();

  const Balance = useStore(p => p.userInfo.userBalance);
  const Product = useStore(p => p.userInfo.userProduct);

  // const DSGblance = useMemo(() => {
  //   const balance = Balance.filter(item => {
  //     return item.symbol === 'DSG';
  //   });
  //   return balance[0];
  // }, [Balance]);

  // const BOXblance = useMemo(() => {
  //   const balance = Balance.filter(item => {
  //     return item.symbol === 'BOX';
  //   });
  //   return balance[0];
  // }, [Balance]);

  // const BNBblance = useMemo(() => {
  //   const balance = Balance.filter(item => {
  //     return item.symbol === 'BNB';
  //   });
  //   return balance[0];
  // }, [Balance]);

  const TokenBlance = useCallback(
    (Token: string) => {
      const balance = Balance.filter(item => {
        return item.symbol === Token;
      });
      return balance[0];
    },
    [Balance],
  );

  return (
    <Box width='100%'>
      <Flex height='179px' width='100%'>
        <Box
          width='312px'
          height='250px'
          pl='20px'
          pt='28px'
          className='header_asset'
        >
          <ButtonLeft
            onClick={() => {
              setActiveToken(TokenBlance('DSG'));
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
                <Text fontSize='20px' mt='8px' ml='8px'>
                  {TokenBlance('DSG')?.amount}
                </Text>
              </Flex>
              <Text fontSize='20px'>{TokenBlance('DSG')?.symbol}</Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              setActiveToken(TokenBlance('BOX'));
              setVisible(true);
            }}
            mt='18px'
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex flex={1}>
                <TokenImage
                  width={45}
                  height={48}
                  tokenAddress={getBoxAddress()}
                />
                <Text fontSize='20px' mt='8px' ml='8px'>
                  {TokenBlance('BOX')?.amount}
                </Text>
              </Flex>
              <Text mt='-2px' fontSize='20px'>
                {TokenBlance('BOX')?.symbol}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              setActiveToken(TokenBlance('BNB'));
              setVisible(true);
            }}
            mt='18px'
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex flex={1}>
                <TokenImage width={45} height={48} tokenAddress='BNB' />
                <Text fontSize='20px' mt='8px' ml='8px'>
                  {TokenBlance('BNB')?.amount}
                </Text>
              </Flex>
              <Text mt='-2px' fontSize='20px'>
                {TokenBlance('BNB')?.symbol}
              </Text>
            </Flex>
          </ButtonLeft>
        </Box>
        <Flex ml='16px' pt='32px'>
          <Box>
            <Link to='/star/planet'>
              <ButtonTag1 variant='custom' className={className}>
                <Flex pt='16px' alignItems='center' width='100%'>
                  <StarCom margin='0 16px' variant='none' scale='sm' />
                  <Box>
                    <Text fontSize='20px' textAlign='left'>
                      {t('Planet Count')}
                    </Text>
                    <Text textAlign='left'>{Product.planet_num}</Text>
                  </Box>
                </Flex>
              </ButtonTag1>
            </Link>
          </Box>
          <Box ml='22px' className='header_resource'>
            <ButtonTag2
              variant='custom'
              onClick={() => {
                setActiveToken(TokenBlance('ORE'));
                setVisible(true);
              }}
            >
              <Flex pl='8px' alignItems='center' width='100%'>
                <Box width={70}>
                  <Image
                    src='/images/commons/icon/icon_minera.png'
                    width={70}
                    height={70}
                  />
                </Box>
                <Box ml='8px'>
                  <Text fontSize='20px' mb='20px' textAlign='left'>
                    {t('Capacity')}: {Product.stone_product}/s
                  </Text>
                  <Text fontSize='20px' textAlign='left'>
                    {t('Ore ')}: {Product.stone}
                  </Text>
                </Box>
              </Flex>
            </ButtonTag2>
            <ButtonTag2
              ml='8px'
              variant='custom'
              onClick={() => {
                setActiveToken(TokenBlance('POP'));
                setVisible(true);
              }}
            >
              <Flex pl='8px' alignItems='center' width='100%'>
                <Box width={70}>
                  <Image
                    src='/images/commons/icon/icon_spice.png'
                    width={70}
                    height={70}
                  />
                </Box>
                <Box ml='8px'>
                  <Text fontSize='20px' mb='20px' textAlign='left'>
                    {t('Capacity')}: {Product.population_product}/s
                  </Text>
                  <Text fontSize='20px' textAlign='left'>
                    {t('Population ')}: {Product.population}
                  </Text>
                </Box>
              </Flex>
            </ButtonTag2>
            {/* <Link to='/test/card'> */}
            <ButtonTag2
              variant='custom'
              ml='8px'
              onClick={() => {
                setActiveToken(TokenBlance('ENG'));
                setVisible(true);
              }}
            >
              <Flex pl='8px' alignItems='center' height='100%' width='100%'>
                <Box width={70}>
                  <Image
                    src='/images/commons/icon/icon_energy.png'
                    width={70}
                    height={70}
                  />
                </Box>
                <Box ml='8px'>
                  <Text fontSize='20px' mb='20px' textAlign='left'>
                    {t('Capacity')}: {Product.energy_product}/s
                  </Text>
                  <Text fontSize='20px' textAlign='left'>
                    {t('Energy ')}: {Product.energy}
                  </Text>
                </Box>
              </Flex>
            </ButtonTag2>
            {/* </Link> */}
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
        title={`${ActiveToken?.symbol} ${t('Wallet')}`}
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
