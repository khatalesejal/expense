'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUser, FiLogOut, FiChevronDown, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogoutMutation } from '../services/authApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Header({ username = 'John Doe' }) {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Clear any persisted auth data
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (_) {
        // ignore storage errors
      }
      setShowLogoutModal(false);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowLogoutModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm rounded-xl p-4 mb-6 flex justify-between items-center">
        {/* App Title */}
        <h1 className="text-2xl font-bold text-blue-600">Expense Tracker</h1>

        {/* Right Section */}
        <div className="relative" ref={dropdownRef}>
          {/* Username + Chevron */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            <FiUser className="text-gray-600 mr-2" />
            <span className="text-gray-800 font-medium">{username}</span>
            <FiChevronDown
              className={`ml-2 text-gray-600 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => {
                        setOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              ref={modalRef}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                    ref={cancelButtonRef}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Are you sure you want to log out? You'll need to sign in again to access your account.</p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}