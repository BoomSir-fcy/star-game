import React, { useEffect, useCallback, useState } from 'react';
import {
  RefreshButton,
  Flex,
  Box,
  BackButton,
  MarkText,
  Text,
  Empty,
  Button,
  Spinner,
} from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import useTheme from 'hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import {
  useFetchAllianceView_slowRefresh,
  useFetchExploreProgressView,
} from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { fetchExploreProgressAsync } from 'state/alliance/reducer';
import { useStore } from 'state';
import { PlanetProView } from 'state/types';
import { useCountdownTime } from 'components';

import ProgressContent from './components/ProgressContent';
import ExploreIntroduction from './components/ExploreIntroduction';
import PlanetProgress from './components/PlanetProgress';
import MsgList from './components/MsgList';

const TitleBox = styled(Flex)`
  width: 512px;
  height: 52px;
  background: url('/images/battleReport/top.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: center;
`;

const ContentBox = styled(Box)`
  height: calc(940px - 90px);
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  padding: 30px 50px;
`;

const LoadingBox = styled(Box)`
  position: absolute;
  left: 56%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ExploreProgress: React.FC = () => {
  const { t, getHTML } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useFetchAllianceView_slowRefresh();
  useFetchExploreProgressView();

  const { ExploreProgressDate, allianceView } = useStore(p => p.alliance);
  const { order } = allianceView;
  const { free_time, alliance } = useStore(p => p.alliance.allianceView);

  const diffSeconds = useCountdownTime(0, 0, free_time);

  const [PlanetProList, setPlanetProList] = useState<PlanetProView[]>([]);
  const [WorkEnd, setWorkEnd] = useState(false);

  useEffect(() => {
    if (diffSeconds <= 0) {
      setWorkEnd(true);
    } else {
      setWorkEnd(false);
    }
  }, [diffSeconds]);

  useEffect(() => {
    if (ExploreProgressDate?.planet_detail?.length && order?.length) {
      const newList = ExploreProgressDate.planet_detail.map(item => {
        const ItemPlanet = order.find(i => i.planet.id === item.planet_id);
        return {
          ...item,
          rarity: ItemPlanet.planet.rarity,
          picture1: ItemPlanet.planet.picture1,
        };
      });
      setPlanetProList(newList);
    }
  }, [order, ExploreProgressDate]);

  return (
    <Box>
      <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
        <Box mr='40px'>
          <BackButton />
        </Box>
        <TitleBox>
          <MarkText fontSize='18px' bold>
            {t('State of Exploration')}
          </MarkText>
        </TitleBox>
      </Flex>
      <ContentBox>
        {alliance.working !== 0 && ExploreProgressDate ? (
          <>
            <Flex flex={1} alignItems='flex-start'>
              <Flex flex={1} flexDirection='column'>
                <ProgressContent diffSeconds={diffSeconds} />
                <Flex pt='30px' alignItems='center' flexWrap='wrap'>
                  {(PlanetProList || []).map((item, index) => (
                    <PlanetProgress
                      mr={index !== 2 ? '50px' : ''}
                      key={item.planet_id}
                      info={item}
                      WorkEnd={WorkEnd}
                    />
                  ))}
                </Flex>
              </Flex>
            </Flex>
            <Flex>
              <ExploreIntroduction />
              <MsgList />
            </Flex>
          </>
        ) : (
          <>
            <Empty />
          </>
        )}
        {alliance.working !== 0 &&
          ExploreProgressDate?.planet_detail?.length <= 0 && (
            <LoadingBox>
              <Spinner size={200} />
            </LoadingBox>
          )}
      </ContentBox>
    </Box>
  );
};

export default ExploreProgress;
