import { walletApi } from '@/src/features/wallet/wallet.service'
import { Amount, Budget, FinancialPlan, Goal } from '@/src/types/enum'
import { appApi } from '@/src/features/api.service';


type PlanRequest = Omit<FinancialPlan, '_id'>
 

export const planApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlans: builder.query<FinancialPlan[], { walletId: string; type: string }>({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}?type=${data.type}`,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: FinancialPlan[] }) => response.metadata,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Plan' as const, id: _id })),
              { type: 'Plan', id: 'LIST' },
            ]
          : [{ type: 'Plan' as const, id: 'LIST' }],
    }),
    getPlanById: builder.query<FinancialPlan, { walletId: string; planId: string }>({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}/${data.planId}`,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,
      providesTags: (result, error, data) => [{ type: 'Plan', id: data.planId }],
    }),

    createPlan: builder.mutation<FinancialPlan, { walletId: string; body: PlanRequest }>({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}`,
        method: 'POST',
        body: data.body,
      }),
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,
      invalidatesTags: (result, error, data) => [{ type: 'Plan' as const, id: 'LIST' }],
    }),

    updatePlan: builder.mutation<
      FinancialPlan,
      {
        walletId: string
        planId: string
        type: string
        body: Omit<FinancialPlan, '_id'>
      }
    >({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}/${data.planId}?type=${data.type}`,
        method: 'PATCH',
        body: data.body,
      }),
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,
      invalidatesTags: (result, error, data) => [{ type: 'Plan', id: result?._id }],
    }),
    deletePlan: builder.mutation<
      FinancialPlan,
      {
        walletId: string
        planId: string
        type: string
      }
    >({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}/${data.planId}?type=${data.type}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,

      invalidatesTags: (result, error, data) => [{ type: 'Plan', id: 'LIST' }],
    }),

    addAmountToGoal: builder.mutation<
      FinancialPlan,
      { walletId: string; planId: string; record: Omit<Amount, '_id'> }
    >({
      query: (data) => {
        return {
          url: `/financialPlans/${data.walletId}/${data.planId}/records`,
          method: 'POST',
          body: data.record,
        }
      },
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,
      invalidatesTags: (result, error, data) => [{ type: 'Plan', id: result?._id }],
    }),

    updateAmountToGoal: builder.mutation<
      FinancialPlan,
      {
        walletId: string
        planId: string
        recordId: string
        record: Omit<Amount, '_id'>
      }
    >({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}/${data.planId}/records/${data.recordId}`,
        method: 'PATCH',
        body: data.record,
      }),
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,
      invalidatesTags: (result, error, data) => [
        { type: 'Plan', id: result?._id },
        { type: 'Plan', id: 'LIST' },
      ],
    }),

    deleteAmountGoal: builder.mutation<
      FinancialPlan,
      {
        walletId: string
        planId: string
        recordId: string
      }
    >({
      query: (data) => ({
        url: `/financialPlans/${data.walletId}/${data.planId}/records/${data.recordId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { metadata: FinancialPlan }) => response.metadata,
      invalidatesTags: (result, error, data) => [
        { type: 'Plan', id: data?.planId },
        { type: 'Plan', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetAllPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useAddAmountToGoalMutation,
  useUpdateAmountToGoalMutation,
  useDeleteAmountGoalMutation,
} = planApi
