import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DEFAULT_RESTAURANT_DETAILS = {
  name: "Chosen Restaurant",
  address: "Restaurant Address",
};

const ReceiptPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const selectedItems = location.state?.selectedItems || [];

  const restaurantDetails =
    location.state?.restaurantDetails || DEFAULT_RESTAURANT_DETAILS;

  const userEmail = localStorage.getItem("email");

  const [deliveryAddress, setDeliveryAddress] = useState("Loading address...");
  const [paymentMode, setPaymentMode] = useState("Credit/Debit Card");

  /* =========================
     Fetch USER ADDRESS
  ========================= */

  useEffect(() => {

    if (!userEmail) return;

    fetch("http://localhost:5000/api/getUserDetails", {
      headers: {
        "x-user-email": userEmail,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDeliveryAddress(data.address);
      })
      .catch(() => {
        setDeliveryAddress("Address not found");
      });

  }, [userEmail]);

  /* =========================
     Price Calculations
  ========================= */

  const TAX_RATE = 0.18;

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * TAX_RATE;

  const preDeliveryTotal = subtotal + tax;

  const DELIVERY_CHARGE = preDeliveryTotal > 500 ? preDeliveryTotal * 0.15 : 50;

  const total = preDeliveryTotal + DELIVERY_CHARGE;

  /* =========================
     Payment API
  ========================= */

  const handlePayment = async () => {

    if (!userEmail) {
      alert("Please login again.");
      return;
    }

    const orderList = selectedItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");

    try {

      const response = await fetch(
        "http://localhost:5000/api/placeOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            orderList,
            paymentMode,
            totalPrice: total.toFixed(2),
          }),
        }
      );

      if (response.ok) {

        navigate("/delivery", {
          state: {
            restaurantDetails,
            deliveryAddress,
          },
        });

      } else {

        alert("❌ Failed to place order.");

      }

    } catch (err) {

      alert("❌ Server error.");

    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0f0a] to-black"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >

          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
            Order Receipt
          </h1>

          {/* ITEMS */}

          <div className="space-y-4 mb-6">

            {selectedItems.map((item, index) => (

              <div
                key={index}
                className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-3"
              >

                <div>

                  <p className="font-semibold">{item.name}</p>

                  <p className="text-sm text-white/60">
                    {item.quantity} × ₹{item.price}
                  </p>

                </div>

                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>

              </div>

            ))}

          </div>

          {/* PRICE SUMMARY */}

          <div className="space-y-2 text-sm border-t border-white/10 pt-4">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg text-orange-400 border-t border-white/10 pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

          </div>

          {/* DELIVERY ADDRESS */}

          <div className="mt-6 text-sm text-white/70">

            Delivering to:

            <div className="mt-1 bg-white/5 border border-white/10 rounded-lg p-3">
              {deliveryAddress}
            </div>

          </div>

          {/* PAYMENT */}

          <div className="mt-6">

            <p className="mb-2 font-semibold">Payment Method</p>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            >
              <option className="text-black">Credit/Debit Card</option>
              <option className="text-black">UPI</option>
              <option className="text-black">Cash on Delivery</option>
              <option className="text-black">Net Banking</option>
            </select>

          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}
            className="mt-6 w-full bg-gradient-to-r from-red-500 to-orange-500 py-3 rounded-xl font-semibold"
          >
            Confirm & Pay ₹{total.toFixed(2)}
          </motion.button>

        </motion.div>

      </div>
    </div>
  );
};

export default ReceiptPage;