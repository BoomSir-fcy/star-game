import React, { useState } from 'react';
import { useStore } from 'state';
import { useGalaxyList } from 'state/galaxy/hooks';
import { Text, Flex, Box } from 'uikit';
import { useDispatch } from 'react-redux';
import {
  fetchGalaxyListAsync,
  fetchGalaxyStarListAsync,
  setCurrentGalaxy,
} from 'state/galaxy/reducer';
import { GalaxyImg, GalaxyInfoBox, ItemGalaxyBox } from 'views/NewGalaxy/style';
import InfoModule from './InfoModule';

const GalaxyInfo: React.FC = () => {
  useGalaxyList();
  const dispatch = useDispatch();

  const { galaxyList, currentGalaxy, loadingGalaxy } = useStore(p => p.galaxy);
  const [OpenInfo, setOpenInfo] = useState(false);

  return (
    <GalaxyInfoBox>
      {(galaxyList ?? []).map((item, index) => (
        <ItemGalaxyBox
          key={item.id}
          width={300}
          height={300}
          onClick={() => {
            dispatch(setCurrentGalaxy(item));
            dispatch(fetchGalaxyStarListAsync(item.id as number));
            setOpenInfo(true);
          }}
        >
          <GalaxyImg src={`/images/galaxy/${index + 1}.png`} />
        </ItemGalaxyBox>
      ))}
      {OpenInfo && <InfoModule setOpenInfo={setOpenInfo} />}
    </GalaxyInfoBox>
  );
};

export default GalaxyInfo;
