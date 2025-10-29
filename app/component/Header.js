'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ username = 'John Doe', onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
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
                {/* <li>
                  <button
                    onClick={() => {
                      // Future: navigate('/profile') or open profile modal
                      setOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <FiUser className="mr-2 text-gray-600" /> Profile
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onLogout?.();
                    }}
                    className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
