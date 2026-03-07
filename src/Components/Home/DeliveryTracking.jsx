import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const DeliveryTracking = () => {

  const location = useLocation();

  const restaurantDetails = location.state?.restaurantDetails;
  const deliveryAddress = location.state?.deliveryAddress;

  const [routeData, setRouteData] = useState({
    duration: "Calculating...",
    distance: "Calculating..."
  });

  useEffect(() => {

    setTimeout(() => {

      setRouteData({
        duration: "15 mins",
        distance: "4.5 km"
      });

    }, 1200);

  }, []);

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center">

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0f0a] to-black"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >

        <h2 className="text-3xl font-bold mb-6 text-orange-400 text-center">
          Delivery Tracking
        </h2>

        <div className="flex flex-col items-center mb-6">

          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
            className="w-24"
          />

          <p className="text-green-400 font-semibold text-lg mt-3">
            🚚 Your order is on the way!
          </p>

        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6">

          <p className="text-lg mb-2">
            From <b>{restaurantDetails?.name}</b>
          </p>

          <p className="text-sm text-white/70 mb-4">
            {restaurantDetails?.address}
          </p>

          <p className="text-lg mb-2">
            Delivering To
          </p>

          <p className="text-sm text-white/70 mb-4">
            {deliveryAddress}
          </p>

          <p className="text-xl font-bold text-green-400">
            ETA: {routeData.duration}
          </p>

          <p className="text-sm text-white/70">
            Distance: {routeData.distance}
          </p>

        </div>

      </motion.div>

    </div>
  );
};

export default DeliveryTracking;