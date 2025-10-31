import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Transactions'],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: 'user/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'user/logout',
        method: 'POST',
      }),
    }),
    
    // Transaction endpoints
    getTransactions: builder.query({
      query: () => 'transactions/all',
      providesTags: ['Transactions'],
    }),
    getTransaction: builder.query({
      query: (id) => `transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transactions', id }],
    }),
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: 'transactions/create',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transactions'],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `transactions/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transactions' },
        { type: 'Transactions', id },
      ],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transactions'],
    }),
    getDashboard: builder.query({
      query: () => 'dashboard',
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation, 
  useLogoutMutation,
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetDashboardQuery
} = authApi;
