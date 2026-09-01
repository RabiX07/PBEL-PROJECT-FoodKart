import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { sendOtp } from "../../api/user/sendOtp";
import { signup } from "../../api/user/signUp";
import leftimg from "../../assets/leftimg.jpg"



export default function Signup() {
  // Step: 1 = collect details, 2 = verify OTP, 3 = success
  const [step, setStep] = useState(1);

  // form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP / verification
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // resend timer
  const RESEND_SECONDS = 60;
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [secondsLeft]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const PRIMARY_YELLOW = "#f6b318"; 


  function basicValidation() {
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill all fields.");
      return false;
    }
    const cleanEmail = (email || "").trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setError("Password should be at least 8 characters.");
      return false;
    }
    setError("");
    return true;
  }

  
  const sendOtpToEmail = async () => {
    
    if (!basicValidation()) return;
    setLoading(true);
    setError("");

    await
      sendOtp(email).then((res) => {
        if (res.success) {
          setOtpSent(true);
          setStep(2);
          setSecondsLeft(RESEND_SECONDS);
          setLoading(false);
        } else {
          setLoading(false);
          setError(res.message || "Failed to send OTP. Please try again."); 
        }

      });

  };

  const verifyOtp = async () => {
    setOtpError("");
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit code we sent to your email.");
      return;
    }

    setLoading(true);

    await signup(fullName, email, password, otp).then((res) => {
      if (res.success) {
        setEmail("");
        setFullName("");
        setPassword("");
        setOtp("");
        setStep(3);
        setLoading(false);
      } else {
        setLoading(false);
        setOtpError(res.message || "Failed to create account. Please try again.");
      }
    });


  };

  const resendOtp = async () => {
    if (secondsLeft > 0) return;
    setOtp("");
    setOtpError("");
    await sendOtpToEmail();
  };

  const handleBackToLogin = () => { 
      window.location.href = "/login";  
  };

  return (
    <div className="min-h-screen w-full relative bg-gray-900">
      {/* full-bleed decorative background (homepage sample) */}

      {/* dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 pointer-events-none" />

      <div className="relative z-10 min-h-dvh flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-4xl w-full bg-white/6 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-black/5">

          {/* Left: Illustration block (tonal, matches homepage) */}
          <div className="hidden md:block p-10 bg-gradient-to-br from-gray-900 via-slate-800 to-black">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col justify-center gap-6 text-white"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2 drop-shadow">Create your account</h2>
                <p className="opacity-85">A simple, secure signup with email verification.</p>
              </div>

              <div className="mt-6">
                  {/* <svg viewBox="0 0 600 400" className="w-full h-auto max-h-64" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="g2" x1="0" x2="1">
                        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.12" />
                        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.04" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#g2)" />
                    <g transform="translate(40,40)">
                      <rect x="0" y="20" rx="16" width="340" height="180" fill="#ffffff22" />

                      <g transform="translate(20,40)">
                        <rect x="0" y="0" rx="10" width="120" height="90" fill="#fff" opacity="0.12" />
                        <rect x="140" y="0" rx="10" width="160" height="60" fill="#fff" opacity="0.12" />
                        <rect x="0" y="110" rx="8" width="280" height="12" fill="#fff" opacity="0.08" />
                        <circle cx="260" cy="120" r="16" fill="#fff" opacity="0.12" />
                      </g>
                    </g>
                  </svg> */}
                  <img src={leftimg} alt="Left side illustration" />
              </div>

              <div className="text-white opacity-85 leading-relaxed text-sm">
                <p>We send a one-time code to your email to verify your account. This prevents spam and keeps your account secure.</p>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/6 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -top-16 w-48 h-48 rounded-full bg-white/6 blur-2xl" />
          </div>

          {/* Right: Signup form / OTP (matches Login theme) */}
          <div className="p-4 sm:p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md mx-auto bg-white bg-opacity-95 rounded-xl p-5 sm:p-6 shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg text-indigo-600" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  FK
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
                  <p className="text-sm text-gray-600">Two-step signup — details and email verification</p>
                </div>
              </div>

              {step === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendOtpToEmail();
                  }}
                  className="space-y-4"
                >
                  {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Full name</span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1 block w-full rounded-lg border border-black/10 shadow-sm p-3"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      type="email"
                      className="mt-1 block w-full rounded-lg border border-black/10 shadow-sm p-3"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Password</span>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      type="password"
                      className="mt-1 block w-full rounded-lg border border-black/10 shadow-sm p-3"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg p-3 text-white font-semibold shadow disabled:opacity-60"
                    style={{ backgroundColor: PRIMARY_YELLOW, color: "#111", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                  >
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                      </svg>
                    ) : (
                      "Send verification code"
                    )}
                  </button>



                  <div className="mt-4 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" style={{ color: PRIMARY_YELLOW }} className="hover:underline">Sign in</Link>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-700">
                    <div className="mb-2">We sent a 6-digit code to <span className="font-medium">{maskEmail(email)}</span></div>
                    <div className="text-xs text-gray-400">Enter the code below to verify your email and create your account.</div>
                  </div>

                  {otpError && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{otpError}</div>}

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Verification code</span>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(filterDigits(e.target.value, 6))}
                      placeholder="123456"
                      inputMode="numeric"
                      className="mt-1 block w-full rounded-lg border border-black/10 shadow-sm p-3 tracking-widest text-center text-lg"
                      maxLength={6}
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={verifyOtp}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg p-3 text-white font-semibold shadow disabled:opacity-60 flex-1"
                      style={{ backgroundColor: PRIMARY_YELLOW, color: "#111" }}
                    >
                      {loading ? (
                        <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                        </svg>
                      ) : (
                        "Verify & create account"
                      )}
                    </button>

                    <button onClick={() => { setStep(1); setOtp(""); }} className="px-3 py-2 rounded-lg border border-black/10 text-sm">Edit details</button>
                  </div>

                  <div className="text-sm text-gray-500">
                    {secondsLeft > 0 ? (
                      <div>Resend code in <span className="font-medium">{secondsLeft}s</span></div>
                    ) : (
                      <div>
                        Didn’t get it? <button onClick={resendOtp} className="hover:underline" style={{ color: PRIMARY_YELLOW }}>Resend code</button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <button onClick={handleBackToLogin} className="hover:underline" style={{ color: PRIMARY_YELLOW }}>Back to sign in</button>
                  </div>

                  <div className="mt-6 text-xs text-gray-400">Tip: Check your spam folder if you don't see the email.</div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 text-center">
                  <div className="text-green-500 font-semibold">Account created successfully!</div>
                  <div className="text-sm text-gray-600">You can now sign in using your email and password.</div>
                  <button
                    onClick={handleBackToLogin}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg p-3 text-white font-semibold shadow"
                    style={{ backgroundColor: PRIMARY_YELLOW, color: "#111" }}
                  >
                    Back to sign in
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  // ------------------ helpers ------------------
  function maskEmail(e) {
    if (!e) return "";
    const [local, domain] = e.split("@");
    if (!domain) return e;
    const visible = local.length > 2 ? local.slice(0, 2) : local[0];
    return `${visible.replace(/./g, "*")}${local.slice(-1)}@${domain}`;
  }

  function filterDigits(value, maxLen = 6) {
    return value.replace(/[^0-9]/g, "").slice(0, maxLen);
  }
}
