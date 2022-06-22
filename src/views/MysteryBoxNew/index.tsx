import React from 'react';
import { Layout } from 'components';
import { Flex, Text } from 'uikit';
import styled from 'styled-components';
import { GlobalVideo } from 'components/Video';
import { useStore } from 'state';

const TextStyled = styled(Text)<{ scale?: number }>`
  position: absolute;
  left: ${({ scale }) => `${405 * scale}px`};
  top: ${({ scale }) => `${250 * scale}px`};
  font-size: ${({ scale }) => `${16 * scale}px`};
`;
const MysteryBoxNew = () => {
  const { scale } = useStore(p => p.user);
  return (
    <Layout>
      <Flex justifyContent='space-between'>
        <GlobalVideo
          width={900}
          src='/video/mbox0.mp4'
          loop
          top={250}
          left={-50}
          rotate={-30}
        >
          <TextStyled shadow='primary' scale={scale} bold>
            破损的黑洞
          </TextStyled>
        </GlobalVideo>
        {/* <VideoStyled src='/video/mbox.mp4' autoPlay muted loop /> */}
        <GlobalVideo
          width={900}
          src='/video/mbox1.mp4'
          loop
          top={250}
          left={500}
          rotate={-30}
        >
          <TextStyled shadow='primary' scale={scale} bold>
            健康的黑洞
          </TextStyled>
        </GlobalVideo>
        <GlobalVideo
          width={900}
          src='/video/mbox2.mp4'
          loop
          top={250}
          left={1100}
          rotate={-30}
        >
          <TextStyled shadow='primary' scale={scale} bold>
            闪耀的黑洞
          </TextStyled>
        </GlobalVideo>
      </Flex>
    </Layout>
  );
};

export default MysteryBoxNew;
