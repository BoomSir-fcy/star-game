import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, GalaxyState } from 'state/types';
import {
  fetchAllLogs,
  fetchAuctionRecordList,
  fetchGalaxyList,
  fetchGalaxyStarList,
  fetchGetNftView,
  fetchOwnerInfo,
} from './fetchers';
import { getGalaxyIncoming, sliceByLevels } from './util';

export const initialState: GalaxyState = {
  galaxyList: [],
  galaxyStarList: [],
  loadingGalaxy: false,
  loading: false,
  currentGalaxy: {
    id: 0,
    label: '',
    badge: false,
    starTotal: 0,
    starOwnerTotal: 0,
    nickname: '',
  },
  currentStarPeriod: { id: 0, label: '', levels: [] },
  galaxyNft: {
    id: '',
    lastPrice: '0',
    currentPrice: '0',
    miniBuyDuration: '0',
    lastTimestamp: '0',
  },
  auctionRecordList: [],
  AllLogs: [],
  OwnerInfo: {
    hold_time: 0,
    nickname: '',
    avatar: '',
    owner_get_box: 0,
    all_get_box: 0,
    all_auction_num: 0,
    power: 0,
  },
  galaxy_total_box: 0,
  planet_total_box: 0,
};

export const fetchGalaxyListAsync = (): AppThunk => async dispatch => {
  dispatch(setLoadingGalaxy(true));
  const list = await fetchGalaxyList();
  dispatch(setGalaxyList(list));
};

export const fetchAllLogsAsync = (): AppThunk => async dispatch => {
  const list = await fetchAllLogs();
  dispatch(setAllLogsList(list));
};

export const fetchOwnerInfoAsync =
  (nft_id: number): AppThunk =>
  async dispatch => {
    const info = await fetchOwnerInfo(nft_id);
    dispatch(setOwnerInfo(info));
  };

export const fetchGalaxyStarListAsync =
  (galaxyId: number): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));
    const list = await fetchGalaxyStarList(galaxyId);
    dispatch(setGalaxyStarList(list));
  };
export const fetchGetNftViewAsync =
  (tokenId: number): AppThunk =>
  async dispatch => {
    const nft = await fetchGetNftView(tokenId);
    dispatch(setGalaxyNft(nft));
  };

export const fetchAuctionRecordListAsync =
  (galaxyId: number): AppThunk =>
  async dispatch => {
    const list = await fetchAuctionRecordList(galaxyId);
    dispatch(setAuctionRecordList(list));
  };

export const galaxySlice = createSlice({
  name: 'galaxy',
  initialState,
  reducers: {
    setLoadingGalaxy: (state, action) => {
      state.loadingGalaxy = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGalaxyList: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.galaxyList = payload.data;
        state.galaxy_total_box = payload.galaxy_total_box;
        state.planet_total_box = payload.planet_total_box;
        state.loadingGalaxy = false;
      }
    },
    setGalaxyStarList: (state, action) => {
      const { payload } = action;
      if (payload) {
        const rsData = payload.data || [];
        const users: Api.Galaxy.OwnerInfo = payload.users || {};
        const list = rsData.map((item: any) => {
          if (item.owner) {
            return {
              ...item,
              ownerAvatar: users[item.owner]?.avatar,
              nick_name: users[item.owner]?.nickname,
            };
          }
          return { ...item, ownerAvatar: '', nick_name: '' };
        });
        state.galaxyStarList = list;
        state.loading = false;
      }
    },
    setCurrentGalaxy: (state, action) => {
      const { payload } = action;
      state.currentGalaxy = { ...state.currentGalaxy, ...payload };
    },
    setCurrentStarPeriod: (state, action) => {
      const { payload } = action;
      state.currentStarPeriod = payload;
    },
    setGalaxyNft: (state, action) => {
      const { payload } = action;
      state.galaxyNft = payload;
    },
    setAuctionRecordList: (state, action) => {
      const { payload } = action;
      state.auctionRecordList = payload;
    },
    setAllLogsList: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.AllLogs = payload;
      }
    },
    setOwnerInfo: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.OwnerInfo = payload;
      }
    },
  },
});

// Actions
export const {
  setGalaxyList,
  setGalaxyStarList,
  setLoadingGalaxy,
  setLoading,
  setCurrentGalaxy,
  setCurrentStarPeriod,
  setGalaxyNft,
  setAuctionRecordList,
  setAllLogsList,
  setOwnerInfo,
} = galaxySlice.actions;

export default galaxySlice.reducer;
