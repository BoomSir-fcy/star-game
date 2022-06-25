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
  start_time: number,
  end_time: number,
) => {
  try {
    const res = await Api.AllianceApi.getMyCombatRecord({
      address,
      start_time,
      end_time,
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
