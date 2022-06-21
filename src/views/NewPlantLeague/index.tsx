import React from 'react';
import { Text, Flex } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import AlliancePlanet from './components/AlliancePlanet';
import Explore from './components/Explore';
import RightFloatBox from './components/RightFloat';

const NewPlantLeague: React.FC = () => {
  useFetchAllianceView();

  return (
    <Layout>
      <AlliancePlanet />
      <Explore />
      <RightFloatBox />
    </Layout>
  );
};

export default NewPlantLeague;
