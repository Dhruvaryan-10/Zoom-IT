import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../../logos/bk5.jpg";

const ReceiptPage = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const userEmail = localStorage.getItem("email"); // Ensure email is stored at login/signup
  const [paymentMode, setPaymentMode] = useState("Credit/Debit Card");

  const TAX_RATE = 0.18;

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const tax = subtotal * TAX_RATE;
  const preDeliveryTotal = subtotal + tax;
  
  const DELIVERY_CHARGE = preDeliveryTotal > 500 ? preDeliveryTotal * 0.15 : 50;
  
  const total = preDeliveryTotal + DELIVERY_CHARGE;
  

  const handlePayment = async () => {
    if (!userEmail) {
      alert("User email not found. Please login.");
      return;
    }

    const orderList = selectedItems.map(
      (item) => `${item.name} x${item.quantity}`
    ).join(", ");

    try {
      const response = await fetch("http://localhost:5000/api/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          orderList,
          paymentMode,
          totalPrice: total.toFixed(2),
        }),
      });

      if (response.ok) {
        alert("✅ Payment Successful! Order placed.");
      } else {
        const errorData = await response.json();
        alert(`❌ ${errorData.message || 'Failed to place order. Try again.'}`);
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("❌ Failed to place order. Try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 flex items-center justify-center p-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-bold text-center text-red-500 mb-8">
            Order Receipt 🧾
          </h1>

          <div className="space-y-4">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-white/30 pb-2"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-red-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="text-lg font-medium">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/20 pt-4 space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t border-white/30 pt-3 text-red-400">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/30 shadow-inner bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
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
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition"
          >
            Confirm and Pay ₹{total.toFixed(2)}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiptPage;
