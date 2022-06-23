import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Button, Text, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { BuildingValue, GameThing } from '../gameModel';

import { useBuildingUpgrade, useBuildingOperate } from '../gameModel/hooks';

const Container = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
`;

const SideButton = styled(Box)`
  position: absolute;
  right: -15px;
  top: 0;
  z-index: 8;
`;

const Content = styled(Box)`
  position: absolute;
  right: -15px;
  top: 0;
  width: 547px;
  height: 100vh;
  padding: 23px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  opacity: 0;
  z-index: 5;
  &.active {
    opacity: 1;
    transition: all ease;
    animation: bounceInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
    @keyframes bounceInRight {
      0% {
        opacity: 0;
        transform: translate3d(200px, 0, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
  }
`;

const InfoCard = styled(Flex)`
  width: 50%;
`;

export const SideRightBuildingInfo: React.FC<{
  planet_id: number;
  buildingsId: number;
  itemData?: any;
}> = ({ planet_id, itemData }) => {
  const { t } = useTranslation();
  const { upgrade } = useBuildingUpgrade();
  const { destory } = useBuildingOperate();
  const [state, setState] = React.useState({
    visible: false,
    upgrade: {} as any,
  });

  const currentAttributes: any = {};

  const close = () => {
    setState({ ...state, visible: false });
  };

  // React.useEffect(() => {
  //   window.addEventListener('click', close);
  //   return () => {
  //     window.removeEventListener('click', close);
  //   };
  // });

  return (
    <Container>
      <SideButton>
        {!state.visible && (
          <Button
            variant='text'
            onClick={() => setState({ ...state, visible: !state.visible })}
          >
            展开
          </Button>
        )}
      </SideButton>
      <Content className={classNames(state.visible && 'active')}>
        <Flex mb='20px'>
          <GameThing
            src={currentAttributes?.picture}
            level={currentAttributes?.propterty?.levelEnergy}
            scale='md'
            border
          />
          <Flex flexDirection='column' ml='19px'>
            <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
              储存罐
            </MarkText>
            <Text color='textSubtle'>作用：储存星球建筑产出的所有资源</Text>
          </Flex>
        </Flex>
        <Box mb='20px'>
          <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
            基本属性
          </MarkText>
          <Flex justifyContent='space-between' width='100%'>
            <InfoCard>
              <BuildingValue
                itemData={itemData}
                planet_id={planet_id}
                title={t('planetDurability')}
                value={`${currentAttributes?.propterty?.now_durability || 0}/${
                  currentAttributes?.propterty?.max_durability || 0
                }`}
                addedValue={
                  state.upgrade?.estimate_building_detail?.max_durability -
                  currentAttributes?.propterty?.max_durability
                }
                icon='/images/commons/star/durability.png'
                isRepair={
                  currentAttributes?.propterty?.now_durability <
                  currentAttributes?.propterty?.max_durability
                }
              />
            </InfoCard>
            <InfoCard>
              <BuildingValue
                itemData={itemData}
                planet_id={planet_id}
                title={t('吞噬价值')}
                value='2000'
                addedValue={
                  state.upgrade?.estimate_building_detail?.max_durability -
                  currentAttributes?.propterty?.max_durability
                }
                icon='/images/commons/star/attackValue.png'
              />
            </InfoCard>
          </Flex>
        </Box>
        <Box>
          <MarkText bold fontSize='18px' fontStyle='normal' mb='25px'>
            储存资源
          </MarkText>
        </Box>
      </Content>
    </Container>
  );
};
