import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./navbar.jsx";

const cityList = [
  { name: 'Delhi-NCR', image: 'src/City/delhi.jpg', key: 'delhi' },
  { name: 'Bangalore', image: 'src/City/bengalore.jpg', key: 'bangalore' },
  { name: 'Kolkata', image: 'src/City/kolkata.jpg', key: 'kolkata' },
  { name: 'Chennai', image: 'src/City/chennai.jpg', key: 'chennai' },
];

const Cities = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ name: '', address: '' });

  useEffect(() => {
    const email = localStorage.getItem("email"); // or get from context/session

    if (!email) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/getUserDetails", {
      headers: { "x-user-email": email },
    })
      .then((res) => res.json())
      .then((data) => setUserDetails(data))
      .catch((err) => console.error("Error fetching user details:", err));
  }, [navigate]);

  const handleChangeAddress = () => {
    navigate("/update-address");
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleCityClick = (city) => {
    navigate(`/home/${city}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('src/logos/bk5.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 " />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar
          userDetails={userDetails}
          onChangeAddress={handleChangeAddress}
          onLogout={handleLogout}
        />

        <div className="text-center px-6 pt-12">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-bold text-red-600 mb-12 drop-shadow-lg"
          >
            Select Your City
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-8">
            {cityList.map((city, index) => (
              <motion.button
                key={city.key}
                onClick={() => handleCityClick(city.key)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="relative w-[240px] h-[60vh] rounded-2xl overflow-hidden shadow-2xl group bg-white/20 backdrop-blur-md border border-red-600/30"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:opacity-30 group-hover:brightness-125"
                />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold text-white opacity-0 group-hover:opacity-100 transition duration-300 drop-shadow-lg">
                  {city.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
