import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onChangeAddress, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    address: "",
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) return;

        const res = await fetch("http://localhost:5000/api/getUserDetails", {
          headers: {
            "x-user-email": storedEmail,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const [first_name = "", last_name = ""] = (data.name || "").split(" ");
          setUserDetails({
            first_name,
            last_name,
            address: data.address || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 sticky top-0 z-50">

      {/* Glass background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md border-b border-white/10"></div>

      {/* Content */}
      <div className="relative w-full flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-2xl">🍽️</span>

          <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent group-hover:opacity-80 transition">
            Zoom-it
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-white/80 font-medium">

          <button
            onClick={() => navigate("/")}
            className="relative hover:text-white transition"
          >
            Home
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            onClick={() => navigate("/cities")}
            className="relative hover:text-white transition"
          >
            Cities
          </button>

          <button
            onClick={() => navigate("/about")}
            className="relative hover:text-white transition"
          >
            About
          </button>

        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 text-white/80 hover:text-white transition"
          >
            <UserCircle size={34} />
            <ChevronDown size={18} />
          </button>

<AnimatePresence>
  {dropdownOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-4 w-72 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Profile Section */}

      <div className="flex items-center gap-4 p-5">

        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-lg font-bold">
          {userDetails.first_name?.charAt(0) || "U"}
        </div>

        <div className="flex flex-col">
          <p className="text-white font-semibold text-lg leading-none">
            {userDetails.first_name} {userDetails.last_name}
          </p>

          <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
            📍 {userDetails.address}
          </p>
        </div>

      </div>

      {/* Divider */}

      <div className="h-px bg-white/10"></div>

      {/* Actions */}

      <div className="p-4 flex flex-col gap-3">

        <button
          onClick={onChangeAddress}
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg transition border border-white/10"
        >
          📍 Change Address
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-lg transition"
        >
          ⏻ Logout
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