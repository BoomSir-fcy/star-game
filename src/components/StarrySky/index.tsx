import React from "react";
import styled from "styled-components";
import { Box } from "uikit";
import skyBg from 'assets/img/commons/sky-bg.png'
import './spiders.css'

const StarrySkyBg = styled(Box)`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: url(${skyBg});
  background-size: cover;
`;

const StarrySky = () => {
  return (
    <StarrySkyBg>
      <div className="spiders">
        <div className='spidersOne' />
        <div className='spidersTwo' />
        <div className='spidersThree' />
    </div>
    </StarrySkyBg>
  )
}

export default StarrySky;
