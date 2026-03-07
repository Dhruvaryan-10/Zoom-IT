import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdMail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginComponents = ({ setLoggedInEmail }) => {
  const [view, setView] = useState("login");

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-black font-sans">

      {/* Background */}
      <img
        src="/bk6.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover animate-slowZoom"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-red-500/20 to-transparent" />

      {/* Glow blobs */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/30 blur-[120px] rounded-full top-[-120px] left-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-red-500/30 blur-[120px] rounded-full bottom-[-120px] right-[-120px]" />

      <div className="relative z-10 flex h-full w-full text-white">

        {/* LEFT BRANDING */}
        <div className="hidden md:flex flex-col justify-between w-1/2 px-16 py-10">

          <div>
            <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Zoom-it
            </h1>

            <p className="text-white/70 text-lg max-w-sm">
              Discover restaurants, order your favorite meals and get them
              delivered faster than ever.
            </p>
          </div>

          <p className="text-white/60 text-sm">
            © 2026 Zoom-it Technologies
          </p>

        </div>

        {/* LOGIN CARD */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-[95%] max-w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10"
          >

            <h1 className="text-3xl font-bold text-center mb-6">
              {view === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <AuthForm
              view={view}
              setView={setView}
              setLoggedInEmail={setLoggedInEmail}
            />

          </motion.div>

        </div>

      </div>
    </div>
  );
};

/* ========================================================= */
/* AUTH FORM */
/* ========================================================= */

const AuthForm = ({ view, setView, setLoggedInEmail }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = useCallback(() => {

    const newErrors = {};

    if (view === "signup" && !formData.username)
      newErrors.username = "Username required";

    if (!formData.email)
      newErrors.email = "Email required";

    if (!formData.password)
      newErrors.password = "Password required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }, [formData, view]);

  const handleSubmit = useCallback(async (e) => {

    e.preventDefault();
    if (!validate()) return;

    const url =
      view === "login"
        ? "http://localhost:5000/api/login"
        : "http://localhost:5000/api/signup";

    try {

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("email", data.user.email);
        setLoggedInEmail(data.user.email);

        navigate(view === "login" ? "/cities" : "/info");

      } else {

        setErrors({ form: data.message });

      }

    } catch {

      setErrors({ form: "Server connection failed" });

    }

  }, [formData, validate, navigate, view, setLoggedInEmail]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">

        {view === "signup" && (
          <InputField
            name="username"
            placeholder="Username"
            icon="person"
            value={formData.username}
            onChange={handleChange}
          />
        )}

        <InputField
          name="email"
          placeholder="Email"
          icon="mail"
          value={formData.email}
          onChange={handleChange}
        />

        <InputField
          name="password"
          type="password"
          placeholder="Password"
          icon="lock"
          value={formData.password}
          onChange={handleChange}
        />

        {errors.form && (
          <p className="text-sm text-red-400 text-center">{errors.form}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#FF3B30] to-[#FF7A18]"
        >
          {view === "login" ? "Log in" : "Sign up"}
        </button>

      </form>

      {view === "login" && (
        <>
          <OAuthButtons setLoggedInEmail={setLoggedInEmail} />

          <button
            onClick={() => setView("signup")}
            className="w-full mt-6 border border-white/30 py-2 rounded-xl hover:bg-white/10"
          >
            Sign up
          </button>
        </>
      )}

      {view === "signup" && (
        <button
          onClick={() => setView("login")}
          className="w-full mt-6 border border-white/30 py-2 rounded-xl hover:bg-white/10"
        >
          Already have an account? Log in
        </button>
      )}
    </>
  );
};

/* ========================================================= */
/* GOOGLE LOGIN */
/* ========================================================= */

const OAuthButtons = ({ setLoggedInEmail }) => {

  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {

    try {

      const user = jwtDecode(credentialResponse.credential);

      const res = await fetch("http://localhost:5000/api/googleLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          username: user.name,
        }),
      });

      const data = await res.json();

      localStorage.setItem("email", data.user.email);
      setLoggedInEmail(data.user.email);

      navigate("/cities");

    } catch (err) {

      console.error("Google login failed", err);

    }

  };

  return (
    <>
      <div className="text-center text-sm text-white/70 mt-4">
        Or continue with
      </div>

      <div className="flex gap-4 mt-4">

        {/* GOOGLE */}
        <div className="flex-1 flex justify-center border border-white/20 rounded-xl py-2 hover:bg-white/10">

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google login failed")}
          />

        </div>

        {/* APPLE */}
        <button className="flex-1 flex items-center justify-center gap-2 border border-white/20 rounded-xl py-2 hover:bg-white/10">
          <FaApple /> Apple
        </button>

      </div>
    </>
  );
};

/* ========================================================= */
/* INPUT FIELD */
/* ========================================================= */

const InputField = memo(({ name, type = "text", placeholder, icon, value, onChange }) => {

  const [show, setShow] = useState(false);

  const icons = {
    mail: <MdMail className="absolute left-3 top-3 text-white/70" />,
    lock: <MdLock className="absolute left-3 top-3 text-white/70" />,
    person: <MdPerson className="absolute left-3 top-3 text-white/70" />,
  };

  return (
    <div className="relative">

      {icons[icon]}

      <input
        name={name}
        type={type === "password" && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-3 text-white/70"
        >
          {show ? <MdVisibility /> : <MdVisibilityOff />}
        </button>
      )}

    </div>
  );
});

export default LoginComponents;