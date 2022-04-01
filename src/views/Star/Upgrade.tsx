import React, { useState } from 'react';
import StarAddBtn from 'components/StarAddBtn';
import ModalWrapper from 'components/Modal';
import StarCom from 'components/StarCom';
import {
  MysteryBoxBaseStyled,
  mysteryBoxQualities,
  MysteryBoxStyled,
  MysteryBoxBoxStyled,
} from 'components/MysteryBoxCom';
import styled from 'styled-components';
import { Image, Flex, Text, BgCard, Button, Card, Box } from 'uikit';
import { GradeBox, UpgradeCard, Upgrading } from './components/upgrade';

const MysteryBoxFlexStyled = styled(MysteryBoxStyled)`
  width: 320px;
  height: 366px;
  margin-right: 100px;
  margin-left: -40px;
`;

const MysteryBoxBaseNewStyled = styled(MysteryBoxBaseStyled)`
  bottom: -40px;
`;
const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
  top: 0;
`;
const StyledCard = styled(Card)`
  width: 448px;
  padding: 50px 20px;
`;
const Upgrade = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(0);

  return (
    <BgCard variant='big' padding='40px 68px'>
      {status === 1 ? (
        <Upgrading />
      ) : (
        <Flex flexDirection='column'>
          <Flex mb='20px' alignItems='center'>
            <Flex width='320px' mr='50px' alignItems='center'>
              <GradeBox>
                <Text bold shadow='primary'>
                  Lv 1
                </Text>
              </GradeBox>
              <Image
                width={82}
                height={42}
                margin='0 28px'
                src='/images/commons/icon/upgrade.png'
              />
              <GradeBox>
                <Text bold color='up' shadow='secondary'>
                  Lv 2
                </Text>
              </GradeBox>
            </Flex>
            <Flex>
              <StarAddBtn />
              <StarAddBtn />
              <StarAddBtn />
              <StarAddBtn />
              <StarAddBtn />
            </Flex>
          </Flex>
          <Flex alignItems='center'>
            <MysteryBoxFlexStyled>
              <MysteryBoxBaseNewStyled quality={mysteryBoxQualities.SUPER}>
                <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
                  <StarCom variant='none' scale='ld' />
                </MysteryBoxStarStyled>
              </MysteryBoxBaseNewStyled>
            </MysteryBoxFlexStyled>
            <UpgradeCard mr='33px' />
            <UpgradeCard mr='33px' />
            <StyledCard>
              <Flex flexDirection='column' justifyContent='space-between'>
                <Flex flexDirection='column'>
                  <Text small>*升级需献祭添加相同品质、相同等级的星球</Text>
                  <Text small>*升级需添加成为联盟的星球</Text>
                  <Text small>*所有建筑等级大于星球等级1级时可升级</Text>
                </Flex>
                <Flex mt='87px' flexDirection='column' alignItems='center'>
                  <Text fontSize='22px' color='failure'>
                    *能量建筑等级不符合
                  </Text>
                  <Button
                    // disabled
                    width='270px'
                    mt='20px'
                    onClick={() => setVisible(true)}
                  >
                    星球升级
                  </Button>
                </Flex>
              </Flex>
            </StyledCard>
          </Flex>
        </Flex>
      )}

      <ModalWrapper
        title='星球升级'
        visible={visible}
        setVisible={() => setVisible(false)}
      >
        <Flex padding='40px'>
          <StarCom scale='ld' quality={2} mr='40px' />
          <Flex flexDirection='column' justifyContent='space-between'>
            <Text fontSize='22px'>
              升级会持续6小时，期间将无法操作星球，是否继续升级？
            </Text>
            <Button
              width='270px'
              onClick={() => {
                setStatus(1);
                setVisible(false);
              }}
            >
              确认升级
            </Button>
          </Flex>
        </Flex>
      </ModalWrapper>
    </BgCard>
  );
};

export default Upgrade;
