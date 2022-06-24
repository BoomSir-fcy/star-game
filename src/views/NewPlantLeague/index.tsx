import React, { useState } from 'react';
import { Text, Flex, Box } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { orderInfo } from 'state/types';
import AlliancePlanet from './components/AlliancePlanet';
import Explore from './components/Explore';
import RightFloatBox from './components/RightFloat';
import ExploreModule from './components/Module/ExploreModule';
import ManageModule from './components/Module/ManageModule';

const NewPlantLeague: React.FC = () => {
  useFetchAllianceView();
  const [ShowModule, setShowModule] = useState(false);
  const [Difficulty, setDifficulty] = useState(0);
  const [PlantManageModule, setPlantManageModule] = useState(false);
  const [ChoosePlant, setChoosePlant] = useState<orderInfo>();

  return (
    <Layout height='60vh'>
      <AlliancePlanet
        setChoosePlant={e => {
          setChoosePlant(e);
        }}
        setPlantManageModule={e => {
          setShowModule(false);
          setPlantManageModule(e);
        }}
      />
      <Explore
        Difficulty={Difficulty}
        ShowModule={ShowModule}
        setShowModule={e => {
          setPlantManageModule(false);
          setShowModule(e);
        }}
      />
      <RightFloatBox />
      <Box zIndex={1} position='relative'>
        {ShowModule && (
          <ExploreModule
            Difficulty={Difficulty}
            setDifficulty={e => setDifficulty(e)}
          />
        )}
        {PlantManageModule && <ManageModule ChoosePlant={ChoosePlant} />}
      </Box>
    </Layout>
  );
};

export default NewPlantLeague;
