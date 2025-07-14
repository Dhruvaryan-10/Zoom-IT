import React, { useEffect, useState } from "react";
import Navbar from "../navbar.jsx";
import Sidebar from "../sidebar.jsx";
import bgImage from "../../logos/bk5.jpg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BangaloreHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [userDetails, setUserDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    fetch("http://localhost:5000/api/home/bangalore")
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching restaurant data:", error));
  }, []);

  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((restaurant) => {
      if (filter === "highest") return restaurant.dining_rating >= 4.5;
      if (filter === "nearest") return restaurant.distance <= 5;
      return true;
    });

  const handleRestaurantClick = (category) => {
    navigate("/home/:city/menu", { state: { category } });
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
        <Navbar userDetails={userDetails} />
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
              className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-4"
            >
              Bangalore Restaurants
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
                    className="bg-white/10 backdrop-blur-md text-white w-[300px] rounded-2xl p-5 shadow-lg border border-white/20 transition-transform hover:scale-110 hover:shadow-2xl cursor-pointer"
                    onClick={() => handleRestaurantClick(restaurant.category)}
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
                      <button
                      onClick={() => handleRestaurantClick(restaurant.category)} // Pass category to MenuPage
                      className="mt-3 bg-red-600 text-white p-2 rounded-lg"
                    >
                      View Menu
                    </button>
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

export default BangaloreHome;
