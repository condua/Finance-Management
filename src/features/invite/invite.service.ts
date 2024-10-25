import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '@/src/config';

interface InviteMemberResponse {
  message: string;
}

interface InviteMemberRequest {
  walletId: string;
  userId: string;
  inviterId: string;
}

export const inviteMemberService = createApi({
  reducerPath: 'inviteMemberService',
  baseQuery: fetchBaseQuery({ baseUrl: config.api.baseUrl }), // Base URL from your config
  endpoints: (builder) => ({
    inviteMember: builder.mutation<InviteMemberResponse, InviteMemberRequest>({
      query: ({ walletId, userId, inviterId }) => ({
        url: `${config.api.endpoints.wallets}/${walletId}/invite/${userId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': inviterId, // Custom header for inviter ID
        },
        body: {
            inviterId,
          },
      }),
      transformResponse: (response: InviteMemberResponse) => response,
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }], // Invalidate to refresh cache
    }),
  }),
});

export const { useInviteMemberMutation } = inviteMemberService;
