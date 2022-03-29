import { Api } from 'apis';

export const fetchGalaxyList = async (): Promise<Api.Galaxy.GalaxyInfo[]> => {
  try {
    const res = await Api.GalaxyApi.getGalaxyList();
    if (Api.isSuccess(res)) {
      return res.data?.data || [];
    }
    return [];
  } catch (error) {
    console.error(`fetch fetchGalaxyList error: ${error}`);
    return [];
  }
};

export const fetchGalaxyStarList = async (
  galaxyId: number,
): Promise<Api.Galaxy.GalaxyStarList> => {
  try {
    const res = await Api.GalaxyApi.getGalaxyStarList(galaxyId);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return {
      galaxy: {},
      data: [],
      users: {},
    };
  } catch (error) {
    console.error(`fetch fetchGalaxyStarList error: ${error}`);
    return {
      galaxy: {},
      data: [],
      users: {},
    };
  }
};
