
'use client';

import { FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function ExpenseTable({ expenses = [], onEdit, onDelete, isLoading = false }) {
 

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              </td>
            </tr>
          ) : expenses.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                No transactions found
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense._id || expense.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(expense.date).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {expense.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    String(expense.type || '').toLowerCase() === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    String(expense.type || '').toLowerCase() === 'income' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                  }`}>
                    {String(expense.type || '').toLowerCase()}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right tabular-nums ${
                  String(expense.type || '').toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="inline-flex items-center gap-1 justify-end">
                    {String(expense.type || '').toLowerCase() === 'income' ? (
                      <FiTrendingUp className="inline-block" />
                    ) : (
                      <FiTrendingDown className="inline-block" />
                    )}
                    {String(expense.type || '').toLowerCase() === 'expense' ? '-' : '+'}
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(Number(expense.amount || 0))}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(expense)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-indigo-600 hover:text-white hover:bg-indigo-600 mr-2 transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Deleting expense with ID:', expense._id || expense.id); // Debug log
                      onDelete(expense._id || expense.id);
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}