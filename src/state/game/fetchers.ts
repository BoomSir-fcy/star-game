import { Api } from 'apis';

export const fetchUnitList = async (
  race: Api.Game.race,
): Promise<Api.Game.UnitInfo[]> => {
  try {
    const res = await Api.GameApi.getGameUnitList(race);
    if (Api.isSuccess(res)) {
      return res.data.units;
    }
    return [];
  } catch (error) {
    console.error(`fetch fetchUnitList error: ${error}`);
    return [];
  }
};

export const fetchGamePlanetUnits = async (id: number): Promise<any> => {
  try {
    const res = await Api.GameApi.getGamePlanetUnits(id);
    if (Api.isSuccess(res)) {
      // return res.data.units;
    }
    return []
  } catch (error) {
    console.error(error);
    return []
  }
}