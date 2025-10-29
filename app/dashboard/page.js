'use client';

import { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus } from 'react-icons/fi';
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
import Header from '../component/Header';
import ExpenseTable from '../component/ExpenseTable';


// ✅ Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'food',
    type: 'expense',
    description: ''
  });
  const [expenses, setExpenses] = useState([
  // Sample data - replace with your actual data
  { id: 1, title: 'Grocery', category: 'Food', type: 'Expense', amount: 150.00, date: '2023-10-29' },
  { id: 2, title: 'Salary', category: 'Income', type: 'Income', amount: 3000.00, date: '2023-10-28' },
]);

  // ✅ Sample summary data
  const summaryData = {
    balance: 2450.75,
    income: 3500.0,
    expenses: 1049.25,
  };
  

  // ✅ Chart data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Income',
        data: [3000, 2800, 3200, 3000, 3500, 3400, 3600, 3500, 3400, 3500],
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: [2400, 2100, 2300, 2200, 2500, 2400, 2600, 2500, 2400, 2500],
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderRadius: 4,
      },
    ],
  };

  const categoryData = {
    labels: ['Food', 'Shopping', 'Bills', 'Entertainment', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3b82f6', // blue
          '#10b981', // green
          '#f59e0b', // yellow
          '#8b5cf6', // purple
          '#64748b', // gray
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

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
  // Handle edit logic here
  setFormData(expense);
  setShowAddExpense(true);
};

const handleDeleteExpense = (id) => {
  // Handle delete logic here
  setExpenses(expenses.filter(expense => expense.id !== id));
};

  const handleAddExpense = (e) => {
    e.preventDefault();
    console.log('Adding expense:', formData);
    setShowAddExpense(false);
    setFormData({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'food',
      type: 'expense',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <Header username="Dhanashree" onLogout={() => console.log('Logged out')} />
      <div className="flex justify-between items-center mb-6">
        
        <button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="mr-2" /> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Balance</p>
            <p className="text-2xl font-semibold">${summaryData.balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Income</p>
            <p className="text-2xl font-semibold">+${summaryData.income.toFixed(2)}</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <FiTrendingDown size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Expenses</p>
            <p className="text-2xl font-semibold">-${summaryData.expenses.toFixed(2)}</p>
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
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          {/* 👇 this fixes the "too large" issue */}
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
        onClose={() => setShowAddExpense(false)}
        onSubmit={handleAddExpense}
        formData={formData}
        onInputChange={handleInputChange}
      />

      <ExpenseTable 
       expenses={expenses}
       onEdit={handleEditExpense}
       onDelete={handleDeleteExpense}
/>
    </div>
  );
};

export default Dashboard;
