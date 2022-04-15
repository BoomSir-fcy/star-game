import { Api } from 'apis';

export const fetchUnitList = async (
  race: number,
): Promise<Api.Game.UnitListRes | null> => {
  try {
    const res = await Api.GameApi.getGameUnitList(race);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchUnitList error: ${error}`);
    return null;
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

export const fetchGamePK = async (
  planetId1: number,
  planetId2: number,
  maxRound?: number,
) => {
  try {
    const res = await Api.GameApi.gamePK(planetId1, planetId2, maxRound);
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
