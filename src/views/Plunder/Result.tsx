import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, BorderCard, Fringe } from 'uikit';
import { useStore } from 'state';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'contexts/Localization';
import { useFetchGameMatchUser } from 'state/game/hooks';
import {
  PeopleCard,
  Energy,
  PKProgress,
  RoundPanel,
  WaitPlunderList,
  PlunderPanel,
  OtherDetail,
} from './components';

const VideoStyled = styled.video`
  width: 1427px;
  /* object-fit: fill; */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const Result = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  useFetchGameMatchUser(account, 1);
  const { state, matchUser, mineUser } = useStore(p => p.game);

  return (
    <Flex>
      <Box width={446} height={555}>
        <PeopleCard
          style={{
            transform: 'scale(1.7)',
            transformOrigin: '0 0',
          }}
          {...mineUser}
        />
      </Box>
      <Box>
        <Fringe position='relative' top={-19} zIndex={2} />
        <Box width={1427} height={238} overflow='hidden' position='relative'>
          <VideoStyled autoPlay muted src='/video/won.mp4' playsInline />
        </Box>

        <BorderCard
          pt='8px'
          pl='12px'
          width={1427}
          height={302}
          borderRadius='15px'
          mt='18px'
          isActive
          background='transparent'
        >
          <Box
            background='#161920'
            border='1px solid #373C45'
            width={1393}
            height={275}
            padding='44px'
          >
            <Text fontSize='28px' bold mark>
              {t(
                'Plunder successful! Congratulations on taking ownership of the star.',
              )}
            </Text>
            {/* <Text fontSize='28px' bold mark>
              获得资源
            </Text>
            <Flex mt='38px'>
              <Energy />
              <Energy ml='72px' />
            </Flex> */}
          </Box>
        </BorderCard>
      </Box>
    </Flex>
  );
};

export default Result;
