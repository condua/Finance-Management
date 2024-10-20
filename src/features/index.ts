import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { RootState } from '@/src/store/store'
import config from '@/src/config' 

const UPLOAD_ENDPOINTS = ['scanImageReceipts', 'updateProfile']

export const baseQuery = fetchBaseQuery({
  baseUrl: config.api.baseUrl,
  timeout: config.api.timeout,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const { user, tokens } = (getState() as RootState).auth
     if (!UPLOAD_ENDPOINTS.includes(endpoint)) {
       headers.set('content-type', 'application/json')
     }
    // If we have a token set in state, let's assume that we should be passing it.
    if (tokens) {
      headers.set('authorization', `${tokens.accessToken}`)
    }
    if (user._id) {
      headers.set('x-client-id', `${user._id}`)
    }
    return headers
  },
})
