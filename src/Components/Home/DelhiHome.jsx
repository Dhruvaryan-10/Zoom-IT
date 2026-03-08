import React, { useEffect, useState } from "react";
import Navbar from "../navbar.jsx";
import Sidebar from "../sidebar.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ---------------- BACKGROUND ---------------- */

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

/* ---------------- CUISINE IMAGE MAP ---------------- */

const cuisineImageMap = {
  Asian:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604764/asian_yhmt0w.jpg",
  Bakery:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604761/bakery_xle2cq.jpg",
  Chinese:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604758/chinese_ryuqbj.jpg",
  Continental:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604754/continental_krnlw0.jpg",
  "Ice Cream":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604753/ice_cream_qwu6a7.jpg",
  Italian:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604748/italian_a7uzum.jpg",
  Japanese:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604742/japanese_fek1r9.jpg",
  Mediterranean:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604739/medeteranian_pqo9qq.jpg",
  Mughlai:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604737/mughlai_pf6g7s.jpg",
  "South Indian":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604734/south_indian_civt7i.jpg",
  "North Indian":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757604731/north_indian_ajbhl0.avif",
  Nepalese:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757606828/nepalese_d0qq3y.jpg",
  "Fast Food":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608135/Fast_Food_f0g3ig.jpg",
  Portuguese:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608140/Nandos_fkhtbn.jpg",
  "Street Food":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608142/Street_delhi_lxukpj.jpg",
  Cafe:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608152/cafe_e5rdaa.jpg",
  Desserts:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608169/desserts_x7hvqd.jpg",
  Vietnamese:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608379/Vietnamese_y6zrbq.jpg",
  European:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608465/european_kzmqjh.webp",
  Afghan:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757608569/afghan_t3yorq.jpg",
  Rolls:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757672553/rolls_m2qnb8.webp",
  Kebab:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757672629/Kebabs_vhgvlj.jpg",
  "Finger Food":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757672744/Finger_Food_hgbzlz.jpg",
  Biryani:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757672837/Biryani_tlsogg.jpg",
  Momos:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757672833/Momos_zrsatb.jpg",
  "Healthy Food":
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673022/Healthy_Food_hmhbsk.jpg",
  Burger:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673093/Burger_euwwhk.jpg",
  Mexican:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673232/Mexican_o8dtsy.jpg",
  Mithai:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673276/Mishthi_tjmeff.jpg",
  Beverages:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673343/Beverages_px5yh9.jpg",
  Korean:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673566/korean_ba8uai.avif",
  Pizza:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673560/Pizza_wpkhfw.jpg",
  Bengali:
    "https://res.cloudinary.com/djgt0gsdl/image/upload/v1757673168/Bengali_sm0cen.avif",
};

const processedCuisineImageMap = Object.fromEntries(
  Object.entries(cuisineImageMap).map(([key, url]) => [key.toLowerCase(), url])
);

const getCuisineImage = (cuisineData) => {
  if (!cuisineData) return FALLBACK_IMAGE_URL;

  const rawCuisines = Array.isArray(cuisineData)
    ? cuisineData
    : cuisineData.split(",");

  const cuisines = rawCuisines.map((c) => c.trim().toLowerCase());

  const matchedKey = cuisines.find((c) => processedCuisineImageMap[c]);

  return matchedKey
    ? processedCuisineImageMap[matchedKey]
    : FALLBACK_IMAGE_URL;
};

/* ---------------- MAIN COMPONENT ---------------- */

const DelhiHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [userDetails, setUserDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) return;

    fetch("https://zoom-it-m6d0.onrender.com/api/getUserDetails", {
      headers: { "x-user-email": email },
    })
      .then((res) => res.json())
      .then((data) => setUserDetails(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("https://zoom-it-m6d0.onrender.com/api/home/delhi")
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
  const cuisineName = restaurant.category || restaurant.cuisine;

  if (!templateId) {
    console.error(`Restaurant ${restaurant.restaurant_name || restaurant.name} has no template_id.`);
    window.alert("Menu not available for this restaurant.");
    return;
  }

  navigate(`/home/delhi/menu/${templateId}`, {
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

  {/* Base Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0f0a] to-black"></div>

  {/* Top Orange Glow */}
  <div className="absolute w-[600px] h-[600px] bg-orange-500/25 blur-[160px] rounded-full top-[-200px] left-[-200px]"></div>

  {/* Right Red Glow */}
  <div className="absolute w-[500px] h-[500px] bg-red-500/20 blur-[160px] rounded-full top-[20%] right-[-150px]"></div>

  {/* Bottom Yellow Glow */}
  <div className="absolute w-[500px] h-[500px] bg-yellow-400/15 blur-[140px] rounded-full bottom-[-200px] left-[30%]"></div>

  {/* Content */}
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

          <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
            Discover Restaurants in Delhi
          </h1>

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

            {filteredRestaurants.map((restaurant) => {
              const imageUrl = getCuisineImage(
                restaurant.category || restaurant.cuisine
              );

              return (
                <motion.div
                  key={restaurant.id}
                  whileHover={{ y: -8, scale: 1.04 }}
                  className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurant)}
                >

                  <img
                    src={imageUrl}
                    alt="restaurant"
                    className="w-full h-[200px] object-cover"
                  />

                  <div className="p-4">

                    <h2 className="text-lg font-semibold">
                      {restaurant.restaurant_name || restaurant.name}
                    </h2>

                    <p className="text-sm text-white/60 mb-2">
                      🍽 {restaurant.category || restaurant.cuisine}
                    </p>

                    <div className="flex justify-between items-center text-sm">

                      <span className="bg-green-600 px-2 py-1 rounded-md text-xs">
                        ⭐ {restaurant.dining_rating || "N/A"}
                      </span>

                      <span className="text-white/70">
                        ₹{restaurant.pricing_for_2} for two
                      </span>
                      

                    </div>

                    <p className="text-xs text-white/50 mt-2 truncate">
                      📍 {restaurant.locality}
                    </p>
                    <button
            onClick={() => handleRestaurantClick(restaurant)}
            className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            View Menu
          </button>

                  </div>

                </motion.div>
              );
            })}

          </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default DelhiHome;