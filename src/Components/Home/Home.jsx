import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full text-white zoom-gradient flex flex-col">

      {/* NAVBAR */}

      <div className="fixed top-0 w-full flex justify-between items-center px-10 py-5 backdrop-blur-lg bg-black/20 z-50">

        <h1 className="text-3xl font-bold tracking-wide">
          Zoom-it
        </h1>

        <div className="flex gap-4">
          <Button
            variant="contained"
            sx={{ background: "#FF3B30" }}
            onClick={() => navigate("/login")}
          >
            Sign Up
          </Button>

          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>

      </div>

{/* HERO SECTION */}

<div className="flex flex-col items-center justify-center text-center h-screen px-6">

  <motion.h1
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-8xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent"
  >
    Zoom-it
  </motion.h1>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="text-2xl font-light text-white/90 mb-2"
  >
    Craving? Chilling? Cooking?
  </motion.p>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="text-xl text-white/70 mb-10"
  >
    Skip it — <span className="font-semibold text-white">Just Zoom-it™</span>
  </motion.p>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
  >

    <Button
      variant="contained"
      sx={{
        background: "linear-gradient(135deg,#FF7A18,#FF3B30)",
        fontWeight: "bold",
        padding: "16px 44px",
        fontSize: "18px",
        borderRadius: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        textTransform: "none",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 12px 25px rgba(0,0,0,0.35)",
        },
      }}
      onClick={() => navigate("/login")}
    >
      Order Now
    </Button>

  </motion.div>

</div>


{/* FEATURES */}

<div className="grid md:grid-cols-3 gap-12 px-16 pb-24">

  {[
    {
      title: "Fast Delivery",
      desc: "Get your favorite meals delivered to your doorstep in minutes.",
      icon: "⚡",
    },
    {
      title: "Top Restaurants",
      desc: "Discover the best restaurants and hidden food gems near you.",
      icon: "🍽️",
    },
    {
      title: "Live Tracking",
      desc: "Track your order in real-time from kitchen to doorstep.",
      icon: "📍",
    },
  ].map((item, index) => (

    <motion.div
      key={index}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-center"
    >

      <div className="text-4xl mb-4">{item.icon}</div>

      <h3 className="text-2xl font-semibold mb-3">
        {item.title}
      </h3>

      <p className="text-white/70 leading-relaxed">
        {item.desc}
      </p>

    </motion.div>

  ))}

</div>
      {/* FOOTER */}

      <footer className="bg-black text-white mt-auto">

        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

          <div>
            <h1 className="text-3xl font-bold">
              Zoom-it
            </h1>

            <h3 className="mt-4 font-bold">For Restaurants</h3>

            <ul className="space-y-1 text-sm text-gray-300">
              <li>Partner With Us</li>
              <li>Apps For You</li>
            </ul>

          </div>

          <div>
            <h3 className="font-bold">For Delivery Partners</h3>

            <ul className="space-y-1 text-sm text-gray-300">
              <li>Partner With Us</li>
              <li>Apps For You</li>
            </ul>

          </div>

          <div>
            <h3 className="font-bold">Learn More</h3>

            <ul className="space-y-1 text-sm text-gray-300">
              <li>Privacy</li>
              <li>Security</li>
              <li>Terms of Service</li>
              <li>Help & Support</li>
              <li>Report a Fraud</li>
              <li>Blog</li>
            </ul>

          </div>

          <div>

            <h3 className="font-bold mb-3">Social Links</h3>

            <div className="flex gap-3 text-xl mb-4">
              <FaLinkedin />
              <FaTwitter />
              <FaInstagram />
              <FaFacebook />
              <FaYoutube />
            </div>

            <div className="flex flex-col gap-2">

              <img
                src="/Appstore.png"
                alt="Download on App Store"
                className="h-10 cursor-pointer"
              />

              <img
                src="/Playstore.png"
                alt="Get it on Google Play"
                className="h-10 cursor-pointer"
              />

            </div>

          </div>

        </div>

        <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-700">

          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy and Content Policies.
          All trademarks are properties of their respective owners © Zoom-it™ Ltd.

        </div>

      </footer>

    </div>
  );
}