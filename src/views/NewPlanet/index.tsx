import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useImmer } from 'use-immer';
import { fetchMePlanetAsync } from 'state/planet/reducer';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { Search } from './components';
import { DragBox, PlanetBox, SearchBox, AllianceBox } from './styled';
import PlanetListBox from './components/PlanetListBox';
import Alliance from './components/Alliance';

const PlanetList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  const [NowAllianceListId, setNowAllianceListId] = useState<number[]>([]);
  const { mePlanet, mePlanetLoading } = useStore(p => p.planet);

  const [end, setEnd] = useState(false);

  console.log(mePlanetLoading);

  const loadMore = useCallback(
    (e: any) => {
      const { offsetHeight, scrollTop, scrollHeight } = e.nativeEvent.target;
      if (offsetHeight + scrollTop >= scrollHeight) {
        if (mePlanetLoading || end) return; // 判断是否在请求状态或者已到最后一页
        setState(p => {
          return { ...p, page: p.page + 1 };
        });
      }
    },
    [mePlanetLoading, end, setState],
  );

  useEffect(() => {
    const Arr = mePlanet.filter(item => {
      return !NowAllianceListId.includes(item.id);
    });
    setPlanetList(Arr);
    setActivePlanet(null);
  }, [mePlanet, NowAllianceListId]);

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

  return (
    <DragBox>
      <PlanetBox>
        <SearchBox>
          <Search
            onSearchCallback={params => {
              setState(p => {
                return { ...p, ...params };
              });
            }}
          />
        </SearchBox>
        <PlanetListBox
          loadMore={loadMore}
          planetList={planetList}
          setActive={setActivePlanet}
          activePlanet={activePlanet}
        />
      </PlanetBox>
      <AllianceBox>
        <Alliance setNowAllianceListId={setNowAllianceListId} />
      </AllianceBox>
    </DragBox>
  );
};

export default PlanetList;
