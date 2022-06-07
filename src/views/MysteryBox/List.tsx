import React from 'react';
import { MysteryBoxQualities } from 'components/MysteryBoxCom';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { BgCard, Flex } from 'uikit';
import styled from 'styled-components';

const VideoBox = styled(Flex)`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const List = () => {
  const paramsQs = useParsedQueryString();
  const quality = Number(paramsQs.q) as MysteryBoxQualities;

  return (
    <BgCard margin='auto' variant='longMedium'>
      <VideoBox>
        <video
          autoPlay
          muted
          playsInline
          src={`/video/mbox-${quality}.mp4`}
          style={{ mixBlendMode: 'screen' }}
        />
      </VideoBox>
    </BgCard>
  );
};

export default List;
