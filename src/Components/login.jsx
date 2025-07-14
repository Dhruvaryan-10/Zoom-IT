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

const LoginComponents = ({ setLoggedInEmail }) => {
  const [view, setView] = useState("login");

  return (
    <div className="flex h-screen w-full bg-black">
      <div className="hidden md:flex flex-col justify-between w-1/2 px-10 py-8 bg-black text-white rounded-r-[2rem] overflow-hidden relative">
        <div>
          <h1 className="text-5xl font-bold mb-2 text-red-600">ZOOM-iT</h1>
          <ul className="flex gap-6 text-sm mt-4 text-red-600">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Contact</li>
          </ul>
        </div>
        <h2 className="text-4xl font-extrabold mb-20 text-red-600">Welcome!</h2>
        <img
          src="src/logos/bk4.jpg"
          alt="Decorative background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-black">
        <div className="w-[95%] max-w-[420px] bg-white border border-gray-200 shadow-xl rounded-[2rem] p-10 md:p-12">
          <h1 className="text-3xl font-bold text-center text-black mb-6">
            {view === "login" ? "Log in" : "Sign Up"}
          </h1>
          {view === "login" ? (
            <LoginView setLoggedInEmail={setLoggedInEmail} setView={setView} />
          ) : (
            <SignUpView setLoggedInEmail={setLoggedInEmail} setView={setView} />
          )}
        </div>
      </div>
    </div>
  );
};

const LoginView = ({ setLoggedInEmail, setView }) => (
  <>
    <LoginForm setLoggedInEmail={setLoggedInEmail} />
    <div className="mt-4 flex justify-between text-sm text-gray-600">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="accent-black" />
        <span className="text-black">Remember Me</span>
      </label>
      <a href="#" className="text-black hover:underline">Forgot Password?</a>
    </div>
    <button
      type="submit"
      form="login-form"
      className="w-full bg-red-600 text-white py-2 mt-6 rounded-full hover:bg-gray-800 transition font-medium"
    >
      Log in
    </button>
    <OAuthButtons />
    <button
      onClick={() => setView("signup")}
      className="w-full mt-6 border border-gray-300 py-2 rounded-full bg-transparent text-black hover:bg-red-600 transition"
    >
      Sign up
    </button>
  </>
);

const SignUpView = ({ setLoggedInEmail, setView }) => (
  <>
    <SignUpForm setLoggedInEmail={setLoggedInEmail} />
    <button
      onClick={() => setView("login")}
      className="w-full mt-6 border border-gray-300 py-2 rounded-full bg-transparent text-black hover:bg-gray-100 transition"
    >
      Already have an account? Log in
    </button>
  </>
);

const OAuthButtons = () => (
  <>
    <div className="text-center text-sm text-gray-500 mt-4">Or continue with</div>
    <div className="flex gap-4 mt-4">
      <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-100 text-black transition">
        <FcGoogle className="text-lg" /><span>Google</span>
      </button>
      <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-100 text-black transition">
        <FaApple className="text-lg" /><span>Apple</span>
      </button>
    </div>
  </>
);

const InputField = memo(({ id, label, type, placeholder, icon, value, onChange, error }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isPasswordField = type === "password";

  const getIcon = () => {
    switch (icon) {
      case "mail": return <MdMail className="absolute left-3 top-3 text-gray-500 text-lg" />;
      case "lock": return <MdLock className="absolute left-3 top-3 text-gray-500 text-lg" />;
      case "person": return <MdPerson className="absolute left-3 top-3 text-gray-500 text-lg" />;
      default: return null;
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="relative">
        {getIcon()}
        <input
          id={id}
          type={isPasswordField && isPasswordShown ? "text" : type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-black placeholder-gray-400"
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordShown(!isPasswordShown)}
            className="absolute right-3 top-3 text-gray-500 text-lg"
          >
            {isPasswordShown ? <MdVisibility /> : <MdVisibilityOff />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

const LoginForm = ({ setLoggedInEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });

  const validate = useCallback(() => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInEmail(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate("/cities");
      } else {
        setErrors(prev => ({ ...prev, form: data.message || "Login failed." }));
      }
    } catch {
      setErrors(prev => ({ ...prev, form: "Failed to connect to the server." }));
    }
  }, [email, password, navigate, setLoggedInEmail, validate]);

  return (
    <form id="login-form" onSubmit={handleLogin} className="space-y-4">
      <InputField id="login-email" label="Email" type="email" placeholder="Email" icon="mail" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <InputField id="login-password" label="Password" type="password" placeholder="Password" icon="lock" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}
    </form>
  );
};

const SignUpForm = ({ setLoggedInEmail }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: '', email: '', password: '', form: '' });

  const validate = useCallback(() => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, email, password]);

  const handleSignUp = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInEmail(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate("/info");
      } else {
        setErrors(prev => ({ ...prev, form: data.message || "Signup failed." }));
      }
    } catch {
      setErrors(prev => ({ ...prev, form: "Failed to connect to the server." }));
    }
  }, [username, email, password, navigate, setLoggedInEmail, validate]);

  return (
    <form id="signup-form" onSubmit={handleSignUp} className="space-y-4">
      <InputField id="signup-username" label="Username" type="text" placeholder="Username" icon="person" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} />
      <InputField id="signup-email" label="Email" type="email" placeholder="Email" icon="mail" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <InputField id="signup-password" label="Password" type="password" placeholder="Password" icon="lock" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 mt-2 rounded-full hover:bg-gray-800 transition font-medium"
      >
        Sign up
      </button>
    </form>
  );
};

export default LoginComponents;
