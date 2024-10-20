import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {Category } from '@/src/types/enum'
const initialState: Category = {
  _id: '',
  name: '',
  icon: '',
  type: 'expense'
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
   
  },
})

export const {  } = categorySlice.actions

const categoryReducer = categorySlice.reducer
export default categoryReducer
