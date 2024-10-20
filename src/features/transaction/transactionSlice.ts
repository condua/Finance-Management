import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {Transaction } from '@/src/types/enum'


interface ReceiptInfo {
  img_url: string
  total: number
  title: string
  createdAt: string
}

const initialState: Transaction = {
  _id: '',
  amount: 0,
  title: '',
  category: {
    _id: '',
    name: '',
    icon: '',
    type: 'expense',
  },
  createdAt: new Date().toString(),
  description: '',
  type: 'expense',
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    extractReceipt: (state, action: PayloadAction<ReceiptInfo>) => {
      state.amount = action.payload.total
      state.title = action.payload.title
      state.createdAt = new Date(action.payload.createdAt).toString()
      state.img_url = action.payload.img_url
    },
    setEdit: (state, action: PayloadAction<string>) => {
      state._id = action.payload
    },
    clearTransaction: () => initialState,
  },
})

export const { extractReceipt, setEdit, clearTransaction } = transactionSlice.actions

const transactionReducer = transactionSlice.reducer
export default transactionReducer
