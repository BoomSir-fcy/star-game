import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from 'apis';

export const fetchBuildingsListAsync = createAsyncThunk(
  'fetch/buildings/list',
  async (type?: 1 | 2) => {
    const response = await Api.BuildingApi.getBuildingList(type);
    if (Api.isSuccess(response)) {
      return response.data.Data;
    }
    return [];
  },
);
