import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, Tokens, User } from '@/src/types/enum'
import { authApi } from '@/src/features/auth/auth.service'
import { walletApi } from '../wallet/wallet.service'

const initialState: AuthState = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  user: {} as User,
  isAuthenticated: false,
  walletId: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthState>) {
      const { tokens, user, walletId } = action.payload
      state.tokens = tokens
      state.user = user
      state.isAuthenticated = true
      state.walletId = walletId
    },
    setDefaultWallet(state, action: PayloadAction<string>) {
      state.walletId = action.payload
    },
    clearAuth(state) {
      state.tokens = {
        accessToken: '',
        refreshToken: '',
      }
      state.user = {} as User
      state.isAuthenticated = false
      state.walletId = ''
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      const { tokens, user } = payload
      state.tokens = tokens
      state.user = user
      state.isAuthenticated = true
      state.walletId = user.wallets[0]
    })
    builder.addMatcher(authApi.endpoints.signup.matchFulfilled, (state, { payload }) => {
      const { tokens, user } = payload
      state.tokens = tokens
      state.user = user
      state.isAuthenticated = true
    })
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.tokens = {
        accessToken: '',
        refreshToken: '',
      }
      state.user = {} as User
      state.isAuthenticated = false
      state.walletId = ''
    })
    builder.addMatcher(walletApi.endpoints.createFirstWallet.matchFulfilled, (state, { payload }) => {
      state.walletId = payload._id
    })
    // Sử dụng matcher cho các hành động bị từ chối
    builder.addMatcher(
      (action) => isRejectedWithValue(action) && action.type.startsWith('authApi/'),
      (state) => {
        state.isAuthenticated = false
        state.tokens = {
          accessToken: '',
          refreshToken: '',
        }
      }
    )
  },
})

export const { setAuth, clearAuth, setDefaultWallet } = authSlice.actions

const authReducer = authSlice.reducer
export default authReducer
