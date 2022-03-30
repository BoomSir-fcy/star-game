import { configureStore } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import { useDispatch, useSelector } from 'react-redux';
import user from './user/reducer';
import userInfoReducer from './userInfo/reducer';
import mysteryBoxReducer from './mysteryBox/reducer';
import galaxyReducer from './galaxy/reducer';
import planetReducer from './planet/reducer';
import { updateVersion } from './global/actions';

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

export default store;
