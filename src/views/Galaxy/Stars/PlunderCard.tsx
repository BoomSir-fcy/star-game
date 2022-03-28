import React from 'react';
import { Button, Text, Flex, BgCard, Image } from 'uikit';
import { StarInfo } from '../type';
import { ButtonStyled, BgCardStyled } from './style';

export const PlunderCard: React.FC<{
  info: StarInfo;
  onClose?: () => void;
}> = ({ info, onClose }) => {
  return (
    <BgCardStyled variant='small' fringe>
      <Flex flexDirection='column' alignItems='center'>
        <Image
          width={395}
          height={395}
          mt='50px'
          src='/images/commons/star/1.png'
        />
        <Flex alignItems='flex-end'>
          <Flex flexDirection='column'>
            <Text mb='10px' shadow='tertiary' fontSize='28px' bold>
              恒星Lv: {info.lv}
            </Text>
            <Text shadow='primary' small bold>
              产出BOX:10000
            </Text>
            <Text shadow='primary' small bold>
              被占领次数:5
            </Text>
          </Flex>
          <ButtonStyled scale='sm' ml='60px' onClick={onClose}>
            抢夺恒星
          </ButtonStyled>
        </Flex>
      </Flex>
    </BgCardStyled>
  );
};
