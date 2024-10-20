import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, UserProfile } from '@/src/types/enum'



const initialState: UserProfile = {
  name: '',
  gender: 'male',
  avatar_url: '',
  dob: '',
  _id: '',
  email: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<UserProfile>) {
      state = action.payload
    },
    getProfile(state, action: PayloadAction<User>) {
      state = action.payload
    },
  },
})

export const { updateProfile, getProfile } = userSlice.actions

const userReducer = userSlice.reducer
export default userReducer
