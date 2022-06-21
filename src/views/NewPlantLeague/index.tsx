import React from 'react';
import { Text, Flex } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import AlliancePlanet from './components/AlliancePlanet';
import Explore from './components/Explore';
import RightFloatBar from './components/RightFloatBar';

const NewPlantLeague: React.FC = () => {
  useFetchAllianceView();

  return (
    <Layout>
      <AlliancePlanet />
      <Explore />
      <RightFloatBar />
    </Layout>
  );
};

export default NewPlantLeague;
