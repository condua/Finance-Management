import { Response, Transaction } from '@/src/types/enum'
import { appApi } from '@/src/features/api.service'

interface ScanImageReceiptsResponse {
  img_url: string
  title: string
  currency_code: string
  createdAt: string
  total: number
}

interface ListResponse<T> {
  offset: number // id of the last item in the previous page
  limit: number // number of items in the current page
  sort: string // sort order desc or asc
  period: string // period of the transactions 'day' | 'week' | 'month' | 'year'
  last: string // 'day' | 'week' | 'month' | 'year'
  data: T[]
}


export const transactionApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<
      Transaction[],
      {
        walletId: string
        query: {
          period?: string
          sort?: string
          type?: string
          limit?: string
          offset?: string
          startDate?: string
          endDate?: string
        }
        categories?: string[]
        search?: string
      }
    >({
      query: (data) => ({
        url: `/transactions/${data.walletId}?${new URLSearchParams(
          data.query
        ).toString()}&category=${data.categories ? data.categories?.join(',') : ''} `,
        method: 'GET',
      }),
      transformResponse: (response: Response<Transaction[]>) => response.metadata,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Transaction' as const, id: _id })),
              { type: 'Transaction', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Transaction', id: 'PARTIAL-LIST' }],
    }),
    createTransaction: builder.mutation<
      Response<Transaction>,
      {
        transaction: Omit<Transaction, '_id'>
        walletId: string
      }
    >({
      query: (body) => ({
        url: `/transactions/${body.walletId}`,
        method: 'POST',
        body: body.transaction,
      }),

      invalidatesTags: (result, error) =>
        error
          ? []
          : [
              { type: 'Transaction', id: 'PARTIAL-LIST' },
              { type: 'Wallet', id: 'LIST' },
              { type: 'Plan', id: 'LIST' },
              { type: 'Plan', id: 'id' },
            ],
    }),

    getTransactionById: builder.query<Transaction, { transactionId: string; walletId: string }>({
      query: (data) => ({
        url: `/transactions/${data.walletId}/${data.transactionId}`,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: Transaction }) => response.metadata,
      providesTags: (result, error, data) =>
        result ? [{ type: 'Transaction', id: result._id }] : [{ type: 'Transaction', id: 'LIST' }],
    }),
    updateTransaction: builder.mutation<
      Response<Transaction>,
      {
        id: string
        walletId: string
        updatedTransaction: Omit<Transaction, '_id'>
      }
    >({
      query: (data) => ({
        url: `/transactions/${data.walletId}/${data.id}`,
        method: 'PATCH',
        body: data.updatedTransaction,
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'Transaction', id: data.id },
        { type: 'Transaction', id: 'PARTIAL-LIST' },
        { type: 'Wallet', id: 'LIST' },
        { type: 'Plan', id: 'LIST' },
      ],
    }),

    deleteTransaction: builder.mutation<
      Response<Transaction>,
      {
        id: string
        walletId: string
      }
    >({
      query: (data) => ({
        url: `/transactions/${data.walletId}/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'Transaction', id: data.id },
        { type: 'Transaction', id: 'PARTIAL-LIST' },
        { type: 'Wallet', id: 'LIST' },
        { type: 'Plan', id: 'LIST' },
      ],
    }),

    scanImageReceipts: builder.mutation<ScanImageReceiptsResponse, { image: any }>({
      query: (body) => {
        const formData = new FormData()
        formData.append('file', body.image)
        return {
          url: '/transactions/scanReceipt',
          method: 'POST',
          body: formData,
        }
      },
      transformResponse: (response: Response<ScanImageReceiptsResponse>) => response.metadata,
    }),
  }),
  overrideExisting: true,
})

export const {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
  useGetTransactionByIdQuery,
  useScanImageReceiptsMutation,
  useGetAllTransactionsQuery
} = transactionApi
