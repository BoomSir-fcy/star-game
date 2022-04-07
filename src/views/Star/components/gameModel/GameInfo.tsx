import React from 'react';
import styled, { css } from 'styled-components';
import { Flex, Box, Card, Text, Image, Button } from 'uikit';

import { useBuildingUpgrade } from './hooks';

import { ThingaddBlood, GameThing, ThingRepair } from '..';
import { ThingDestoryModal, ThingUpgradesModal } from '../Modal';

const Container = styled(Box)`
  width: 852px;
  min-height: 490px;
  padding: 13px;
  border: 4px solid #f9feff;
  box-shadow: 0px 0px 10px 2px #41b7ff;
`;

const CardContent = styled(Card)`
  border-radius: 0;
  padding: 10px 16px;
`;

const CardInfo = styled(Card)`
  border-radius: 0;
  padding: 0 36px;
  height: 138px;
  border: 1px solid #282a30;
`;

const ItemInfo = styled(Flex)<{ bottomMargin?: boolean }>`
  width: 50%;
  justify-content: flex-start;
  align-items: center;
  ${({ bottomMargin }) =>
    !bottomMargin &&
    css`
      margin-bottom: 10px;
    `}
`;

const StyledImage = styled(Image)`
  flex-shrink: 0;
  margin-right: 9px;
`;

const Consume = styled(Flex)`
  padding-top: 10px;
  border-top: 1px solid #2b2f39;
`;

const ActionButton = styled(Button)`
  width: 170px;
  height: 44px;
  padding: 0;
  font-size: 20px;
  &:first-child {
    margin-bottom: 10px;
  }
`;

export const GameInfo: React.FC<{
  itemData: Api.Building.Building;
  planet_id: number;
}> = React.memo(({ itemData, planet_id }) => {
  const { upgrade } = useBuildingUpgrade();
  const [state, setState] = React.useState({
    destoryVisible: false,
    upgradesVisible: false,
  });

  React.useEffect(() => {
    console.log(itemData);
    if (itemData.type) {
      upgrade(planet_id, itemData._id);
    }
  }, [itemData]);

  return (
    <Container>
      {itemData?.type && (
        <>
          <CardContent>
            <Flex>
              <GameThing
                src={itemData?.picture}
                level={itemData?.propterty?.levelEnergy}
                scale='md'
                border
              />
              <Box ml='36px' style={{ flex: 1 }}>
                <Flex alignItems='flex-end' mb='10px'>
                  <Text shadow='primary'>{itemData?.propterty?.name_cn}</Text>
                  <Text ml='27px' small>
                    {`${itemData?.propterty?.size.area_x}x${itemData?.propterty?.size.area_y}`}
                  </Text>
                </Flex>
                <Flex flex={1} justifyContent='space-between' flexWrap='wrap'>
                  <ItemInfo>
                    <Box width={50} height={50} mr='5px'>
                      <StyledImage
                        width={50}
                        height={50}
                        src='/images/commons/star/HP.png'
                      />
                    </Box>
                    <Box>
                      <Flex alignItems='center'>
                        <Text color='textSubtle' small>
                          HP值
                        </Text>
                        <ThingaddBlood />
                      </Flex>
                      <Text small>{itemData?.propterty?.hp}</Text>
                    </Box>
                  </ItemInfo>
                  <ItemInfo>
                    <Box width={50} height={50} mr='5px'>
                      <StyledImage
                        width={50}
                        height={50}
                        src='/images/commons/star/durability.png'
                      />
                    </Box>
                    <Box>
                      <Flex alignItems='center'>
                        <Text color='textSubtle' small>
                          耐久度
                        </Text>
                        <ThingRepair />
                      </Flex>
                      <Text small>
                        {itemData?.propterty?.max_durability}/100
                      </Text>
                    </Box>
                  </ItemInfo>
                  <ItemInfo>
                    <Box width={50} height={50} mr='5px'>
                      <StyledImage
                        width={50}
                        height={50}
                        src='/images/commons/star/defense.png'
                      />
                    </Box>
                    <Box>
                      <Flex>
                        <Text color='textSubtle' small>
                          防御值
                        </Text>
                      </Flex>
                      <Text small>{itemData?.propterty?.defence}</Text>
                    </Box>
                  </ItemInfo>
                  <ItemInfo>
                    <Box width={50} height={50} mr='5px'>
                      <StyledImage
                        width={50}
                        height={50}
                        src='/images/commons/star/attackValue.png'
                      />
                    </Box>
                    <Box>
                      <Flex>
                        <Text color='textSubtle' small>
                          攻击值
                        </Text>
                      </Flex>
                      <Text small>{itemData?.propterty?.attack}</Text>
                    </Box>
                  </ItemInfo>
                </Flex>
                <Consume>
                  <ItemInfo bottomMargin>
                    <Box width={50} height={50} mr='5px'>
                      <Image
                        src='/images/commons/icon/energy.png'
                        width={50}
                        height={50}
                      />
                    </Box>
                    <Flex flexDirection='column' justifyContent='center'>
                      <Text color='textTips' small>
                        能量消耗
                      </Text>
                      <Text small>
                        {itemData?.propterty?.per_cost_energy}/h
                      </Text>
                    </Flex>
                  </ItemInfo>
                  <ItemInfo bottomMargin>
                    <Box width={50} height={50} mr='5px'>
                      <Image
                        src='/images/commons/icon/population.png'
                        width={50}
                        height={50}
                      />
                    </Box>
                    <Flex flexDirection='column' justifyContent='center'>
                      <Text color='textTips' small>
                        人口消耗
                      </Text>
                      <Text small>
                        {itemData?.propterty?.per_cost_population}/h
                      </Text>
                    </Flex>
                  </ItemInfo>
                </Consume>
              </Box>
            </Flex>
            <Text color='textSubtle' small mt='5px'>
              作用：储存星球建筑产出的所有资源
            </Text>
          </CardContent>
          <CardInfo>
            <Flex
              justifyContent='space-between'
              alignItems='center'
              style={{
                height: 138,
              }}
            >
              <Flex flexDirection='column'>
                <Flex alignItems='center'>
                  <Text shadow='primary' fontSize='33px'>
                    Lv {itemData?.propterty?.levelEnergy}
                  </Text>
                  <Box width='47px' height='40px' margin='0 44px'>
                    <Image
                      src='/images/commons/icon/icon-upgrade.png'
                      width={47}
                      height={40}
                    />
                  </Box>
                  <Text shadow='primary' fontSize='33px'>
                    Lv {itemData?.propterty?.levelEnergy + 1}
                  </Text>
                </Flex>
                <Text color='textSubtle' small>
                  升级所需人口：100/1000人
                </Text>
              </Flex>
              <Flex flexDirection='column'>
                <ActionButton
                  onClick={() => setState({ ...state, upgradesVisible: true })}
                >
                  建筑升级
                </ActionButton>
                <ActionButton
                  variant='danger'
                  onClick={() => setState({ ...state, destoryVisible: true })}
                >
                  摧毁建筑
                </ActionButton>
              </Flex>
            </Flex>
          </CardInfo>
        </>
      )}

      {/* 销毁建筑 */}
      <ThingDestoryModal
        visible={state.destoryVisible}
        onClose={() => setState({ ...state, destoryVisible: false })}
      />

      {/* 建筑升级 */}
      <ThingUpgradesModal
        visible={state.upgradesVisible}
        onClose={() => setState({ ...state, upgradesVisible: false })}
      />
    </Container>
  );
});
