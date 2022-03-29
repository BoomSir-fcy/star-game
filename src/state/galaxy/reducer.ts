import { createSlice } from '@reduxjs/toolkit';
import {} from 'process';
import { AppThunk, GalaxyState } from 'state/types';
import { fetchGalaxyList, fetchGalaxyStarList } from './fetchers';
import { sliceByLevels } from './util';

export const initialState: GalaxyState = {
  galaxyList: [],
  galaxyStarList: [],
  loading: false,
  currentGalaxy: {
    id: 0,
    label: '',
  },
  currentStarPeriod: { id: 0, label: '', levels: [] },
};

export const fetchGalaxyListAsync = (): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  const list = await fetchGalaxyList();
  dispatch(setGalaxyList(list));
};

export const fetchGalaxyStarListAsync =
  (galaxyId: number): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));
    const list = await fetchGalaxyStarList(galaxyId);
    dispatch(setGalaxyStarList(list));
  };

export const galaxySlice = createSlice({
  name: 'galaxy',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGalaxyList: (state, action) => {
      const { payload } = action;
      if (payload) {
        const list = payload?.map((item: any) => {
          return { ...item, label: item.name };
        });
        state.galaxyList = list;
        state.currentGalaxy = list[0];
        state.loading = false;
      }
    },
    setGalaxyStarList: (state, action) => {
      const { payload } = action;
      if (payload) {
        const rsData = payload.data || [];
        const galaxy = {
          ...state.currentGalaxy,
          starTotal: rsData.length,
          starOwnerTotal: rsData.filter((v: any) => v.owner).length,
        };
        const users: Api.Galaxy.OwnerInfo = payload.users || {};
        const list = rsData.map((item: any) => {
          if (item.owner) {
            return { ...item, ownerAvatar: users[item.owner]?.avatar };
          }
          return { ...item, ownerAvatar: '' };
        });
        // 截取10个为一组
        const levelList = sliceByLevels(list);
        state.currentGalaxy = galaxy;
        state.galaxyStarList = levelList;
        state.currentStarPeriod = levelList[0];
        state.loading = false;
      }
    },
    setCurrentGalaxy: (state, action) => {
      const { payload } = action;
      state.currentGalaxy = payload;
    },
    setCurrentStar: (state, action) => {
      const { payload } = action;
      state.currentStarPeriod = payload;
    },
  },
});

// Actions
export const {
  setGalaxyList,
  setGalaxyStarList,
  setLoading,
  setCurrentGalaxy,
  setCurrentStar,
} = galaxySlice.actions;

export default galaxySlice.reducer;
