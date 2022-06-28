import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Globe } from 'components';
import { Box, Flex, Spinner, Text, Image } from 'uikit';
import { useImmer } from 'use-immer';
import { fetchMePlanetAsync } from 'state/planet/fetchers';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { PlanetInfo, Search } from './components';
import { DragBox, PlanetBox, GlobeFlex, Desc, LeftBox } from './styled';
import GlobeFlexList from './components/GlobeFlexList';

const PlanetList = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [activePlanet, setActivePlanet] =
    useState<Api.Planet.PlanetInfo | null>(null);
  const [state, setState] = useImmer({
    page: 1,
    page_size: 10,
    token: '',
    race: 0,
    rarity: 0,
    level: 0,
  });
  const [planetList, setPlanetList] = useState([]);
  const mePlanet = useStore(p => p.planet.mePlanet);
  useEffect(() => {
    setPlanetList(mePlanet);
    setVisibleInfo(false);
  }, [mePlanet]);

  const init = useCallback(() => {
    dispatch(
      fetchMePlanetAsync({
        ...state,
      }),
    );
  }, [dispatch, state]);

  useEffect(() => {
    init();
  }, [state.race, state.rarity, state.token, state.level, init]);

  // 列表左右拖动
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
      e.stopPropagation();
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

  // 测试用
  // const [planetList] = React.useState(
  //   Array.from(new Array(20)).map((item, index) => index),
  // );

  return (
    <DragBox ref={pageRef}>
      <PlanetBox className={targetDrag.isDown ? 'no-select' : ''}>
        <GlobeFlexList
          setVisibleInfo={setVisibleInfo}
          setActivePlanet={setActivePlanet}
          planetList={planetList}
          activePlanet={activePlanet}
        />
      </PlanetBox>

      <LeftBox>
        <Search
          onSearchCallback={params => {
            setState(p => {
              return { ...p, ...params };
            });
          }}
        />
        {visibleInfo && <PlanetInfo info={activePlanet} />}
      </LeftBox>
    </DragBox>
  );
};

export default PlanetList;
