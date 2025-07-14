import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar.jsx";
import Sidebar from "../sidebar.jsx";
import bgImage from "../../logos/bk5.jpg";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = (value) => {
    setIsSidebarOpen(typeof value === "boolean" ? value : !isSidebarOpen);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/menu-items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        const initialQuantities = {};
        data.forEach((item) => {
          initialQuantities[item.id] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("Failed to fetch menu items:", err));
  }, []);

  const increment = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  const handleGoToCart = () => {
    const selectedItems = items
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        name: item.item_name,
        price: Number(item.price),
        quantity: quantities[item.id],
      }));

    if (selectedItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/receipt", { state: { selectedItems } });
  };

  return (
    <div
      className="relative min-h-screen font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div
            className={`transition-all duration-300 px-4 pt-[70px] w-full ${
              isSidebarOpen ? "md:ml-72" : "ml-0"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-6"
            >
              Our Menus
            </motion.h1>

            <div className="flex justify-end mb-4 px-2">
              <button
                onClick={handleGoToCart}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                🛒 Go to Cart
              </button>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2">
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-xl transition-transform duration-300 group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-red-500/30 to-red500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-500/20 text-red-300 rounded-full mb-2">
                        {item.category}
                      </span>
                      <h2 className="text-xl font-bold mb-2 text-white">
                        {item.item_name}
                      </h2>
                      <p className="text-sm text-white/80 mb-2">{item.item_description}</p>
                      <p className="text-lg font-semibold text-red-600 mb-4">
                        ₹{Number(item.price).toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decrement(item.id)}
                            className="w-8 h-8 rounded-full bg-white text-black font-bold hover:bg-gray-200"
                          >
                            −
                          </button>
                          <span className="text-white font-medium">
                            {quantities[item.id]}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
                            className="w-8 h-8 rounded-full bg-white text-black font-bold hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition flex items-center gap-1">
                          <FiShoppingCart /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-white text-lg col-span-full">
                  No items available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
