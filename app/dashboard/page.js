'use client';

import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiEdit2, FiTrash2 } from 'react-icons/fi';
import TransactionHeader from '../component/TransactionHeader';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AddExpenseModal from '../component/AddExpenseModal';
import DeleteConfirmModal from '../component/DeleteConfirmModal';
import Header from '../component/Header';
import ExpenseTable from '../component/ExpenseTable';
import { 
  useGetTransactionsQuery, 
  useDeleteTransactionMutation, 
  useUpdateTransactionMutation, 
  useGetDashboardQuery
} from '../services/authApi';
import { toast } from 'react-toastify';

// ✅ Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const { data: transactions = [], isLoading, isError, refetch } = useGetTransactionsQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: dashboardData, isFetching: isDashboardFetching } = useGetDashboardQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: '',
    note: ''
  });
  
  // Load username from localStorage (set during login)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) setUsername(u.name);
      }
    } catch (_) {
      // ignore
    }
  }, []);
  
  // Filter transactions based on selected category, type and month
  const filteredExpenses = transactions.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesType = selectedType === 'all' || String(expense.type || '').toLowerCase() === selectedType;
    const expenseDate = new Date(expense.date);
    const matchesMonth = expenseDate.getMonth() === selectedMonth.getMonth() && 
                        expenseDate.getFullYear() === selectedMonth.getFullYear();
    return matchesCategory && matchesType && matchesMonth;
  });
  
  // Sort by newest first (by date, then by createdAt if available)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const ad = new Date(a.date);
    const bd = new Date(b.date);
    if (bd - ad !== 0) return bd - ad;
    const ac = a.createdAt ? new Date(a.createdAt) : 0;
    const bc = b.createdAt ? new Date(b.createdAt) : 0;
    return bc - ac;
  });
 
  const handleEdit = (id) => {
    console.log('Edit transaction:', id);
   
  };

  const handleDelete = (id) => {
    console.log('Delete transaction:', id);
    // Add delete functionality here
  };

  // Get unique categories for the filter from transactions data
  const categories = [...new Set(transactions.map(transaction => transaction.category))];

  // Calculate summary data based on filtered transactions
  const summaryData = filteredExpenses.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      const t = String(transaction.type || '').toLowerCase();
      if (t === 'income') {
        acc.income += amount;
      } else if (t === 'expense') {
        acc.expenses += amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );

  // Chart data (dynamic, filtered)
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const selectedYear = selectedMonth.getFullYear();
  // Year-wide filtering respects category filter but includes all months in the selected year
  const yearFiltered = transactions.filter((t) => {
    const d = new Date(t.date);
    const matchYear = d.getFullYear() === selectedYear;
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchYear && matchCategory;
  });

  const monthIncome = Array(12).fill(0);
  const monthExpense = Array(12).fill(0);
  yearFiltered.forEach((t) => {
    const idx = new Date(t.date).getMonth();
    const amt = Number(t.amount) || 0;
    const tt = String(t.type || '').toLowerCase();
    if (tt === 'income') monthIncome[idx] += amt;
    else if (tt === 'expense') monthExpense[idx] += amt;
  });

  const monthlyDatasets = [];
  if (selectedType === 'all' || selectedType === 'income') {
    monthlyDatasets.push({
      label: 'Income',
      data: monthIncome,
      backgroundColor: 'rgba(34,197,94,0.7)',
      borderRadius: 4,
    });
  }
  if (selectedType === 'all' || selectedType === 'expense') {
    monthlyDatasets.push({
      label: 'Expenses',
      data: monthExpense,
      backgroundColor: 'rgba(239,68,68,0.7)',
      borderRadius: 4,
    });
  }

  const monthlyData = {
    labels: monthLabels,
    datasets: monthlyDatasets,
  };

  // Category distribution reflecting selectedType
  const categoryByTypeMap = filteredExpenses.reduce((acc, t) => {
    const tt = String(t.type || '').toLowerCase();
    // When 'all' is selected, default to showing expenses only for meaningful "Spending"
    if (selectedType === 'all' && tt !== 'expense') return acc;
    // When a specific type is selected, include only that type
    if (selectedType !== 'all' && tt !== selectedType) return acc;
    const key = t.category || 'Others';
    const amt = Number(t.amount) || 0;
    acc[key] = (acc[key] || 0) + amt;
    return acc;
  }, {});
  const catLabels = Object.keys(categoryByTypeMap);
  const catValues = catLabels.map((k) => categoryByTypeMap[k]);
  const palette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#eab308', '#22d3ee', '#64748b'];
  const catColors = catLabels.map((_, i) => palette[i % palette.length]);

  const categoryData = {
    labels: catLabels.length ? catLabels : ['No expenses'],
    datasets: [
      {
        data: catValues.length ? catValues : [1],
        backgroundColor: catLabels.length ? catColors : ['#e5e7eb'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieTitle = selectedType === 'income' ? 'Income by Category' : 'Spending by Category';

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditExpense = (expense) => {
  console.log('Editing expense:', expense);
  setFormData({
    ...expense,
   
    date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });
  setShowAddExpense(true);
};

const handleDeleteExpense = (id) => {
  if (!id) {
    toast.error('Error: No transaction ID provided');
    return;
  }
  setDeleteTargetId(id);
  setDeleteModalOpen(true);
};

const confirmDelete = async () => {
  if (!deleteTargetId) return;
  setIsDeleting(true);
  try {
    const result = await deleteTransaction(deleteTargetId).unwrap();
    console.log('Delete result:', result);
    toast.success('Transaction deleted successfully');
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
    await refetch();
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    const errorMessage = error?.data?.message || error?.error || 'Failed to delete transaction';
    toast.error(errorMessage);
  } finally {
    setIsDeleting(false);
  }
};

  const handleAddExpense = async (e, result) => {
    try {
      // The actual create/update is now handled in AddExpenseModal
      // We just need to refresh the transactions list
      await refetch();
      resetFormData();
    } catch (error) {
      console.error('Error handling transaction:', error);
      // Error is already shown in AddExpenseModal
    }
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      type: '',
      note: ''
    });
  };

  const handleAddTransactionClick = () => {
    resetFormData();
    setShowAddExpense(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <Header username={username || 'User'} onLogout={() => console.log('Logged out')} />
      <TransactionHeader
        onAddTransaction={() => setShowAddExpense(true)}
        expenses={transactions}
        onCategoryChange={(category) => setSelectedCategory(category)}
        onMonthChange={(date) => setSelectedMonth(date)}
        selectedType={selectedType}
        onTypeChange={(t) => setSelectedType(t)}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Balance</p>
            <p className="text-2xl font-semibold">₹{summaryData.balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Income</p>
            <p className="text-2xl font-semibold">+₹{summaryData.income.toFixed(2)}</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <FiTrendingDown size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Expenses</p>
            <p className="text-2xl font-semibold">-₹{summaryData.expenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
          <div className="h-[300px]">
            <Bar data={monthlyData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">{pieTitle}</h3>
          {/* this fixes the "too large" issue */}
          <div className="w-full flex justify-center">
            <div className="aspect-square w-64 max-w-full">
              <Pie data={categoryData} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: true }} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => {
          setShowAddExpense(false);
          // Reset form data when modal is closed
          resetFormData();
        }}
        onSubmit={handleAddExpense}
        formData={formData}
        onInputChange={handleInputChange}
        isEditing={!!formData._id}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => { if (!isDeleting) { setDeleteModalOpen(false); setDeleteTargetId(null); } }}
      />

      <ExpenseTable 
       expenses={sortedExpenses} 
       onEdit={handleEditExpense} 
       onDelete={handleDeleteExpense} 
       isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
