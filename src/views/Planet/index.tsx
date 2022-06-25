import { Globe } from 'components';
import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Flex, Spinner, Text, Image } from 'uikit';
import { useImmer } from 'use-immer';
import { PlanetInfo, Search } from './components';
import { DragBox, PlanetBox, GlobeFlex, Desc, LeftBox } from './styled';

const PlanetList = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [targetDrag, setTargetDrag] = useImmer({
    isDown: false,
    coord: {
      x: 0,
      y: 0,
    },
  });

  const scrollPointerdown = useCallback(
    (e: { pageX: number; pageY: number }) => {
      setTargetDrag(p => {
        p.isDown = true;
        p.coord = { x: e.pageX, y: e.pageY };
      });
    },
    [setTargetDrag],
  );

  const scrollPointerup = useCallback(() => {
    setTargetDrag(p => {
      p.isDown = false;
      p.coord = { x: 0, y: 0 };
    });
  }, [setTargetDrag]);

  const scrollPointermove = useCallback(
    e => {
      e.preventDefault();
      const moveX = targetDrag.coord.x - e.pageX;
      const moveY = targetDrag.coord.y - e.pageY;
      setTargetDrag(p => {
        p.coord.x = e.pageX;
        p.coord.y = e.pageY;
      });
      if (targetDrag.isDown) {
        pageRef.current.scrollLeft += moveX;
        pageRef.current.scrollTop += moveY;
      }
    },
    [targetDrag, setTargetDrag],
  );

  useEffect(() => {
    const el = pageRef.current;
    if (el) {
      el.addEventListener('pointerdown', scrollPointerdown, false);
      document.addEventListener('pointerup', scrollPointerup, false);
      el.addEventListener('pointermove', scrollPointermove, false);
    }
    return () => {
      if (el) {
        el.removeEventListener('pointerdown', scrollPointerdown, false);
        document.removeEventListener('pointerup', scrollPointerup, false);
        el.removeEventListener('pointermove', scrollPointermove, false);
      }
    };
  }, [pageRef, scrollPointerdown, scrollPointerup, scrollPointermove]);

  const planetList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <DragBox className={targetDrag.isDown ? 'no-select' : ''} ref={pageRef}>
      <PlanetBox>
        <GlobeFlex>
          {!planetList.length && (
            <Flex width='100%' alignItems='center' justifyContent='center'>
              <Spinner />
            </Flex>
          )}
          {planetList.length > 0 &&
            planetList.map((item, index) => (
              <Box className={`star star-${index} `} key={item}>
                {/* <Text
                  className='star-desc'
                  mb='6px'
                  textAlign='center'
                  fontSize='26px'
                  bold
                >
                  传说
                </Text> */}
                <Box className='ball animation'>
                  <Desc>
                    <Text textAlign='center' fontSize='26px' bold>
                      {index}
                    </Text>
                  </Desc>
                  <Globe rotate={false} url='/images/star/32.jpg' />
                </Box>

                {/* <Flex className='star-desc' mt='30px' alignItems='center'>
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
                </Flex> */}
              </Box>
            ))}
        </GlobeFlex>
      </PlanetBox>

      <LeftBox>
        <Search />
        <PlanetInfo />
      </LeftBox>
    </DragBox>
  );
};

export default PlanetList;
