import React, { useEffect, useMemo, useState } from 'react';
import { Box, BoxProps, Image } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state';
import { truncate } from 'lodash';

const TokenAnimationBox = styled(Box)<{
  scale: number;
  toLeft?: number;
  toTop?: number;
  fromTop?: number;
  fromLeft?: number;
  Delay?: number;
}>`
  position: fixed;
  z-index: 999;
  transform: ${({ scale }) => `scale(${scale})`};
  animation: ${({ fromTop, toTop, Delay }) =>
    toTop && fromTop ? `toMove 10s ease ${Delay}s` : ''};
  opacity: 0;
  @keyframes toMove {
    0% {
      opacity: 1;

      top: ${({ fromTop, scale }) =>
        fromTop ? `${fromTop * scale}px` : 'auto'};
      left: ${({ fromLeft, scale }) =>
        fromLeft ? `${fromLeft * scale}px` : 'auto'};
    }
    99% {
      opacity: 1;
    }
    100% {
      opacity: 0;

      top: ${({ toTop, scale }) => (toTop ? `${toTop * scale}px` : 'auto')};
      left: ${({ toLeft, scale }) => (toLeft ? `${toLeft * scale}px` : 'auto')};
    }
  }
`;

const CoinImg = styled.img`
  width: 30px;
  height: 30px;
`;

export interface TokenMoveAnimationProps {
  url?: string;
  scale?: number;
  toId?: string;
  fromId?: string;
  toPosition?: string;
}

const TokenMoveAnimation: React.FC<TokenMoveAnimationProps> = ({
  scale,
  toId,
  fromId,
  toPosition,
}) => {
  const guideState = useStore(p => p.guide);
  const [ToTop, setToTop] = useState(0);
  const [ToLeft, setToLeft] = useState(0);
  const [FromTop, setFromTop] = useState(0);
  const [FromLeft, setFromLeft] = useState(0);

  const imgList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(i);
    }
    return arr;
  }, []);

  const getElementLeft = (element, width?: boolean) => {
    let actualLeft = element.offsetLeft;
    const domWidth = width ? element.offsetWidth - 50 : 0;
    let current = element.offsetParent;
    let elementScrollLeft = 0;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }

    if (document.compatMode === 'BackCompat') {
      elementScrollLeft = document.body.scrollLeft;
    } else {
      elementScrollLeft = document.documentElement.scrollLeft;
    }

    return actualLeft - elementScrollLeft + domWidth;
  };

  const getElementTop = (element, height?: boolean) => {
    let actualTop = element.offsetTop;
    const domHeight = height ? element.offsetHeight - 50 : 0;

    let current = element.offsetParent;
    let elementScrollTop = 0;

    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }

    if (document.compatMode === 'BackCompat') {
      elementScrollTop = document.body.scrollTop;
    } else {
      elementScrollTop = document.documentElement.scrollTop;
    }

    return actualTop - elementScrollTop + domHeight;
  };

  useEffect(() => {
    const toDom = document.getElementById(toId);
    const fromDom = document.getElementById(fromId);
    if (fromDom && toDom) {
      if (toPosition === 'bottomRight') {
        console.log(
          getElementTop(toDom, true),
          getElementLeft(toDom, true),
          getElementTop(fromDom, true),
          getElementLeft(fromDom, true),
        );

        setToTop(getElementTop(toDom, true));
        setToLeft(getElementLeft(toDom, true));
        setFromTop(getElementTop(fromDom, true));
        setFromLeft(getElementLeft(fromDom, true));
      } else {
        console.log(
          getElementTop(toDom),
          getElementLeft(toDom),
          getElementTop(fromDom),
          getElementLeft(fromDom),
        );
        setToTop(getElementTop(toDom));
        setToLeft(getElementLeft(toDom));
        setFromTop(getElementTop(fromDom));
        setFromLeft(getElementLeft(fromDom));
      }
    }
  }, [toId, fromId, toPosition]);

  return (
    <>
      {guideState.tokenToFrom.token?.map((token, tokenIndex) => {
        return (
          <>
            {(imgList || []).map(i => (
              <TokenAnimationBox
                scale={scale}
                fromTop={FromTop}
                fromLeft={FromLeft}
                toTop={ToTop}
                toLeft={ToLeft}
                Delay={i * 0.02 + tokenIndex * 0.04}
              >
                <CoinImg
                  src={
                    token === 'BOX' || token === 'BNB'
                      ? `/images/tokens/${token}.svg`
                      : `/images/tokens/${token}.png`
                  }
                />
              </TokenAnimationBox>
            ))}
          </>
        );
      })}
    </>
  );
};

export default TokenMoveAnimation;
