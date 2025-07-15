import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onChangeAddress, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    address: '',
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) return;

        const res = await fetch('http://localhost:5000/api/getUserDetails', {
          headers: {
            'x-user-email': storedEmail,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const [first_name = '', last_name = ''] = (data.name || '').split(' ');
          setUserDetails({
            first_name,
            last_name,
            address: data.address || '',
          });
        } else {
          console.error('Failed to fetch user details:', data.message);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10 shadow-md">
      {/* Logo */}
      <h1
        className="text-4xl font-pacifico text-red-600 tracking-wide cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        🍽️ ZOOM-iT
      </h1>

      {/* Menu Buttons */}
      <div className="flex items-center gap-6">
        <button className="text-white hover:text-red-400 font-pacifico transition text-lg">
          Home
        </button>
        <button
          onClick={() => navigate('/cities')}
          className="text-white hover:text-red-400 font-pacifico transition text-lg"
        >
          Cities
        </button>
        <button className="text-white hover:text-red-400 font-pacifico transition text-lg">
          About
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 text-white hover:text-red-400 transition"
          >
            <UserCircle size={32} />
            <ChevronDown size={18} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 bg-black/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 z-50"
              >
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <UserCircle size={42} className="text-white" />
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {userDetails.first_name} {userDetails.last_name}
                      </p>
                      <p className="text-sm text-gray-300 truncate max-w-[200px]">
                        🏠 {userDetails.address}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onChangeAddress}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Change Address
                  </button>

                  <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
