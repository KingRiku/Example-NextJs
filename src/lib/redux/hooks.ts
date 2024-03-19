import type { AppDispatch, AppStore, RootState } from '@/lib/redux/store'
import {
  useDispatch,
  useSelector,
  useStore,
  type TypedUseSelectorHook,
} from 'react-redux'

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppStore: () => AppStore = useStore
