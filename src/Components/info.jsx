import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { GiMailbox } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Info = ({ usersEmail }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
    pincode: "",
    addressType: "Home",
  });

  useEffect(() => {
  if (usersEmail) {
    setFormData((prev) => ({
      ...prev,
      email: usersEmail,
    }));
  }
}, []); // run only once

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleAddressTypeChange = (type) => {
    setFormData({ ...formData, addressType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://zoom-it-m6d0.onrender.com/api/saveUserInfo",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("User info saved:", res.data);
      navigate("/cities");

    } catch (error) {
      console.error(
        "Failed to save user info:",
        error.response?.data || error.message
      );
      alert("Failed to save user info");
    }
  };

  const Input = ({
    icon,
    name,
    placeholder,
    type = "text",
    value,
    onChange,
    readOnly = false,
    required = false,
  }) => (
    <div>
      <div className="relative">
        <span className="absolute left-3 top-3 text-white/70">{icon}</span>

        <input
  name={name}
  placeholder={placeholder || name}
  type={type}
  value={value || ""}
  onChange={onChange}
  readOnly={readOnly}
  required={required}
  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
/>
      </div>
    </div>
  );

  const AddressTypeButton = ({ type, selected, onClick }) => (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={`px-4 py-2 rounded-xl border transition ${
        selected === type
          ? "bg-gradient-to-r from-[#FF3B30] to-[#FF7A18] text-white border-transparent"
          : "border-white/30 text-white hover:bg-white/10"
      }`}
    >
      {type}
    </button>
  );

  const bgImage = "/bk6.jpg";

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-black">

      {/* Background Image */}

      <img
        src={bgImage}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover animate-slowZoom"
      />

      {/* Dark Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>

      {/* Orange Glow */}

      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-red-500/20 to-transparent"></div>

      {/* Glow blobs */}

      <div className="absolute w-[500px] h-[500px] bg-orange-500/30 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-red-500/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* Content */}

      <div className="relative z-10 flex w-full h-full text-white">

        {/* Left Branding */}

        <div className="hidden md:flex flex-col justify-between w-1/2 px-16 py-10">

          <div>
            <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Zoom-it
            </h1>

            <p className="text-white/70 text-lg max-w-sm">
              Tell us a little about yourself so we can deliver your meals
              faster and more accurately.
            </p>
          </div>

          <p className="text-white/60 text-sm">
            © 2026 Zoom-it Technologies
          </p>

        </div>

        {/* Form Section */}

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-[95%] max-w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10"
          >

            <form onSubmit={handleSubmit} className="space-y-5">

              <h2 className="text-3xl font-bold text-center">
                User Information
              </h2>

              <Input
                icon={<FaEnvelope />}
                name="email"
                value={formData.email}
                readOnly
              />

              <Input
                icon={<FaUser />}
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <Input
                icon={<FaUser />}
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

              <Input
                icon={<MdDateRange />}
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />

              <Input
                icon={<GiMailbox />}
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <Input
                icon={<GiMailbox />}
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />

              {/* Address Type */}

              <div className="flex gap-3 justify-center pt-2">
                <AddressTypeButton
                  type="Home"
                  selected={formData.addressType}
                  onClick={handleAddressTypeChange}
                />
                <AddressTypeButton
                  type="Office"
                  selected={formData.addressType}
                  onClick={handleAddressTypeChange}
                />
                <AddressTypeButton
                  type="Others"
                  selected={formData.addressType}
                  onClick={handleAddressTypeChange}
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#FF3B30] to-[#FF7A18] hover:scale-[1.03] transition"
              >
                Continue
              </button>

            </form>

          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Info;