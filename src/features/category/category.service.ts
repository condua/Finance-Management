import { AuthState, Category, Response } from '@/src/types/enum'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/src/features'
import categories from '@/src/constants/Categories'
import config from '@/src/config'
import { appApi } from '@/src/features/api.service'



interface CategoryRequest {
  name: string
  icon: string
  type: 'expense' | 'income'
}



export const categoryApi = appApi.injectEndpoints({
  
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: `${config.api.endpoints.categories}`,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: Category[] }) => response.metadata, // merge with default categories
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => ({
        url: `${config.api.endpoints.categories}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { metadata: Category }) => response.metadata,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (data) => ({
        url: `/categories`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { metadata: Category }) => response.metadata,
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Category, { id: string; body: Partial<CategoryRequest> }>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { metadata: Category }) => response.metadata,
      invalidatesTags:     [{ type: 'Category', id: 'LIST' }, { type: 'Transaction', id: 'LIST' }, { type: 'Plan', id: 'LIST' }],
    }),

    deleteCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }, {type: 'Transaction', id: 'LIST' }, { type: 'Plan', id: 'LIST' }, {type: 'Wallet', id: 'LIST' }],

    }),
  }),
  overrideExisting: true,
})

export const { useGetAllCategoriesQuery,useGetCategoryByIdQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } = categoryApi
