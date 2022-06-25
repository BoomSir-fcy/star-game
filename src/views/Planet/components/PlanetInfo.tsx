import StarCom from 'components/StarCom';
import React from 'react';
import styled from 'styled-components';
import { Button, Text, Flex, Box, GraphicsCard, Image } from 'uikit';

const InfoFlex = styled(Flex)`
  margin-top: 13px;
  flex-wrap: wrap;
  & > :nth-child(n) {
    margin-bottom: 14px;
  }
`;
const InfoValueFlex = styled(Flex)`
  width: 207px;
`;
const ImageStyled = styled.img`
  width: 45px;
  height: 45px;
`;
const TextStyled = styled(Text)`
  width: max-content;
`;
const PlanetInfo = () => {
  return (
    <GraphicsCard padding='29px 37px' borderWidth={2}>
      <Flex justifyContent='space-between'>
        <Box>
          <Flex mb='17px' justifyContent='center' alignItems='center'>
            <Text fontSize='24px' bold>
              传说
            </Text>
            <Text ml='17px' fontSize='18px' bold>
              Lv1
            </Text>
          </Flex>
          <StarCom showUnion />
        </Box>

        <Box ml='45px'>
          <Flex justifyContent='flex-end' alignItems='center'>
            <Text>战斗力</Text>
            <Text ml='20px' mark fontStyle='normal' fontSize='20px' bold>
              6,633,962
            </Text>
            <Image
              ml='10px'
              width={25}
              height={25}
              src='/images/commons/icon/help-new.png'
            />
          </Flex>
          <InfoFlex>
            <InfoValueFlex alignItems='center'>
              <ImageStyled src='/images/commons/icon/icon_minera.png' />
              <Box ml='10px'>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    产能
                  </TextStyled>
                  <TextStyled ml='10px' small ellipsis>
                    0.32/s
                  </TextStyled>
                </Flex>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    矿石
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    10/100
                  </TextStyled>
                </Flex>
              </Box>
            </InfoValueFlex>
            <InfoValueFlex alignItems='center'>
              <ImageStyled src='/images/commons/icon/icon_spice.png' />
              <Box ml='10px'>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    产能
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    0.32/s
                  </TextStyled>
                </Flex>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    香料
                  </TextStyled>
                  <TextStyled ml='10px' small ellipsis>
                    10/100
                  </TextStyled>
                </Flex>
              </Box>
            </InfoValueFlex>
            <InfoValueFlex alignItems='center'>
              <ImageStyled src='/images/commons/icon/icon_energy.png' />
              <Box ml='10px'>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    产能
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    0.32/s
                  </TextStyled>
                </Flex>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    能量
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    10/100
                  </TextStyled>
                </Flex>
              </Box>
            </InfoValueFlex>
            <InfoValueFlex flexDirection='column'>
              <Flex>
                <Text color='textTips' small>
                  建筑数
                </Text>
                <Text ml='8px' small>
                  20
                </Text>
              </Flex>
              <Flex>
                <Text color='textTips' small>
                  兵种总数
                </Text>
                <Text ml='8px' small>
                  20
                </Text>
              </Flex>
            </InfoValueFlex>
            <InfoValueFlex alignItems='center'>
              <Image
                ml='4px'
                width={46}
                height={46}
                src='/images/commons/human.png'
              />
              <Text fontSize='18px' ml='15px' bold>
                人族
              </Text>
            </InfoValueFlex>
            <Button width='212px' height='53px' variant='purple'>
              <Text color='textPrimary' bold>
                管理
              </Text>
            </Button>
          </InfoFlex>
        </Box>
      </Flex>
    </GraphicsCard>
  );
};

export default PlanetInfo;
