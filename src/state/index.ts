import { configureStore } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { useDispatch, useSelector } from 'react-redux'
import user from './user/reducer'
import userInfoReducer from './userInfo/reducer'
import { updateVersion } from './global/actions'
import { State } from './types'

const PERSISTED_KEYS: string[] = ['user']

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    user,
    userInfo: userInfoReducer,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export function useStore<TSelected>(
  selector: (state: State) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
) {
  return useSelector<State, TSelected>(selector, equalityFn);
}

export default store
