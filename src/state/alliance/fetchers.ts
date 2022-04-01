import { Api } from 'apis';

export const fetchMyPlanetAlliance = async () => {
  try {
    const res = await Api.AllianceApi.getMyPlanetAlliance();
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchMyPlanetAlliance error: ${error}`);
    return null;
  }
};
