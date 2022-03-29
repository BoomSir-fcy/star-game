import React, { useState } from 'react';
import { Flex } from 'uikit';
import { useDispatch } from 'react-redux';
import { Layout, Dashboard, Nav, StarAddBtn } from 'components';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useStore } from 'state';
import { fetchGalaxyStarListAsync, setCurrentStar } from 'state/galaxy/reducer';
import { useGalaxyStarList } from 'state/galaxy/hooks';
import { shortenAddress } from 'utils';
import { StarBox } from './style';
import { PlunderCard } from './PlunderCard';

const Stars = () => {
  const dispatch = useDispatch();
  const parseQs = useParsedQueryString();
  const [activeStar, setActiveStar] = useState<Api.Galaxy.StarInfo>({
    number: 0,
    token_id: 0,
  });
  const [visible, setVisible] = useState(false);

  const galaxyId = Number(parseQs.i);
  useGalaxyStarList(galaxyId);

  const { galaxyStarList, currentGalaxy, currentStarPeriod } = useStore(
    p => p.galaxy,
  );

  console.log(currentGalaxy);

  console.log(galaxyStarList);
  console.log(currentStarPeriod);

  return (
    <Layout>
      <Dashboard />
      <Flex alignItems='center' mt='16px'>
        <Nav
          nav={galaxyStarList}
          mr='24px'
          activeId={currentStarPeriod?.id}
          onChangeNav={info => {
            console.log(info);
            dispatch(setCurrentStar(info));
          }}
        />
        <StarBox>
          {currentStarPeriod.levels &&
            currentStarPeriod.levels.map((item, index) => (
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
                  setVisible(true);
                }}
              />
            ))}

          {visible && (
            <PlunderCard
              info={activeStar}
              onClose={() => {
                dispatch(fetchGalaxyStarListAsync(galaxyId));
                setVisible(false);
              }}
            />
          )}
        </StarBox>
      </Flex>
    </Layout>
  );
};

export default Stars;
