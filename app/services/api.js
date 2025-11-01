// app/ services/api
"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), 
  tagTypes: ["Transactions", "Dashboard", "Categories"],//Tag
  endpoints: (builder) => ({

    // DASHBOARD
    getDashboardData: builder.query({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
    }),

    //   // CATEGORIES
    // getCategories: builder.query({
    //   query: () => "categories",
    //   providesTags: ["Categories"],
    // }),

    //  TRANSACTIONS 
    getAllTransactions: builder.query({
      query: () => "transactions/all",
       providesTags: ["Transactions"],
    }),

    // getTransactionById: builder.query({
    //   query: (id) => `transactions/${id}`,
    //    providesTags: (result, error, id) => [{ type: "Transactions", id }],
    // }),

    createTransaction: builder.mutation({
      query: (data) => ({
        url: "transactions/create",
        method: "POST",
        body: data,
      }),
       // After creating a transaction → Refetch all transaction lists
      invalidatesTags: ["Transactions", "Dashboard"],
    }),

    //Update Transaction
    updateTransaction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Transactions", "Dashboard"],
    }),

    // Delete Transaction
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
    }),

    getTransactionsByCategory: builder.query({
      query: (categoryName) => `transactions/category?name=${categoryName}`,
       providesTags: ["Transactions"],
    }),

    getTransactionsByMonth: builder.query({
      query: (month) => `transactions/month?m=${month}`,
       providesTags: ["Transactions"], 
    }),

    getTransactionSummary: builder.query({
      query: () => "transactions/summary",
       providesTags: [" Dashboard"],
    }),

      // CATEGORY API INTEGRATION
    getCategories: builder.query({
      query: () => "categories",
      providesTags: ["Categories"]
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"]
    }),


  }),
});

// Auto generated Hooks
export const {
 
  useGetDashboardDataQuery,
  useGetAllTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsByCategoryQuery,
  useGetTransactionsByMonthQuery,
  useGetTransactionSummaryQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = api;
