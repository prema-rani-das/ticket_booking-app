// src/components/Navbar.jsx
// Professional Navbar with React Icons + Dark Mode + Auth Menu

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

// React Icons Import
import { 
  FaHome, 
  FaTicketAlt, 
  FaUser, 
  FaUserCog, 
  FaSignOutAlt,
  FaSignInAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaShieldAlt
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-white/20 text-white shadow-sm"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-700 to-indigo-900 shadow-lg dark:from-gray-900 dark:to-gray-800 dark:border-b dark:border-gray-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity"
          onClick={() => setOpen(false)}
        >
          <FaTicketAlt className="text-2xl text-indigo-300" />
          <span>
            Smart <span className="text-indigo-300">Ticket</span> Booking
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            <FaHome />
            Home
          </NavLink>
          <NavLink to="/home" className={linkClass}>
            <FaTicketAlt />
            Tickets
          </NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                <MdDashboard />
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <FaUser />
                Profile
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              <FaShieldAlt />
              Admin
            </NavLink>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-3 rounded-full bg-white/10 p-2.5 text-lg transition-all hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          {/* Auth Buttons */}
          {user || isAdmin ? (
            <div className="ml-3 flex items-center gap-3">
              {user && (
                <span className="hidden text-sm font-medium text-white/90 lg:inline">
                  {user.name.split(" ")[0]}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30 dark:bg-red-500/20 dark:hover:bg-red-500/30"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-3">
              <button className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-50 hover:shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                <FaSignInAlt />
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile: Toggle + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-full bg-white/10 p-2 text-lg dark:bg-gray-700/50"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-2xl text-white hover:bg-white/10 transition-colors"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden dark:border-gray-700">
          <div className="space-y-2">
            <NavLink
              to="/"
              className={linkClass}
              end
              onClick={() => setOpen(false)}
            >
              <FaHome />
              Home
            </NavLink>
            <NavLink
              to="/home"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <FaTicketAlt />
              Tickets
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <MdDashboard />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <FaUser />
                  Profile
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <FaShieldAlt />
                Admin
              </NavLink>
            )}
            <div className="pt-3">
              {user || isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/30 dark:bg-red-500/20 dark:hover:bg-red-500/30"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    <FaSignInAlt />
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}