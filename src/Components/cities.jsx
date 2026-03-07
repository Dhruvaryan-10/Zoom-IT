import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./navbar.jsx";

/* IMPORT CITY IMAGES */
import delhiImg from "../City/delhi.jpg";
import bangaloreImg from "../City/bengalore.jpg";
import kolkataImg from "../City/kolkata.jpg";
import chennaiImg from "../City/chennai.jpg";

const cityList = [
  { name: "Delhi-NCR", image: delhiImg, key: "delhi" },
  { name: "Bangalore", image: bangaloreImg, key: "bangalore" },
  { name: "Kolkata", image: kolkataImg, key: "kolkata" },
  { name: "Chennai", image: chennaiImg, key: "chennai" },
];

const Cities = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
  });

  /* FETCH USER DETAILS */
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      fetch("http://localhost:5000/api/getUserDetails", {
        headers: { "x-user-email": email },
      })
        .then((res) => res.json())
        .then((data) => setUserDetails(data))
        .catch((err) => console.error("Error fetching user details:", err));
    }
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
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* MODERN BACKGROUND */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0f0a] to-black"></div>

      {/* GLOW EFFECTS */}

      <div className="absolute w-[600px] h-[600px] bg-orange-500/30 blur-[140px] rounded-full top-[-200px] left-[-200px]" />

      <div className="absolute w-[500px] h-[500px] bg-red-500/20 blur-[140px] rounded-full bottom-[-200px] right-[-200px]" />

      <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 blur-[120px] rounded-full top-[40%] left-[40%]" />

      {/* CONTENT */}

      <div className="relative z-10">

        <Navbar
          userDetails={userDetails}
          onChangeAddress={handleChangeAddress}
          onLogout={handleLogout}
        />

        {/* PAGE HEADING */}

        <div className="text-center px-6 pt-16">

          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent"
          >
            Choose Your City
          </motion.h2>

          <p className="text-white/70 text-lg mb-14">
            Discover the best restaurants around you
          </p>

          {/* CITY GRID */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">

            {cityList.map((city, index) => (
              <motion.div
                key={city.key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative group cursor-pointer"
                onClick={() => handleCityClick(city.key)}
              >

                {/* CITY CARD */}

                <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-lg bg-white/5">

                  {/* IMAGE */}

                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-[320px] object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-75"
                  />

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-black/40"></div>

                  {/* CITY NAME */}

                  <div className="absolute inset-0 flex items-center justify-center">

                    <span className="text-2xl font-bold tracking-wide">
                      {city.name}
                    </span>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cities;