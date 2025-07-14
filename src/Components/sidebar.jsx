import React, { useState } from "react";
import { FiMenu, FiStar, FiMapPin, FiX } from "react-icons/fi";

const Sidebar = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterType) => {
    onFilter(filterType);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  const handleFilter = async (filterType) => {
    const response = await fetch("http://localhost:5000/api/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: filterType }),
    });
    const data = await response.json();
    setRestaurants(data); // Assuming you store and render this list
  };
  

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        bg-black/50 backdrop-blur-md border-r border-white/10 p-4 flex flex-col gap-6
        text-white w-72 rounded-tr-3xl rounded-br-3xl shadow-lg`}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <FiX size={24} />
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white mb-2">Filters</h2>

          {/* Sort By */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">Sort By</h3>
            <button
              className="w-full text-left px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => handleFilterChange("all")}
            >
              All Restaurants
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => handleFilterChange("highest")}
            >
              <FiStar /> Highest Rated
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => handleFilterChange("lowest")}
            >
              <FiStar className="transform rotate-180" /> Lowest Rated
            </button>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">Price</h3>
            <button
              className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => handleFilterChange("most_expensive")}
            >
              💰 Most Expensive
            </button>
            <button
              className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => handleFilterChange("most_affordable")}
            >
              🏷️ Most Affordable
            </button>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">Location</h3>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => handleFilterChange("nearest")}
            >
              <FiMapPin /> Nearest to You
            </button>
          </div>

          {/* Cuisine */}
          <div className="space-y-2">
            <h3 className="text-white text-lg font-semibold text-red-400">Cuisine</h3>
            <select
              className="w-full bg-white/10 text-black p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              onChange={(e) => handleFilterChange(`cuisine_${e.target.value}`)}
              defaultValue=""
            >
              <option value="">All Cuisines</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="italian">Italian</option>
              <option value="mexican">Mexican</option>
              <option value="japanese">Japanese</option>
              <option value="thai">Thai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hamburger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-4 z-50 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full shadow-lg"
        >
          <FiMenu size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
