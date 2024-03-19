import globalLayoutReducer from '@/lib/redux/features/global-layout'
import sessionReducer from '@/lib/redux/features/session'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      globalLayout: globalLayoutReducer,
      session: sessionReducer,
    }),
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']
