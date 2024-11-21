// src/features/message/message.service.ts

import {
    Response,
    Message,
    MessageResponse,
  } from '@/src/types/enum';
  
  import config from '@/src/config';
  import { appApi } from '@/src/features/api.service';
  
  interface CreateMessageRequest {
    walletId: string; // ID của ví mà message sẽ được gửi tới
    userId: string;   // ID của người dùng gửi message
    content: string;  // Nội dung của message
    images?: string[]; // Mảng chứa các URL hoặc dữ liệu hình ảnh, có thể không bắt buộc
    video?: string;
  }
  
  export const messageApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
      createMessage: builder.mutation<MessageResponse, CreateMessageRequest>({
        query: ({ walletId, userId, content, images,video }) => ({
          url: `${config.api.endpoints.wallets}/${walletId}/message`,
          method: 'POST',
          body: {
            userId,
            content,
            images,
            video,
          },
        }),
        invalidatesTags: [{ type: 'Message', id: 'LIST' }],
      }),
      
      updateMessage: builder.mutation<
        MessageResponse,
        {
          messageId: string;
          message: Pick<Message, 'content'>;
        }
      >({
        query: (body) => ({
          url: `${config.api.endpoints.wallets}/${body.messageId}`,
          method: 'PATCH',
          body: body.message,
        }),
        invalidatesTags: (result, error, data) => [{ type: 'Message', id: data.messageId }],
      }),
  
      deleteMessage: builder.mutation<Response<MessageResponse>, { messageId: string }>({
        query: (body) => ({
          url: `${config.api.endpoints.wallets}/${body.messageId}`,
          method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Message', id: 'LIST' }],
      }),
  
      getAllMessagesByWalletId: builder.query<Message[], string>({
        query: (walletId) => ({
          url: `${config.api.endpoints.wallets}/${walletId}/messages`,
          method: 'GET',
        }),
        transformResponse: (response: { metadata: Message[] }) => response.metadata,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id }) => ({ type: 'Message' as const, id: _id })),
                { type: 'Message', id: 'LIST' },
              ]
            : [{ type: 'Message' as const, id: 'LIST' }],
      }),
  
      getMessageById: builder.query<Message, { messageId: string }>({
        query: (payload) => ({
          url: `${config.api.endpoints.wallets}/${payload.messageId}`,
          method: 'GET',
        }),
        transformResponse: (response: { metadata: Message }) => response.metadata,
        providesTags: (result) =>
          result
            ? [
                { type: 'Message', id: result._id },
                { type: 'Message' as const, id: 'LIST' },
              ]
            : [{ type: 'Message', id: 'LIST' }],
      }),
    }),
    overrideExisting: true,
  });
  
  export const {
    useCreateMessageMutation,
    useUpdateMessageMutation,
    useDeleteMessageMutation,
    useGetAllMessagesByWalletIdQuery,
    useGetMessageByIdQuery,
  } = messageApi;
  