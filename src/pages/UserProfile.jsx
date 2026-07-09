// src/pages/UserProfile.jsx
// Professional User Profile Page with React Icons

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaTicketAlt,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaLightbulb,
} from "react-icons/fa";
import { MdDashboard, MdConfirmationNumber } from "react-icons/md";

export default function UserProfile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [password, setPassword] = useState({ old: "", new: "", confirm: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
    try {
      const bookings = JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
      const userBookings = bookings.filter((b) => b.passenger?.id === user?.id);
      setBookingCount(userBookings.length);
    } catch (e) {
      console.log("Error:", e);
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleUpdateProfile = () => {
    if (!formData.name.trim()) {
      setError("Name cannot be empty!");
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address!");
      return;
    }
    if (!formData.phone.trim() || !/^01[3-9]\d{8}$/.test(formData.phone)) {
      setError("Please enter a valid 11-digit phone number!");
      return;
    }

    const res = updateProfile(formData);
    if (res.ok) {
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(res.message);
    }
  };

  const handleChangePassword = () => {
    if (!password.old || !password.new || !password.confirm) {
      setError("Please fill all fields!");
      return;
    }
    if (password.old !== user.password) {
      setError("Current password is incorrect!");
      return;
    }
    if (password.new.length < 6) {
      setError("New password must be at least 6 characters!");
      return;
    }
    if (password.new !== password.confirm) {
      setError("Passwords do not match!");
      return;
    }

    const res = updateProfile({ password: password.new });
    if (res.ok) {
      setSuccess("Password changed successfully!");
      setPassword({ old: "", new: "", confirm: "" });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl text-white">
                  <FaUser />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <FaCheckCircle />
                  Verified
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Bookings</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {bookingCount}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {user?.joinedAt || "2026"}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Messages */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
                <FaExclamationTriangle className="inline mr-2" />
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
                <FaCheckCircle className="inline mr-2" />
                {success}
              </div>
            )}

            {/* Personal Information */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                  <FaUserCircle className="text-indigo-500" />
                  Personal Information
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {isEditing ? (
                    <>
                      <FaTimes />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaUser className="inline mr-1.5 text-indigo-500" />
                      Full Name
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaEnvelope className="inline mr-1.5 text-indigo-500" />
                      Email Address
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaPhone className="inline mr-1.5 text-indigo-500" />
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      name="phone"
                      maxLength={11}
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Security */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                  <FaLock className="text-indigo-500" />
                  Security
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {showPasswordForm ? (
                    <>
                      <FaTimes />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaKey />
                      Change Password
                    </>
                  )}
                </button>
              </div>

              {showPasswordForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      type="password"
                      name="old"
                      placeholder="Enter current password"
                      value={password.old}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      type="password"
                      name="new"
                      placeholder="Minimum 6 characters"
                      value={password.new}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      type="password"
                      name="confirm"
                      placeholder="Re-enter new password"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <FaLock />
                    Update Password
                  </button>
                </div>
              ) : (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <FaShieldAlt className="inline mr-2" />
                    Your password is secure. Change it regularly to keep your account safe.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
                <FaTicketAlt className="text-indigo-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20"
                >
                  <div className="flex items-center gap-3">
                    <MdDashboard className="text-indigo-500 text-xl" />
                    <span className="font-medium text-gray-900 dark:text-white">Dashboard</span>
                  </div>
                  <FaArrowLeft className="text-gray-400 text-sm rotate-180" />
                </Link>
                <Link
                  to="/home"
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition hover:border-purple-500 hover:bg-purple-50 dark:border-gray-700 dark:hover:border-purple-400 dark:hover:bg-purple-900/20"
                >
                  <div className="flex items-center gap-3">
                    <FaTicketAlt className="text-purple-500 text-xl" />
                    <span className="font-medium text-gray-900 dark:text-white">Book Ticket</span>
                  </div>
                  <FaArrowLeft className="text-gray-400 text-sm rotate-180" />
                </Link>
              </div>
            </div>

            {/* Tip */}
            <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-900/20">
              <div className="flex items-start gap-3">
                <FaLightbulb className="mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Keep your profile information up to date to receive booking confirmations and travel updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}