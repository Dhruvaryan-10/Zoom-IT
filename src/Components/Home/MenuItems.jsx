import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../navbar.jsx";
import Sidebar from "../sidebar.jsx";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

const bgImage = "/logos/bk5.jpg";

const MenuPage = () => {

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [restaurantName, setRestaurantName] = useState("Restaurant Menu");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const restaurantDataState = location.state || {};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {

    const templateId = restaurantDataState.templateId;

const restaurantNameFromState =
  restaurantDataState.restaurantDetails?.name;

if (!templateId) {
  setRestaurantName(restaurantNameFromState || "Restaurant Menu");
  setItems([]);
  return;
}

setRestaurantName(restaurantNameFromState || "Restaurant Menu");

    fetch(`https://zoom-it-m6d0.onrender.com/api/menu-items?template_id=${templateId}`)
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data)) {
          setItems([]);
          return;
        }

        setItems(data);

        const initial = {};
        data.forEach(item => initial[item.id] = 0);
        setQuantities(initial);

      })
      .catch(console.error);

  }, [restaurantDataState]);

  const increment = (id) =>
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));

  const decrement = (id) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));

  const handleGoToCart = () => {

    const selectedItems = items
      .filter(item => quantities[item.id] > 0)
      .map(item => ({
        name: item.item_name,
        price: Number(item.price),
        quantity: quantities[item.id],
      }));

    if (selectedItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/receipt", {
      state: {
        selectedItems,
        restaurantDetails: restaurantDataState.restaurantDetails,
        deliveryAddress: restaurantDataState.deliveryAddress
      }
    });

  };

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0f0a] to-black"></div>

      <div className="absolute w-[600px] h-[600px] bg-orange-500/25 blur-[160px] rounded-full top-[-200px] left-[-200px]" />

      <div className="relative z-10">

        <Navbar />

        <div className="flex">

          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div className={`transition-all duration-300 px-6 pt-[90px] w-full ${isSidebarOpen ? "md:ml-72" : ""}`}>

            {/* Page Title */}

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent"
            >
              {restaurantName} Menu
            </motion.h1>

            {/* Cart Button */}

            <div className="flex justify-end mb-6">

              <button
                onClick={handleGoToCart}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                <FiShoppingCart />
                Go to Cart
              </button>

            </div>

            {/* Menu Sections */}

            {categories.map(category => (

              <div key={category} className="mb-12">

                <h2 className="text-2xl font-bold mb-6 border-b border-red-500 pb-2">
                  {category}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                  {items
                    .filter(item => item.category === category)
                    .map(item => (

                      <motion.div
                        key={item.id}
                        whileHover={{ y: -8, scale: 1.03 }}
                        className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 shadow-xl flex flex-col"
                      >

                        <h3 className="text-lg font-semibold mb-2">
                          {item.item_name}
                        </h3>

                        <p className="text-sm text-white/70 mb-3">
                          {item.item_description}
                        </p>

                        <p className="text-lg font-bold text-orange-400 mb-4">
                          ₹{Number(item.price).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}

                        <div className="flex items-center justify-between mt-auto">

                          <div className="flex items-center gap-3">

                            <button
                              onClick={() => decrement(item.id)}
                              className="w-8 h-8 rounded-full bg-white text-black font-bold"
                            >
                              −
                            </button>

                            <span>{quantities[item.id]}</span>

                            <button
                              onClick={() => increment(item.id)}
                              className="w-8 h-8 rounded-full bg-white text-black font-bold"
                            >
                              +
                            </button>

                          </div>

                          <button
                            className="px-4 py-1 bg-red-500 rounded-full text-sm flex items-center gap-1"
                          >
                            <FiShoppingCart />
                            Add
                          </button>

                        </div>

                      </motion.div>

                    ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default MenuPage;