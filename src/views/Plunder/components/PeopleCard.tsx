import { useTranslation } from 'contexts/Localization';
import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps, Text, Image, Flex } from 'uikit';

const BoxStyled = styled(Box)`
  width: 260px;
  height: 332px;
  background: url('/images/plunder/bg.png');
  background-size: 100% 100%;
  position: relative;
`;
const CardStyled = styled(Box)`
  width: 203px;
  height: 305px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
`;
const BgImg = styled.div<{ active?: boolean }>`
  width: 203px;
  height: 305px;
  background: url('/images/plunder/card1.png');
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: -1;
  ${({ active }) => active && `box-shadow: 0px 0px 30px 10px #41b7ff;`}
`;

const AvatarImage = styled(Image)`
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  top: auto;
  margin: auto;
`;
const TipText = styled(Text).attrs({ color: 'forceTips' })`
  font-size: 12px;
`;
const ForceText = styled(Text).attrs({ color: 'force', bold: true })`
  font-size: 12px;
`;

interface PeopleCardProps
  extends BoxProps,
    Partial<Api.Alliance.PlunderInfoMatchUser> {
  active?: boolean;
}

const PeopleCard: React.FC<PeopleCardProps> = ({
  active,
  avatar,
  build_count,
  nick_name,
  planet_count,
  power,
  ak,
  df,
  hp,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <BoxStyled {...props}>
      <CardStyled>
        <BgImg active={active} />
        <Text textAlign='center' fontSize='12px' color='force'>
          {nick_name ?? '--'}
        </Text>
        <PlunderAvatar src={avatar} />
        <TipText mt='6px' textAlign='center'>
          {t('Combat Power')}
        </TipText>
        <Flex mt='-5px' justifyContent='center' alignItems='center'>
          <Image src='/images/plunder/fc.png' width={18} height={18} />
          <Text ml='4px' fontSize='20px' color='force' bold>
            {power ?? '--'}
          </Text>
        </Flex>
        <Flex mt='6px' ml='27px' flexWrap='wrap'>
          <Flex width='80px' alignItems='center'>
            <Image src='/images/commons/star/HP.png' width={30} height={30} />
            <Flex ml='2px' flexDirection='column'>
              <TipText mb='-5px'>HP</TipText>
              <ForceText>{hp ?? '--'}</ForceText>
            </Flex>
          </Flex>
          <Flex width='80px' alignItems='center'>
            <Image
              src='/images/commons/star/defense.png'
              width={30}
              height={30}
            />
            <Flex ml='2px' flexDirection='column'>
              <TipText mb='-5px'>{t('Defense')}</TipText>
              <ForceText>{df ?? '--'}</ForceText>
            </Flex>
          </Flex>
          <Flex width='80px' alignItems='center'>
            <Image
              src='/images/commons/star/attackValue.png'
              width={30}
              height={30}
            />
            <Flex ml='2px' flexDirection='column'>
              <TipText mb='-5px'>{t('Attack')}</TipText>
              <ForceText>{ak ?? '--'}</ForceText>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          width='108px'
          margin='8px auto 0 auto'
          justifyContent='space-between'
        >
          <TipText>{t('Planet Alliance')}: </TipText>
          <TipText>{planet_count ?? '--'}</TipText>
        </Flex>
        <Flex width='108px' margin='0 auto' justifyContent='space-between'>
          <TipText>{t('Total Building')}: </TipText>
          <TipText>{build_count ?? '--'}</TipText>
        </Flex>
      </CardStyled>
    </BoxStyled>
  );
};

export default PeopleCard;

const PlunderAvatar = ({ src }: { src?: string }) => {
  return (
    <Box zIndex={-2} position='relative'>
      <Image
        src='/images/plunder/avatar-bg.png'
        mt='-8px'
        width={203}
        height={125}
        style={{ zIndex: -1 }}
      />
      <AvatarImage src={src} width={100} height={100} />
    </Box>
  );
};
