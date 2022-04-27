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

export const fetchGamePlanetUnitsTest = async (
  tag: string,
): Promise<{
  units1: Api.Game.UnitPlanetPos[];
  units2: Api.Game.UnitPlanetPos[];
  tag: string;
} | null> => {
  try {
    const res = await Api.GameApi.testGet(tag);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchGamePK = async (
  planetId1: number,
  planetId2: number,
  maxRound?: number,
) => {
  try {
    const res = await Api.GameApi.gamePK(planetId1, planetId2, maxRound);
    if (Api.isSuccess(res)) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchGamePlunderPk = async (id = '5000000000000002') => {
  // TODO:
  return fetchGamePKTest(`t-${id}`);
};

export const fetchGameMatchUser = async () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({});
    }, 2000);
  });
};

export const fetchGamePKTest = async (
  tag: string,
  maxRound?: number,
  terrain_id?: number,
) => {
  try {
    const res = await Api.GameApi.testPk(tag, maxRound, terrain_id);
    if (Api.isSuccess(res)) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 获取地形
export const fetchGameterrain = async () => {
  try {
    const res = await Api.GameApi.Gameterrain();
    if (Api.isSuccess(res)) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
