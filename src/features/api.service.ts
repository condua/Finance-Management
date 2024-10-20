import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/src/features'
import config from '@/src/config'

export const appApi = createApi({
  reducerPath: 'appApi',
  tagTypes: ['Wallet', 'Transaction', 'Plan', 'Category', 'User', 'Message'],
  baseQuery,
  endpoints: (builder) => ({
}),
})


