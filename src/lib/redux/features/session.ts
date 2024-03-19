import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

export const initialState = {
  activeClient: null as Nullable<string>,
  showClientSelector: true,
}

export type SessionState = typeof initialState

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setActiveClient: (state, action: PayloadAction<string>) => {
      if (!z.string().uuid().safeParse(action.payload).success) return
      state.activeClient = action.payload
    },
    unsetActiveClient: (state) => {
      state.activeClient = null
    },
    showClientSelector: (state) => {
      state.showClientSelector = true
    },
    hideClientSelector: (state) => {
      state.showClientSelector = false
    },
  },
})

export const sessionActions = sessionSlice.actions

export const sessionSelector = (state: { session: SessionState }) =>
  state.session

export default sessionSlice.reducer
