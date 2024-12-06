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
// Define an interface for the inviteMember request
interface InviteMemberRequest {
  walletId: string;
  userId: string;
  inviterId: string;
}
// Define an interface for the respondToInvitation request
interface RespondToInvitationRequest {
  userId? : string,
  walletId: string;
  response: 'accept' | 'decline';
}

interface PromoteMember {
  ownerId?: string;
  walletId: string;
  memberId: string;
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
// Add inviteMember mutation here
inviteMemberWallet: builder.mutation<Response<{ message: string }>, InviteMemberRequest>({
  query: (body) => {
    const { walletId, userId } = body; // Lấy walletId và userId từ body
    return {
      url: `${config.api.endpoints.wallets}/${walletId}/invite/${userId}`, // Đảm bảo endpoint chính xác
      method: 'POST',
      body: {
        inviterId: body.inviterId, // Gửi inviterId trong body
      },
    };
  },
  invalidatesTags: (result, error, { walletId }) => [{ type: "Wallet", id: walletId }], // Điều chỉnh dựa trên cách bạn muốn xử lý cache
}),

 // Add respondToInvitation mutation here
 respondToInvitation: builder.mutation<Response<{ message: string }>, RespondToInvitationRequest>({
  query: (body) => ({
    url: `${config.api.endpoints.wallets}/${body.walletId}/respond`,
    method: 'POST',
    body: {
      response: body.response,
    },
  }),
  invalidatesTags: (result, error, body, walletId) => [
    { type: 'User', id: 'PARTIAL-LIST' }, // Làm mới danh sách Wallet
    { type: 'User', id: body?.userId },
     // Làm mới dữ liệu của User sau khi chấp nhận/từ chối
  ],
}),





promoteToOwner: builder.mutation<Response<{ message: string }>, PromoteMember>({
  query: (body) => ({
    url: `${config.api.endpoints.wallets}/${body.walletId}/promote/owner/${body.memberId}`,
    method: 'POST',
    headers: {
      ownerId: body.ownerId
    },
  }),
  invalidatesTags: (result, error, { walletId }) => [{ type: "Wallet", id: walletId }], // Điều chỉnh dựa trên cách bạn muốn xử lý cache
}),

promoteToAdmin: builder.mutation<Response<{ message: string }>, PromoteMember>({
  query: (body) => ({
    url: `${config.api.endpoints.wallets}/${body.walletId}/promote/${body.memberId}`,
    method: 'POST',
    headers: {
      ownerId: body.ownerId
    },
  }),
  invalidatesTags: (result, error, { walletId }) => [{ type: "Wallet", id: walletId }], // Điều chỉnh dựa trên cách bạn muốn xử lý cache
}),

demoteFromAdmin: builder.mutation<Response<{ message: string }>, PromoteMember>({
  query: (body) => ({
    url: `${config.api.endpoints.wallets}/${body.walletId}/demote/${body.memberId}`,
    method: 'POST',
    body: {
      ownerId: body.ownerId, // Optional, depending on API requirements
    },
  }),
  invalidatesTags: (result, error, { walletId }) => [{ type: "Wallet", id: walletId }], // Điều chỉnh dựa trên cách bạn muốn xử lý cache
}),

removeMember: builder.mutation<
  Response<{ message: string }>,
  {
    walletId: string;
    memberId: string;
    ownerId?: string; // Optional nếu ownerId được truyền qua headers
  }
>({
  query: (body) => ({
    url: `${config.api.endpoints.wallets}/${body.walletId}/remove/${body.memberId}`,
    method: 'POST',
    headers: {
      ownerId: body.ownerId, // Optional nếu API yêu cầu
    },
  }),
  invalidatesTags: (result, error, body) => [
    { type: 'Wallet', id: body.walletId }, // Làm mới cache Wallet liên quan
    { type: 'Wallet', id: 'LIST' }, // Làm mới danh sách Wallet
  ],
}),
leaveWallet: builder.mutation<Response<{ message: string }>, { walletId: string }>({
  query: (body) => ({
    url: `${config.api.endpoints.wallets}/${body.walletId}/leave`,
    method: 'POST',
  }),
  invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
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
  useInviteMemberWalletMutation,
  useRespondToInvitationMutation,
  usePromoteToOwnerMutation,
  usePromoteToAdminMutation,
  useDemoteFromAdminMutation,
  useRemoveMemberMutation,
  useLeaveWalletMutation,
} = walletApi
