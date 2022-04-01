import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Button, Text, Flex, Card } from 'uikit';
import { useStore } from 'state';

import StarCom from 'components/StarCom';

import { RechargeAssets } from '../Modal';

const CardStyled = styled(Card)`
  width: 1610px;
  max-height: 140px;
`;
const TextStyled = styled(Text)`
  width: max-content;
`;
const ImageStyled = styled.img`
  width: 50px;
  height: 50px;
`;
const ButtonStyled = styled(Button)`
  width: 202px;
  height: 52px;
  padding: 10px;
`;
const StarHeader = () => {
  const dispatch = useDispatch();
  const planetInfo = useStore(p => p.planet.planetInfo);
  const [state, setState] = React.useState({
    visible: false,
  });

  console.log(planetInfo);

  return (
    <Flex flex={1}>
      <CardStyled ml='82px'>
        <Flex padding='20px' justifyContent='space-between'>
          <Flex>
            <StarCom scale='sm' quality={2} mr='40px' showUnion />
            <Flex flexDirection='column' justifyContent='space-between'>
              <Flex alignItems='center'>
                <Text color='legend'>传说</Text>
                <Text ml='13px' bold>
                  Lv1
                </Text>
                <TextStyled ml='52px' small>
                  0x9866w6d6+x5d6q666s3dsd26fd
                </TextStyled>
              </Flex>
              <Flex>
                <Flex mr='100px'>
                  <ImageStyled src='/images/commons/icon/ore.png' />
                  <Flex flexDirection='column' ml='14px'>
                    <Flex>
                      <TextStyled color='textTips' small>
                        总产能
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        0.32/s
                      </TextStyled>
                    </Flex>
                    <Flex>
                      <TextStyled color='textTips' small>
                        总矿石
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        10/100
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex mr='100px'>
                  <ImageStyled src='/images/commons/icon/population.png' />
                  <Flex flexDirection='column' ml='14px'>
                    <Flex>
                      <TextStyled color='textTips' small>
                        总产能
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        0.32/s
                      </TextStyled>
                    </Flex>
                    <Flex>
                      <TextStyled color='textTips' small>
                        总矿石
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        10/100
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex>
                  <ImageStyled src='/images/commons/icon/energy.png' />
                  <Flex flexDirection='column' ml='14px'>
                    <Flex>
                      <TextStyled color='textTips' small>
                        总产能
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        0.32/s
                      </TextStyled>
                    </Flex>
                    <Flex>
                      <TextStyled color='textTips' small>
                        总矿石
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        10/100
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flexDirection='column'
            justifyContent='space-between'
            alignItems='flex-end'
          >
            <TextStyled fontSize='20px' color='warning'>
              培育中，该星球暂时没有产能
            </TextStyled>
            <ButtonStyled
              scale='sm'
              onClick={() => setState({ ...state, visible: true })}
            >
              补充资源
            </ButtonStyled>
          </Flex>
        </Flex>
      </CardStyled>

      <RechargeAssets
        visible={state.visible}
        onClose={() => setState({ ...state, visible: false })}
      />
    </Flex>
  );
};

export default StarHeader;
