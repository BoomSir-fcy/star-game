import { configureStore } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import { useDispatch, useSelector } from 'react-redux';
import user from './user/reducer';
import userInfoReducer from './userInfo/reducer';
import mysteryBoxReducer from './mysteryBox/reducer';
import galaxyReducer from './galaxy/reducer';
import planetReducer from './planet/reducer';
import allianceReducer from './alliance/reducer';
import buildlingReducer from './buildling/reducer';
import gameReducer from './game/reducer';
import guideReducer from './guide/reducer';
import { updateVersion } from './global/actions';

import buildingAction from './buildling/action';
import guideAction from './guide/actions';

export { useStore } from './util';

const PERSISTED_KEYS: string[] = ['user'];

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    user,
    userInfo: userInfoReducer,
    mysteryBox: mysteryBoxReducer,
    galaxy: galaxyReducer,
    planet: planetReducer,
    alliance: allianceReducer,
    buildling: buildlingReducer,
    game: gameReducer,
    guide: guideReducer,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({ thunk: true }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch();

export const storeAction = {
  ...buildingAction,
  ...guideAction,
};

export default store;
