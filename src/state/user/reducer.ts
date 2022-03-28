import { createReducer } from '@reduxjs/toolkit'
import { updateVersion } from '../global/actions'
import {
  toggleTheme,
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  isDark: boolean

}


export const initialState: UserState = {
  isDark: false,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    
    .addCase(toggleTheme, (state) => {
      state.isDark = !state.isDark
    }),
)
