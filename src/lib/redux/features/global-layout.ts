import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  isSessionSidebarOpen: true,
}

export type GlobalLayoutState = typeof initialState

export const globalLayoutSlice = createSlice({
  name: 'globalLayout',
  initialState,
  reducers: {
    openSessionSidebar: (state) => {
      state.isSessionSidebarOpen = true
    },
    closeSessionSidebar: (state) => {
      state.isSessionSidebarOpen = false
    },
  },
})

export const globalLayoutActions = globalLayoutSlice.actions

export const globalLayoutSelector = (state: {
  globalLayout: GlobalLayoutState
}) => state.globalLayout

export default globalLayoutSlice.reducer
