import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { GiMailbox } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Info = ({ usersEmail }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    pincode: '',
    addressType: 'Home',
  });

  useEffect(() => {
    if (usersEmail) {
      setFormData(prev => ({ ...prev, email: usersEmail }));
    }
  }, [usersEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressTypeChange = (type) => {
    setFormData({ ...formData, addressType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/saveUserInfo', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('User info saved:', res.data);
      navigate('/cities');
    } catch (error) {
      console.error('Failed to save user info:', error.response?.data || error.message);
      alert('Failed to save user info');
    }
  };

  const Input = ({ icon, name, placeholder, type = 'text', value, onChange, readOnly = false, required = false }) => (
    <div className="mb-4">
      <label htmlFor={name} className="sr-only">{name}</label>
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-500 text-lg">{icon}</span>
        <input
          name={name}
          placeholder={placeholder || name}
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          required={required}
          className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-black placeholder-gray-400"
        />
      </div>
    </div>
  );

  const AddressTypeButton = ({ type, selected, onClick, icon }) => (
    <button
      type="button"
      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
        selected === type ? 'bg-red-600 text-white' : 'border-white text-white'
      }`}
      onClick={() => onClick(type)}
    >
      {icon}
      {type}
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-black">
      <div className="hidden md:flex flex-col justify-between w-1/2 px-10 py-8 bg-black text-white rounded-r-[2rem] overflow-hidden relative">
        <div>
          <h1 className="text-5xl font-bold mb-2 text-red-600">ZOOM-iT</h1>
          <ul className="flex gap-6 text-sm mt-4 text-red-600">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Contact</li>
          </ul>
        </div>
        <h2 className="text-4xl font-extrabold mb-20 text-red-600">User Information</h2>
        <img
          src="src/logos/bk4.jpg"
          alt="Decorative background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-black">
        <motion.div
          className="w-[95%] max-w-[420px] bg-white border border-gray-200 shadow-xl rounded-[2rem] p-10 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-3xl font-bold text-center text-black mb-6">User Information</h2>

            <Input icon={<FaEnvelope />} name="email" value={formData.email} readOnly />
            <Input icon={<FaUser />} name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <Input icon={<FaUser />} name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <Input icon={<MdDateRange />} name="dob" placeholder="Date of Birth" type="date" value={formData.dob} onChange={handleChange} required />
            <Input icon={<GiMailbox />} name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <Input icon={<GiMailbox />} name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />

            <div className="mt-4 flex gap-4">
              <AddressTypeButton type="Home" selected={formData.addressType} onClick={handleAddressTypeChange} icon={<FaUser />} />
              <AddressTypeButton type="Office" selected={formData.addressType} onClick={handleAddressTypeChange} icon={<FaUser />} />
              <AddressTypeButton type="Others" selected={formData.addressType} onClick={handleAddressTypeChange} icon={<FaUser />} />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 mt-6 rounded-full hover:bg-gray-800 transition font-medium"
            >
              Submit
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Info;
