import { Api } from 'apis';

export const fetchUnitList = async (
  race: number,
): Promise<{ [id: string]: Api.Game.UnitInfo }> => {
  try {
    const res = await Api.GameApi.getGameUnitList(race);
    if (Api.isSuccess(res)) {
      return res.data.units;
    }
    return {};
  } catch (error) {
    console.error(`fetch fetchUnitList error: ${error}`);
    return {};
  }
};

export const fetchGamePlanetUnits = async (
  id: number,
): Promise<Api.Game.UnitPlanetPos[]> => {
  try {
    const res = await Api.GameApi.getGamePlanetUnits(id);
    if (Api.isSuccess(res)) {
      return res.data.units.units;
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchGamePK = async (planetId1: number, planetId2: number) => {
  try {
    const res = await Api.GameApi.gamePK(planetId1, planetId2);
    console.log(res);
    if (Api.isSuccess(res)) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
