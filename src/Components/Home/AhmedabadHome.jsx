import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Navbar from "../navbar.jsx";
import bgImage from "../../logos/bk5.jpg";
import { motion } from "framer-motion";

const AhmedabadHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [userDetails, setUserDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (value) => {
    setIsSidebarOpen(typeof value === "boolean" ? value : !isSidebarOpen);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/user/details", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUserDetails(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/home/ahmedabad")
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((restaurant) => {
      if (filter === "highest") return parseFloat(restaurant.rate) >= 4.5;
      if (filter === "lowest") return parseFloat(restaurant.rate) <= 2.5;
      if (filter === "most_expensive")
        return parseInt(restaurant.approx_cost) >= 2000;
      if (filter === "most_affordable")
        return parseInt(restaurant.approx_cost) <= 500;
      if (filter.startsWith("cuisine_")) {
        const cuisineType = filter.replace("cuisine_", "");
        return restaurant.cuisines.toLowerCase().includes(cuisineType);
      }
      return true;
    });

  const handleChangeAddress = () => {
    alert("Redirecting to Change Address Page...");
  };

  const handleLogout = () => {
    fetch("http://localhost:5000/api/user/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          alert("Logged out!");
          window.location.href = "/login";
        }
      })
      .catch((error) => console.error("Error during logout:", error));
  };

  return (
    <div
      className="relative min-h-screen font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10">
        <Navbar
          userDetails={userDetails}
          onChangeAddress={handleChangeAddress}
          onLogout={handleLogout}
        />

        <div className="flex">
          <Sidebar
            onFilter={setFilter}
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div
            className={`transition-all duration-300 px-4 pt-[70px] w-full ${
              isSidebarOpen ? "md:ml-72" : "ml-0"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-center text-red-500 mb-4"
            >
              Ahmedabad Restaurants
            </motion.h1>

            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              type="text"
              placeholder="Search for a restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xl mx-auto block text-center placeholder-white text-white text-lg font-medium border-2 border-white/30 rounded-xl bg-white/20 bg-opacity-40 px-4 py-3 my-6 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <div className="flex flex-wrap justify-center gap-6 p-4">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-white/10 backdrop-blur-md text-white w-[300px] rounded-2xl p-5 shadow-lg border border-white/20 transition-transform hover:scale-110 hover:shadow-2xl"
                  >
                    <h2 className="text-xl font-bold mb-2">
                      {restaurant.name}
                    </h2>
                    <div className="text-sm space-y-1">
                      <p>📍 Address: {restaurant.address}</p>
                      <p>📞 Contact: {restaurant.phone}</p>
                      <p>📌 Location: {restaurant.location}</p>
                      <p>🍽 Cuisine: {restaurant.cuisines}</p>
                      <p>💰 Approx. Cost for Two: ₹{restaurant.approx_cost}</p>
                      <p>
                        ⭐ Rating: {restaurant.rate} ({restaurant.votes} votes)
                      </p>
                      <p>🛵 Online Order: {restaurant.online_order}</p>
                      <p>📅 Table Booking: {restaurant.book_table}</p>
                      <p>🔝 Top Dish Liked: {restaurant.dish_liked}</p>
                      <p>📜 Restaurant Type: {restaurant.rest_type}</p>
                      <p>
                        📌 Listed In: {restaurant.listed_in_type} -{" "}
                        {restaurant.listed_in_city}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-white mt-4">
                  No restaurants found...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AhmedabadHome;
