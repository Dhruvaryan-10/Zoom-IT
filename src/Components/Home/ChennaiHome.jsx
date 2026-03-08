import React, { useEffect, useState } from "react";
import Navbar from "../navbar.jsx";
import Sidebar from "../sidebar.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ---------------- BACKGROUND ---------------- */

const bgImage = "/logos/bk5.jpg";

/* ---------------- CUISINE IMAGE MAP ---------------- */

const rawCuisineImageMap = {
  Asian: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604764/asian_yhmt0w.jpg",
  Thai: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604764/asian_yhmt0w.jpg",
  Bakery: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604761/bakery_xle2cq.jpg",
  Chinese: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604758/chinese_ryuqbj.jpg",
  Continental: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604754/continental_krnlw0.jpg",
  "Ice Cream": "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604753/ice_cream_qwu6a7.jpg",
  Italian: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604748/italian_a7uzum.jpg",
  Japanese: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604742/japanese_fek1r9.jpg",
  Mediterranean: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604739/medeteranian_pqo9qq.jpg",
  Mughlai: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604737/mughlai_pf6g7s.jpg",
  "South Indian": "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604734/south_indian_civt7i.jpg",
  "North Indian": "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604731/north_indian_ajbhl0.avif",
  Cafe: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608152/cafe_e5rdaa.jpg",
  Desserts: "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608169/desserts_x7hvqd.jpg",
};

const cuisineImageMap = Object.fromEntries(
  Object.entries(rawCuisineImageMap).map(([key, url]) => [key.toLowerCase(), url])
);

const FALLBACK_IMAGE_URL = bgImage;

const getCuisineImage = (cuisineData) => {
  if (!cuisineData) return FALLBACK_IMAGE_URL;

  const rawCuisines = Array.isArray(cuisineData)
    ? cuisineData
    : cuisineData.split(",");

  const cuisines = rawCuisines.map((c) => {
    let name = c.trim().toLowerCase();

    if (name.includes("biryani")) return "biryani";
    if (name.includes("indian"))
      return name.includes("south") ? "south indian" : "north indian";
    if (name.includes("ice cream")) return "ice cream";

    return name;
  });

  const matchedKey = cuisines.find((c) => cuisineImageMap[c]);

  return matchedKey ? cuisineImageMap[matchedKey] : FALLBACK_IMAGE_URL;
};

/* ---------------- COMPONENT ---------------- */

const ChennaiHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [userDetails, setUserDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  /* ---------- USER INFO ---------- */

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    fetch("https://zoom-it-m6d0.onrender.com/api/getUserDetails", {
      headers: { "x-user-email": email },
    })
      .then((res) => res.json())
      .then(setUserDetails)
      .catch(console.error);
  }, []);

  /* ---------- RESTAURANTS ---------- */

  useEffect(() => {
    fetch("https://zoom-it-m6d0.onrender.com/api/home/chennai")
      .then((res) => res.json())
      .then((data) => setRestaurants(data || []))
      .catch(console.error);
  }, []);

  const filteredRestaurants = restaurants

  /* SEARCH FILTER */
  .filter((restaurant) =>
    (restaurant.restaurant_name || restaurant.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  /* SIDEBAR FILTERS */
  .filter((restaurant) => {

    const rating = Number(restaurant.dining_rating) || 0;
    const price = Number(restaurant.pricing_for_2) || 0;

    const cuisine =
      (restaurant.category || restaurant.cuisine || "").toLowerCase();

    if (filter === "highest") {
      return rating >= 4.5;
    }

    if (filter === "lowest") {
      return rating > 0 && rating <= 3;
    }

    if (filter === "most_expensive") {
      return price >= 1000;
    }

    if (filter === "most_affordable") {
      return price <= 300;
    }

    if (filter === "nearest") {
      return Number(restaurant.distance || 0) <= 5;
    }

    /* CUISINE FILTER */

    if (filter.startsWith("cuisine_")) {

      const selectedCuisine = filter.replace("cuisine_", "");

      return cuisine.includes(selectedCuisine);

    }

    return true;
  })

  /* SORTING */

  .sort((a, b) => {

    if (filter === "highest")
      return Number(b.dining_rating) - Number(a.dining_rating);

    if (filter === "lowest")
      return Number(a.dining_rating) - Number(b.dining_rating);

    if (filter === "most_expensive")
      return Number(b.pricing_for_2) - Number(a.pricing_for_2);

    if (filter === "most_affordable")
      return Number(a.pricing_for_2) - Number(b.pricing_for_2);

    return 0;
  });


 const handleRestaurantClick = (restaurant) => {
  const templateId = restaurant.template_id;
  const cuisineName = restaurant.cuisine || restaurant.category;

  if (!templateId) {
    console.error(`Restaurant ${restaurant.restaurant_name || restaurant.name} has no template_id.`);
    window.alert("Menu not available for this restaurant.");
    return;
  }

  navigate(`/home/chennai/menu/${templateId}`, {
    state: {
      templateId: templateId,
      cuisineName: cuisineName,
      restaurantDetails: {
        name: restaurant.restaurant_name || restaurant.name,
        address: restaurant.address,
      },
    },
  });

  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0f0a] to-black"></div>

      <div className="absolute w-[600px] h-[600px] bg-orange-500/20 blur-[160px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-red-500/20 blur-[160px] rounded-full top-[20%] right-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 blur-[160px] rounded-full bottom-[-200px] left-[30%]" />

      <div className="relative z-10">

        <Navbar userDetails={userDetails} />

        <div className="flex">

          <Sidebar
            onFilter={setFilter}
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div
            className={`transition-all duration-300 px-6 pt-[90px] w-full ${
              isSidebarOpen ? "md:ml-72" : ""
            }`}
          >

            {/* Heading */}

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent"
            >
              Discover Restaurants in Chennai
            </motion.h1>

            {/* Search */}

            <div className="flex justify-center mb-10">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-xl px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-white/60"
              />
            </div>

            {/* Restaurant Grid */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => {

                  const imageUrl = getCuisineImage(
                    restaurant.cuisine || restaurant.category
                  );

                  return (

                    <motion.div
                      key={restaurant.id}
                      whileHover={{ y: -10, scale: 1.04 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl flex flex-col"
                    >

                      {/* Image */}

                      <div className="relative">

                        <img
                          src={imageUrl}
                          alt="restaurant"
                          className="w-full h-[190px] object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                        <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow">
                          ⭐ {restaurant.dining_rating || "N/A"}
                        </div>

                      </div>

                      {/* Card Content */}

                      <div className="p-4 flex flex-col flex-grow space-y-2">

                        <h2 className="text-lg font-semibold text-white">
                          {restaurant.restaurant_name || restaurant.name}
                        </h2>

                        <p className="text-sm text-white/70">
                          🍽 {restaurant.cuisine || restaurant.category}
                        </p>

                        <div className="flex justify-between text-sm text-white/70">
                          <span>🚚 {restaurant.delivery_rating || "N/A"}</span>
                          <span>💸 ₹{restaurant.price_for_2} for two</span>
                        </div>

                        <p className="text-sm text-white/60 truncate">
                          📍 {restaurant.locality}
                        </p>

                        <p className="text-xs text-white/50 line-clamp-2">
                          🏠 {restaurant.address}
                        </p>

                        <p className="text-xs text-white/50">
                          📞 {restaurant.phone_no}
                        </p>

                        <div className="flex-grow"></div>

                        <button
                          onClick={() => handleRestaurantClick(restaurant)}
                          className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          View Menu
                        </button>

                      </div>

                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-white/60 col-span-full">
                  No restaurants found
                </p>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChennaiHome;