import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Spinner } from 'uikit';
import { useDispatch } from 'react-redux';
import { Layout, Dashboard, Nav, StarAddBtn } from 'components';
import useParsedQueryString from 'hooks/useParsedQueryString';
import eventBus from 'utils/eventBus';
import { useStore } from 'state';
import {
  fetchGalaxyStarListAsync,
  setCurrentStarPeriod,
} from 'state/galaxy/reducer';
import { useGalaxyStarList } from 'state/galaxy/hooks';
import { shortenAddress } from 'utils';
import { sliceByLevels } from 'state/galaxy/util';
import { useTranslation } from 'contexts/Localization';
import { StarLevelInfo } from 'state/types';
import { StarBox } from './style';
import { PlunderCard } from './PlunderCard';

const Stars = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const parseQs = useParsedQueryString();
  const galaxyId = Number(parseQs.i);
  useGalaxyStarList(galaxyId);
  const { galaxyStarList, currentStarPeriod, loading } = useStore(
    p => p.galaxy,
  );

  const [visible, setVisible] = useState(false);
  const initState = useMemo(() => {
    return {
      token_id: 0,
      number: 0,
      name: '',
      owner: '',
      ownerAvatar: '',
      hold_time: 0,
      protect_timestamp: 0,
      history_hold_number: 0,
      disapth_box: 0,
      nick_name: '',
      product_box: 0,
      power: 0,
      cost_star: 0, // 挑战门票
      destroy_star: 0, // 销毁
      staking_pool_star: 0, // 分配质押池
      planet_owner_star: 0, // 恒星主获得
      storage_pool_star: 0,
      pre_box: 0,
      income_percent: 0,
      open: true,
    };
  }, []);
  const [activeStar, setActiveStar] = useState<Api.Galaxy.StarInfo>(initState);
  const [navList, setNavList] = useState<StarLevelInfo[]>([]);

  const initList = useCallback(() => {
    // 截取10个为一组
    const levelList = sliceByLevels(galaxyStarList, 10, t);
    setNavList(levelList);
    dispatch(
      setCurrentStarPeriod(
        currentStarPeriod?.id
          ? levelList.find(v => v.id === currentStarPeriod.id)
          : levelList[0],
      ),
    );
    if (levelList.length) setVisible(true);
  }, [galaxyStarList, currentStarPeriod?.id, t, dispatch]);

  useEffect(() => {
    initList();
  }, [initList]);

  useEffect(() => {
    if (currentStarPeriod?.levels.length) {
      const lastActiveStar = currentStarPeriod?.levels.find(
        item => item.number === activeStar.number,
      );
      setActiveStar(p => lastActiveStar || currentStarPeriod?.levels[0]);
    }
  }, [currentStarPeriod?.levels, visible, activeStar]);

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchGalaxyStarListAsync(galaxyId));
  }, [dispatch, galaxyId]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <Flex justifyContent='center' alignItems='center' mt='16px'>
          {/* 隐藏左边菜单栏 */}
          {/* <Nav
            nav={navList}
            mr='24px'
            activeId={currentStarPeriod?.id}
            onChangeNav={info => {
              dispatch(setCurrentStarPeriod(info));
              setVisible(false);
              setActiveStar(initState);
            }}
          /> */}
          <StarBox>
            {currentStarPeriod?.levels &&
              currentStarPeriod?.levels.map((item, index) => (
                <StarAddBtn
                  key={item?.number}
                  className={`star-${index + 1}`}
                  active={activeStar.number === item?.number}
                  owner={
                    item?.owner
                      ? shortenAddress(item?.owner, 4)
                      : `Lv ${item?.number}`
                  }
                  url={item?.ownerAvatar}
                  onClick={() => {
                    setActiveStar(item);
                    // setVisible(true);
                  }}
                />
              ))}
          </StarBox>

          {visible && (
            <PlunderCard
              info={activeStar}
              onClose={() => {
                dispatch(fetchGalaxyStarListAsync(galaxyId));
                // setVisible(false);
              }}
            />
          )}
        </Flex>
      )}
    </Layout>
  );
};

export default Stars;
