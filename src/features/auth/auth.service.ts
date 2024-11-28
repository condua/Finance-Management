import { Auth, AuthState, Response, UserProfile } from '@/src/types/enum'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {baseQuery} from '@/src/features'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<Auth, LoginRequest>({
      query: (body) => {
        return {
          url: '/auth/login',
          method: 'POST',
          body,
        }
      },
      transformResponse: (response: { metadata: Auth }) => response.metadata,
    }),
    signup: builder.mutation<Auth, RegisterRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { metadata: Auth }) => response.metadata,
    }),

    logout: builder.mutation<Response<Auth>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation<UserProfile, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/changePassword',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { metadata: UserProfile }) => response.metadata,
    }),
    sendEmail: builder.mutation<Response<{ message: string }>, { email: string }>({
      query: (body) => ({
        url: '/auth/send-email',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<Response<{ message: string }>, { email: string; otp: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    changePasswordByOtp: builder.mutation<Response<{ message: string }>, { email: string; otp: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/change-password-by-otp',
        method: 'POST',
        body,
      }),
    }),
    resendOtp: builder.mutation<Response<{ message: string }>, { email: string }>({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const 
{ useLoginMutation, 
  useSignupMutation, 
  useLogoutMutation, 
  useChangePasswordMutation,   
  useSendEmailMutation,
  useVerifyOtpMutation,
  useChangePasswordByOtpMutation,
  useResendOtpMutation, 
} = authApi
