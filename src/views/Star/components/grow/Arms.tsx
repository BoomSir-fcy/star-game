import React from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { getSpriteRes } from 'game/core/utils';
import { CardStyle } from './styled';
import { StrengthenConsumeType } from './type';

const ScrollFlex = styled(Flex)`
  max-height: 280px;
  overflow-x: hidden;
`;
const Arms: React.FC<{
  info: StrengthenConsumeType;
}> = ({ info }) => {
  const { t } = useTranslation();
  const armList = React.useMemo(() => {
    return info.now_units?.map((item, index) => {
      const estimateItem = info.estimate_units[index];
      return {
        ...item,
        up_hp: estimateItem?.hp - item?.hp,
        up_ak: estimateItem?.ak - item?.ak,
        up_df: estimateItem?.df - item?.df,
      };
    });
  }, [info]);
  return (
    <CardStyle width='702px' height='365px' padding='21px 19px'>
      <Text fontStyle='normal' mark bold>
        {t('Changes in troops after cultivation')}
      </Text>
      <ScrollFlex mt='16px' flexWrap='wrap' justifyContent='space-between'>
        {armList?.map(item => (
          <Flex mb='10px'>
            <Image
              width={45}
              height={54}
              src={getSpriteRes(item?.race, item?.index, 2)}
            />
            <Flex
              ml='18px'
              maxWidth='280px'
              flexWrap='wrap'
              justifyContent='space-between'
            >
              <Flex>
                <Text color='textTips' small>
                  {t('HP')}
                </Text>
                <Text ml='10px' small>
                  {item?.hp}
                </Text>
                <Text ml='10px' color='textUp' small>
                  +{item?.up_hp}
                </Text>
              </Flex>
              <Flex>
                <Text color='textTips' small>
                  {t('Defense')}
                </Text>
                <Text ml='10px' small>
                  {item?.df}
                </Text>
                <Text ml='10px' color='textUp' small>
                  +{item?.up_df}
                </Text>
              </Flex>
              <Flex>
                <Text color='textTips' small>
                  {t('Attack')}
                </Text>
                <Text ml='10px' small>
                  {item?.ak}
                </Text>
                <Text ml='10px' color='textUp' small>
                  +{item?.up_ak}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </ScrollFlex>
    </CardStyle>
  );
};

export default Arms;
