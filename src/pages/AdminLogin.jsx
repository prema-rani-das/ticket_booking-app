// src/pages/AdminLogin.jsx
// Professional Admin Login Page with React Icons

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaLock,
  FaUnlock,
  FaUserShield,
  FaUser,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowRight,
  FaShieldAlt,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = () => {
    if (!form.username.trim()) return setError("Please enter username!");
    if (!form.password) return setError("Please enter password!");

    setLoading(true);
    setTimeout(() => {
      const res = adminLogin(form);
      if (!res.ok) {
        setError(res.message);
      } else {
        navigate("/admin");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 md:px-8 py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl text-white mx-auto mb-4">
              <MdAdminPanelSettings />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-red-100 text-sm mt-2">Sign in to manage the system</p>
          </div>

          {/* Form */}
          <div className="px-6 md:px-8 py-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur px-4 py-3 text-sm font-medium text-red-300 flex items-start gap-3">
                <FaExclamationTriangle className="mt-0.5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <FaUser className="text-red-400" />
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUserShield className="text-gray-400" />
                </div>
                <input
                  className="w-full rounded-lg bg-white/10 border border-white/10 backdrop-blur pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30 outline-none transition"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <FaKey className="text-red-400" />
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  className="w-full rounded-lg bg-white/10 border border-white/10 backdrop-blur pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30 outline-none transition"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  title={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3.5 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <FaUnlock />
                  Sign In
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur px-4 py-3 text-xs text-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FaInfoCircle className="text-blue-400" />
                <span className="font-semibold">Demo Credentials:</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-center">
                <div className="bg-blue-900/30 rounded px-2 py-1">
                  <span className="text-blue-300">Username</span>
                  <p className="font-mono text-white">admin</p>
                </div>
                <div className="bg-blue-900/30 rounded px-2 py-1">
                  <span className="text-blue-300">Password</span>
                  <p className="font-mono text-white">admin123</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 py-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">Regular user?</p>
            <Link
              to="/login"
              className="mt-2 inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition group"
            >
              <FaUserShield className="group-hover:rotate-12 transition" />
              User Login
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 backdrop-blur px-4 py-3 text-xs text-yellow-200 flex items-start gap-3">
          <FaShieldAlt className="mt-0.5 flex-shrink-0 text-yellow-400" />
          <span>This is a demo application. Production systems use secure authentication methods.</span>
        </div>
      </div>

      {/* Blob Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}