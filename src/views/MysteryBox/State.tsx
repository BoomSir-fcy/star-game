import React from 'react';
import { Box, Text, BgCard, Flex, Card, Image, Button } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
} from 'components/MysteryBoxCom';
import styled from 'styled-components';
import { TokenImage } from 'components/TokenImage';
import { getDsgAddress } from 'utils/addressHelpers';

const CardStyled = styled(Card)`
  width: 600px;
  height: 145px;
  padding-left: 35px;
`;

const MysteryBoxState = () => {
  return (
    <Layout>
      <Dashboard />
      <BgCard margin='auto' variant='longMedium'>
        <Flex alignItems='center' justifyContent='center'>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality='super' />
            <MysteryBoxBoxStyled quality='super' />
          </MysteryBoxStyled>
          <Box>
            <CardStyled>
              <Flex height='100%' alignItems='center'>
                <Box width={100}>
                  <Image
                    width={100}
                    height={100}
                    src={`/images/mystery-box/g-${'super'}.png`}
                  />
                </Box>
                <Box ml='20px'>
                  <Text fontSize='24px' color='textTips'>
                    普通
                  </Text>
                  <Text>阿萨大厦</Text>
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
                  <Text color='textTips'>价值 DSG</Text>
                  <Text>100 </Text>
                </Box>
              </Flex>
            </CardStyled>
            <Flex mt='34px' justifyContent='center'>
              <Button>购买盲盒</Button>
            </Flex>
          </Box>
        </Flex>
      </BgCard>
    </Layout>
  );
};

export default MysteryBoxState;
