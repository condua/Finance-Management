import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { WalletResponse, Wallet, WalletsState } from '@/src/types/enum'

const initialState: WalletsState = {
  wallets: [],
  currentWallet: '',
}

const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<WalletsState>) {
      state.currentWallet = action.payload.currentWallet
      state.wallets = action.payload.wallets
    },
    
  },
})

export const { setWallets } = walletSlice.actions

const walletReducer = walletSlice.reducer
export default walletReducer
