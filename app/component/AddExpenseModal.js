'use client';

import { FiX, FiDollarSign, FiShoppingBag, FiCreditCard, FiCoffee, FiFilm, FiGift, FiChevronDown } from 'react-icons/fi';
import { useCreateTransactionMutation, useUpdateTransactionMutation } from '../services/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState, useEffect } from 'react';

const AddExpenseModal = ({ isOpen, onClose, onSubmit, formData, onInputChange, isEditing = false }) => {
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Clear errors when modal opens/closes
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    // Clear the error for the current field when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Call the original onInputChange
    onInputChange(e);
  };

  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let result;
      if (isEditing && formData._id) {
        // Update existing transaction
        const { _id, ...updateData } = formData;
        result = await updateTransaction({ id: _id, ...updateData }).unwrap();
        toast.success('Transaction updated successfully!');
      } else {
        // Create new transaction
        result = await createTransaction(formData).unwrap();
        toast.success('Transaction added successfully!');
      }
      
      // Call the original onSubmit with the result
      if (onSubmit) {
        await onSubmit(e, result);
      }
      
      // Close the modal after successful submission
      onClose();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      const errorMessage = err?.data?.message || (isEditing ? 'Failed to update transaction' : 'Failed to add transaction');
      toast.error(errorMessage);
    }
  };
  
  const isLoading = isCreating || isUpdating;
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Field */}
        

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Grocery shopping"
              
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

{/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  list="categorySuggestions"
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  placeholder="Type or select a category"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <datalist id="categorySuggestions">
                  <option value="Food & Drinks" />
                  <option value="Shopping" />
                  <option value="Bills" />
                  <option value="Transportation" />
                  <option value="Entertainment" />
                  <option value="Gifts" />
                  <option value="Other" />
                </datalist>
              </div>

              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

         
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={formData.type || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select type</option> {/* 👈 Default placeholder */}
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <div className="absolute right-3 top-2.5 text-gray-500 pointer-events-none">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>

              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

          {/* Description (Optional) */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Note
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note || ''}
              onChange={handleInputChange}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;