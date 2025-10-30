'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiCalendar, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

// Default categories from AddExpenseModal
const defaultCategories = [
  'Food & Drinks',
  'Shopping',
  'Bills',
  'Transportation',
  'Entertainment',
  'Gifts',
  'Other'
];

const TransactionHeader = ({ onAddTransaction, onCategoryChange, onMonthChange, expenses = [] }) => {
  // Get unique categories from expenses and combine with default categories
  const expenseCategories = [...new Set(expenses.map(expense => expense.category))];
  const allCategories = [...new Set([...defaultCategories, ...expenseCategories])];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const categoryInputRef = useRef(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle date picker click outside
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      
      // Handle category dropdown click outside
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).replace(/([^,]+),\s*/, '$1, ');
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
    setShowCategoryDropdown(false);
  };

  const handleAddNewCategory = (e) => {
    e.stopPropagation();
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      const updatedCategories = [...allCategories, newCategory.trim()];
      setSelectedCategory(newCategory.trim());
      onCategoryChange?.(newCategory.trim());
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  useEffect(() => {
    onMonthChange?.(currentDate);
  }, []);

  const handleDateChange = (date) => {
    setCurrentDate(date);
    onMonthChange?.(date);
    setShowDatePicker(false);
  };

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Current Date Display */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="relative" ref={datePickerRef}>
          <div 
            className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FiCalendar className="text-blue-500" />
            <span className="font-medium">
              {formatDate(currentDate)}
            </span>
            <FiChevronDown className={`transition-transform ${showDatePicker ? 'transform rotate-180' : ''}`} />
          </div>
          
          {showDatePicker && (
            <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <DatePicker
                selected={currentDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                showFullMonthYearPicker
                inline
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative" ref={categoryDropdownRef}>
            <div 
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <FiFilter className="text-blue-500" />
              <span className="font-medium">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </span>
              <FiChevronDown className={`transition-transform ${showCategoryDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            
            {showCategoryDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div 
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => handleCategorySelect('all')}
                >
                  All Categories
                </div>
                {allCategories.map((category) => (
                  <div 
                    key={category}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedCategory === category ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                  {showAddCategory ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        ref={categoryInputRef}
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                        placeholder="New category"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="text-green-600 hover:text-green-800"
                        title="Add category"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddCategory(true);
                        // Focus the input after it's rendered
                        setTimeout(() => categoryInputRef.current?.focus(), 0);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 w-full text-left flex items-center gap-1"
                    >
                      <FiPlus size={14} /> Add New Category
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onAddTransaction}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md"
          >
            <FiPlus className="text-white" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
      
      </div>
  );
};

export default TransactionHeader;
