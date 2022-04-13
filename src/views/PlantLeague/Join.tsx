import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';
import { StarAddBtn } from 'components';
import { useStore } from 'state/util';
import { qualities } from 'uikit/theme/types';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useTranslation } from 'contexts/Localization';
import { useRemoveAlliance } from './hook';

const GalaxyBg = styled(Box)`
  width: 60%;
  height: 80%;
  position: absolute;
  z-index: -1;
  top: 84px;
  left: 150px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const BigStarAddBtn = styled(StarAddBtn)`
  width: 200px !important;
  height: 200px !important;
`;

const StarStyleImg = styled.img`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.goldBorder};
  width: 65%;
`;

const JoinTheAlliance = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const { order: allianceList } = useStore(p => p.alliance.allianceView);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const { RemoveStar } = useRemoveAlliance();

  const Remove = useCallback(
    async (id: number) => {
      try {
        const newList = workingList.concat([]);
        const index = newList.indexOf(Number(id));
        newList.splice(index, 1);
        console.log(workingList, newList);

        await RemoveStar(newList);
        toastSuccess(t('Removed successfully'));
      } catch (e) {
        console.log(e);
        toastError(t('Removal failed'));
      }
      dispatch(fetchAllianceViewAsync());
    },
    [RemoveStar, workingList],
  );

  const addStar = (id: any) => {
    navigate(`/star/planet?choose=${id || 1}`);
  };

  return (
    <Box position='relative' width='40%' padding='0 80px 0 70px'>
      <Flex mb='-36px' alignItems='center' justifyContent='center'>
        <StarAddBtn
          onRemove={() => Remove(allianceList[0]?.planetId)}
          showIcon
          callBack={() => addStar(allianceList && allianceList[0]?.planetId)}
          imgBorder={
            (allianceList && allianceList[0]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[0]?.planet ? '/images/star/01.jpg' : ''
          }
          No={1}
          Leve={(allianceList && allianceList[0]?.planet?.level) || ''}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='space-between'>
        <StarAddBtn
          onRemove={() => Remove(allianceList[4]?.planetId)}
          showIcon
          callBack={() => addStar(allianceList && allianceList[4]?.planetId)}
          imgBorder={
            (allianceList && allianceList[4]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[4]?.planet ? '/images/star/05.jpg' : ''
          }
          No={5}
          Leve={(allianceList && allianceList[4]?.planet?.level) || ''}
        />
        <StarAddBtn
          onRemove={() => Remove(allianceList[1]?.planetId)}
          showIcon
          callBack={() => addStar(allianceList && allianceList[1]?.planetId)}
          imgBorder={
            (allianceList && allianceList[1]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[1]?.planet ? '/images/star/02.jpg' : ''
          }
          No={2}
          Leve={(allianceList && allianceList[1]?.planet?.level) || ''}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <StarAddBtn
          onRemove={() => Remove(allianceList[3]?.planetId)}
          showIcon
          callBack={() => addStar(allianceList && allianceList[3]?.planetId)}
          imgBorder={
            (allianceList && allianceList[3]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[3]?.planet ? '/images/star/04.jpg' : ''
          }
          No={4}
          Leve={(allianceList && allianceList[3]?.planet?.level) || ''}
        />
        <StarAddBtn
          onRemove={() => Remove(allianceList[2]?.planetId)}
          showIcon
          callBack={() => addStar(allianceList && allianceList[2]?.planetId)}
          imgBorder={
            (allianceList && allianceList[2]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[2]?.planet ? '/images/star/03.jpg' : ''
          }
          No={3}
          Leve={(allianceList && allianceList[2]?.planet?.level) || ''}
        />
      </Flex>
      <GalaxyBg>
        <img src='/images/planetary_alliance/1.png' alt='' />
      </GalaxyBg>
    </Box>
  );
};

export default JoinTheAlliance;
