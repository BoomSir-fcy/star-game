import React from 'react';
import { Layout } from 'components';
import { Flex, Box } from 'uikit';
import styled, { createGlobalStyle } from 'styled-components';
import { GlobalVideo } from 'components/Video';
import { useStore } from 'state';
import { Link, useNavigate } from 'react-router-dom';
import {
  MysteryBoxCom,
  mysteryBoxQualities,
} from 'components/MysteryBoxComNew';

const ClickBox = styled(Box)`
  /* background-color: pink; */
  opacity: 0.2;
  width: 900px;
  height: 300px;
  transform: rotate(-45deg);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const MysteryBoxNew = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Flex
        position='relative'
        width='100%'
        height='100%'
        id='test'
        justifyContent='space-between'
      >
        <ClickBox
          left={-100}
          onClick={() => {
            navigate(`/mystery-box/state?q=${mysteryBoxQualities.ORDINARY}`);
          }}
        />
        <ClickBox
          left={450}
          onClick={() => {
            navigate(`/mystery-box/state?q=${mysteryBoxQualities.ADVANCED}`);
          }}
        />
        <ClickBox
          left={1050}
          onClick={() => {
            navigate(`/mystery-box/state?q=${mysteryBoxQualities.SUPER}`);
          }}
        />
        <MysteryBoxCom
          left={-50}
          top={0}
          bottom={0}
          quality={mysteryBoxQualities.ORDINARY}
        />
        <MysteryBoxCom
          left={500}
          top={0}
          bottom={0}
          quality={mysteryBoxQualities.ADVANCED}
        />
        <MysteryBoxCom
          left={1100}
          top={0}
          bottom={0}
          quality={mysteryBoxQualities.SUPER}
        />
      </Flex>
    </Layout>
  );
};

export default MysteryBoxNew;
