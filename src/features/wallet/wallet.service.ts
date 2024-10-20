import {
  Response,
  Wallet,
  WalletResponse,
  Message,
} from '@/src/types/enum'

import config from '@/src/config'
import { appApi } from '@/src/features/api.service'

interface WalletRequest {
  name: string
  type: 'shared' | 'private',
  icon: string
}

export const walletApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    createFirstWallet: builder.mutation<
      WalletResponse,
      {
        wallet: WalletRequest
      }
    >({
      query: (body) => ({
        url: config.api.endpoints.wallets,
        method: 'POST',
        body: body.wallet,
      }),
      transformResponse: (response: { metadata: WalletResponse }) => response.metadata,
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),
    createNewWallet: builder.mutation<Response<WalletResponse>, WalletRequest >({
      query: (body) => ({
        url: config.api.endpoints.wallets,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),

    updateWallet: builder.mutation<
      WalletResponse,
      {
        walletId: string
        wallet: Pick<Wallet, 'name' >
      }
    >({
      query: (body) => ({
        url: `${config.api.endpoints.wallets}/${body.walletId}`,
        method: 'PATCH',
        body: body.wallet,
      }),
      transformResponse: (response: { metadata: WalletResponse }) => response.metadata,
      invalidatesTags: (result, error, data) => [{ type: 'Wallet', id: data.walletId }],
    }),

    deleteWallet: builder.mutation<
      Response<WalletResponse>,
      {
        walletId: string
      }
    >({
      query: (body) => ({
        url: `${config.api.endpoints.wallets}/${body.walletId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),

    getAllWallets: builder.query<Wallet[], void>({
      query: () => ({
        url: config.api.endpoints.wallets,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: Wallet[] }) => response.metadata,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Wallet' as const, id: _id })),
              { type: 'Wallet', id: 'LIST' },
            ]
          : [{ type: 'Wallet' as const, id: 'LIST' }],
    }),

    getWalletById: builder.query<Wallet, { walletId: string }>({
      query: (payload) => ({
        url: `${config.api.endpoints.wallets}/${payload.walletId}`,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: Wallet }) => response.metadata,
      providesTags: (result) =>
        result
          ? [
              { type: 'Wallet', id: result._id },
              { type: 'Wallet' as const, id: 'LIST' },
            ]
          : [{ type: 'Wallet', id: 'LIST' }],
    }),    
  }),
  overrideExisting: true,
})

export const {
  useCreateFirstWalletMutation,
  useCreateNewWalletMutation,
  useUpdateWalletMutation,
  useDeleteWalletMutation,
  useGetWalletByIdQuery,
  useGetAllWalletsQuery,
  
} = walletApi
