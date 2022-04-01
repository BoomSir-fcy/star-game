import React from 'react';
import { RaceAvatar } from 'components';
import { Image, Text, Flex, BoxProps } from 'uikit';
import { RaceCardStyled, LabelText } from './styled';

interface RaceProps extends BoxProps {
  info: any;
}
const Race: React.FC<RaceProps> = ({ info, ...props }) => {
  return (
    <RaceCardStyled mt='13px'>
      <Flex width='100%'>
        <RaceAvatar race='zerg' />
        <Flex ml='13px' flexDirection='column'>
          <Flex>
            <LabelText>星球种族</LabelText>

            {/* TODO: 种族类型，相关描述待完成 */}
            <Text color='#8AC001' ml='17px' fontSize='22px' bold>
              虫族
            </Text>
          </Flex>
          <LabelText>种族特色</LabelText>
          <LabelText>1.虫族经营类建筑的采集能力在三大种族中处于中等</LabelText>
          <LabelText>2.虫族攻击类建筑手最短，但伤害最BT。没有AOE伤害</LabelText>
          <LabelText>3.虫族攻击建筑占地面积最小</LabelText>
        </Flex>
      </Flex>
    </RaceCardStyled>
  );
};

export default Race;
