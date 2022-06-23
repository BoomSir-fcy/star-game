import React from 'react';
import {
  MysteryBoxCom,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Box, Flex, Text, Image, Button } from 'uikit';
import { Globe } from 'components';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { useStore } from 'state';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';

const StarFrame = keyframes`
  0% {
    transform: translateY(-700px);
  }
  80% {
    transform: translateY(30px);
  }
  90% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const StarDescFrame = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const LightFrame = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;
const AnimationStar = styled(Box)`
  &.star0 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.1s both;
  }
  &.star1 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.3s both;
  }
  &.star2 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.6s both;
  }
  &.star3 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.9s both;
  }
  &.star4 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 1.2s both;
  }
`;
const ContentFlex = styled(Flex)`
  & .star-desc {
    animation: ${StarDescFrame} 2s linear 2s both;
  }
`;
const Light = styled(Box)`
  position: absolute;
  top: -330px;
  width: 220px;
  height: 580px;
  filter: blur(10px);
  opacity: 0;
  ::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #ffeab1, transparent);
    clip-path: polygon(35% 0, 65% 0, 100% 100%, 0% 100%);
  }
  &.light-0 {
    animation: ${LightFrame} 1s ease-in-out both;
  }
  &.light-1 {
    animation: ${LightFrame} 1s ease-in-out 0.2s both;
  }
  &.light-2 {
    animation: ${LightFrame} 1s ease-in-out 0.4s both;
  }
  &.light-3 {
    animation: ${LightFrame} 1s ease-in-out 0.6s both;
  }
  &.light-4 {
    animation: ${LightFrame} 1s ease-in-out 0.8s both;
  }
`;
const List = () => {
  const paramsQs = useParsedQueryString();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const quality = Number(paramsQs.q) as MysteryBoxQualities;

  const planetInfo = useStore(p => p.planet.planetInfo);

  const planetList = [1, 2, 3, 4, 5];
  return (
    <Box>
      <MysteryBoxCom
        rotate={0}
        left={0}
        right={0}
        bottom={0}
        quality={quality}
        style={{ opacity: 0.3 }}
      />
      <ContentFlex justifyContent='space-evenly'>
        {planetList.length > 0 &&
          planetList.map((item, index) => (
            <>
              <Box key={item}>
                <Light className={`light-${index}`} />
                <Text
                  className='star-desc'
                  mb='6px'
                  textAlign='center'
                  fontSize='26px'
                  bold
                >
                  传说
                </Text>
                <AnimationStar className={`star${index}`}>
                  <Globe scale='ld' rotate url='/images/star/32.jpg' />
                </AnimationStar>
                <Flex className='star-desc' mt='30px' alignItems='center'>
                  <Image
                    width={44}
                    height={44}
                    src='/images/commons/zerg.png'
                  />
                  <Box ml='9px'>
                    <Text fontSize='18px' bold>
                      虫族
                    </Text>
                    <Text mt='10px' small>
                      Token: 2650....26x226
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </>
          ))}
      </ContentFlex>

      <Flex mt='139px' justifyContent='center'>
        <Button variant='purple' width='355px' height='68px'>
          <Text fontSize='18px' bold>
            一键部署到行星联盟
          </Text>
        </Button>
        <Button ml='61px' variant='purple' width='355px' height='68px'>
          <Text fontSize='18px' bold>
            老手自己配置
          </Text>
        </Button>
      </Flex>
    </Box>
  );
};

export default List;
