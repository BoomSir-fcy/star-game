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

export const fetchCombatRecord = async (
  address: string,
  page: number,
  page_size: number,
) => {
  try {
    const res = await Api.AllianceApi.getMyCombatRecord({
      address,
      page,
      page_size,
    });
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchMyPlanetAlliance error: ${error}`);
    return null;
  }
};
