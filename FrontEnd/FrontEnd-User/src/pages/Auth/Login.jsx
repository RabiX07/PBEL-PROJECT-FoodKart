import React, { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { login } from "../../api/user/login";
import { checkAuth } from "../../api/user/checkAuth";  
import leftimg from "../../assets/leftimg.jpg"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


    useEffect(() => {
    async function verify() {
      const res = await checkAuth();
      if (res.authenticated) {
        window.location.href = "/dashboard";
      }
    }
    verify();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    // simple email format check
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    await login(email, password)
      .then((data) => {
        if (data.success) {   
          setEmail("");
          setPassword("");
          window.location.href = "/dashboard";
          console.log("Login successful");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      }); 
  };

  // exact homepage yellow used for primary accents:
  const PRIMARY_YELLOW = "#f6b318";

  return (
    <div className="min-h-screen w-full relative bg-gray-900">
      {/* full-bleed decorative background (homepage sample) */}

      {/* dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 pointer-events-none" />

      <div className="relative z-10 min-h-dvh flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-4xl w-full bg-white/6 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-black/5">
          {/* Left: Illustration (tonal, matches homepage) */}

          <div className="hidden md:block p-10 bg-gradient-to-br from-gray-900 via-slate-800 to-black">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col justify-center gap-6 text-white"
            >
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2 drop-shadow">Welcome back</h2>
                <p className="opacity-85">Sign in to FoodKart — order fast, eat happy.</p>
              </div>

              
              <div className="mt-6">
                {/* <svg viewBox="0 0 600 400" className="w-full h-auto max-h-64" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.12" />
                      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.04" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
                  <g transform="translate(40,40)">
                    <rect x="0" y="20" rx="16" width="340" height="180" fill="#ffffff12" />
                    <g transform="translate(20,40)">
                      <ellipse cx="200" cy="60" rx="80" ry="36" fill="#fff" opacity="0.06" />
                      <rect x="0" y="0" rx="6" width="40" height="90" fill="#fff" opacity="0.08" transform="rotate(-8 0 0)"/>
                      <circle cx="320" cy="40" r="16" fill="#fff" opacity="0.08" />
                    </g>
                  </g>
                </svg> */}
                <img src={leftimg} alt="Left side illustration" />

              </div>

              <div className="text-white opacity-85 leading-relaxed text-sm">
                <p>Built for food lovers — fast checkout, tasty deals, and more waiting in line.</p>
              </div>
            </motion.div>

            
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/6 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -top-16 w-48 h-48 rounded-full bg-white/6 blur-2xl" />
          </div>

          
          <div className="p-4 sm:p-8 md:p-12 flex items-center justify-center bg-transparent">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md mx-auto bg-white bg-opacity-95 rounded-xl p-5 sm:p-6 shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-indigo-600"
                >
                  FK
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Sign in to your account</h1>
                  <p className="text-sm text-gray-600">Enter your credentials to continue</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
                    {error}
                  </div>
                )}

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-1 block w-full rounded-lg border border-black/10 shadow-sm p-3 focus:outline-none"
                    aria-label="Email address"
                    required
                    style={{
                      boxShadow: "none",
                      transition: "box-shadow 120ms, border-color 120ms",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = PRIMARY_YELLOW; }}
                    onBlur={(e) => { e.target.style.borderColor = ""; }}
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Password</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-sm"
                      style={{ color: PRIMARY_YELLOW }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-black/10 shadow-sm p-3 pr-28"
                      aria-label="Password"
                      required
                      style={{ transition: "box-shadow 120ms, border-color 120ms" }}
                      onFocus={(e) => { e.target.style.borderColor = PRIMARY_YELLOW; }}
                      onBlur={(e) => { e.target.style.borderColor = ""; }}
                    />

                    <div className="absolute right-2 top-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded-md bg-white border border-black/10"
                        onClick={() => {
                          setPassword("");
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-black/10" />
                    <span className="text-gray-600">Remember me</span>
                  </label>

                  <a href="#" className="hover:underline" style={{ color: PRIMARY_YELLOW }}>
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg p-3 text-white font-semibold shadow disabled:opacity-60"
                  style={{
                    backgroundColor: PRIMARY_YELLOW,
                    color: "#111",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
                  }}
                >
                  {loading ? (
                    <svg
                      className="animate-spin w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  Don't have an account? <Link to="/signup" style={{ color: PRIMARY_YELLOW }} className="hover:underline">Sign up</Link>
                </p>
              </div>

             
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
