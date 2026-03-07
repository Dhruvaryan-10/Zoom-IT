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

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-72 z-40
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        bg-gradient-to-b from-black/70 via-black/60 to-black/80
        backdrop-blur-xl border-r border-white/10
        rounded-tr-3xl rounded-br-3xl
        flex flex-col p-6`}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-white">
            Filters
          </h2>

          <button onClick={() => setIsOpen(false)}>
            <FiX size={22} />
          </button>

        </div>

        {/* SORT */}
        <div className="space-y-3">

          <h3 className="text-red-400 text-sm font-semibold uppercase">
            Sort By
          </h3>

          <FilterButton
            label="All Restaurants"
            onClick={() => handleFilterChange("all")}
          />

          <FilterButton
            icon={<FiStar />}
            label="Highest Rated"
            onClick={() => handleFilterChange("highest")}
          />

          <FilterButton
            icon={<FiStar />}
            label="Lowest Rated"
            onClick={() => handleFilterChange("lowest")}
          />

        </div>

        <Divider />

        {/* PRICE */}

        <div className="space-y-3">

          <h3 className="text-red-400 text-sm font-semibold uppercase">
            Price
          </h3>

          <FilterButton
            label="💰 Most Expensive"
            onClick={() => handleFilterChange("most_expensive")}
          />

          <FilterButton
            label="🏷️ Most Affordable"
            onClick={() => handleFilterChange("most_affordable")}
          />

        </div>

        <Divider />

        {/* LOCATION */}

        <div className="space-y-3">

          <h3 className="text-red-400 text-sm font-semibold uppercase">
            Location
          </h3>

          <FilterButton
            icon={<FiMapPin />}
            label="Nearest to You"
            onClick={() => handleFilterChange("nearest")}
          />

        </div>

        <Divider />

        {/* CUISINE */}

        <div className="space-y-3">

          <h3 className="text-red-400 text-sm font-semibold uppercase">
            Cuisine
          </h3>

          <select
            className="w-full bg-white/10 text-white p-2 rounded-lg border border-white/20"
            onChange={(e) =>
              handleFilterChange(`cuisine_${e.target.value}`)
            }
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

      {/* HAMBURGER */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-4 z-50
          bg-gradient-to-r from-red-500 to-orange-500
          p-3 rounded-full"
        >
          <FiMenu size={22} />
        </button>
      )}
    </>
  );
};

const FilterButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-4 py-2
    rounded-lg bg-white/10 hover:bg-white/20 transition"
  >
    {icon}
    {label}
  </button>
);

const Divider = () => (
  <div className="border-t border-white/10 my-4" />
);

export default Sidebar;