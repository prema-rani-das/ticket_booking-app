// src/components/Footer.jsx
// Professional Footer with Icons - React Icons Version

import { Link } from "react-router-dom";
import { 
  FaTicketAlt, 
  FaHome, 
  FaSignInAlt, 
  FaUserPlus, 
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-r from-indigo-900 to-indigo-800 text-gray-300 dark:from-gray-900 dark:to-gray-800 dark:border-t dark:border-gray-700">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <FaTicketAlt className="text-2xl text-indigo-400" />
              <span>
                Smart <span className="text-indigo-400">Ticket</span> Booking
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Bangladesh's premier ticket booking platform for air, rail, road, and waterways. 
              Book tickets from home, get e-tickets with QR codes, and travel hassle-free.
            </p>
            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              <a 
                href="#" 
                className="rounded-full bg-white/10 p-2 text-gray-400 transition hover:bg-white/20 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-white/10 p-2 text-gray-400 transition hover:bg-white/20 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-white/10 p-2 text-gray-400 transition hover:bg-white/20 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-white/10 p-2 text-gray-400 transition hover:bg-white/20 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-2 transition hover:text-white">
                  <FaHome className="text-xs" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/home" className="flex items-center gap-2 transition hover:text-white">
                  <FaTicketAlt className="text-xs" />
                  Book Tickets
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2 transition hover:text-white">
                  <FaUserPlus className="text-xs" />
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="flex items-center gap-2 transition hover:text-white">
                  <FaSignInAlt className="text-xs" />
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="flex items-center gap-2 transition hover:text-white">
                  <FaShieldAlt className="text-xs" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaPhone className="mt-0.5 text-indigo-400" />
                <span>+880 1706 730155</span>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-0.5 text-indigo-400" />
                <span>support@smartticket.com.bd</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-0.5 text-indigo-400" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-3">
                <FaClock className="mt-0.5 text-indigo-400" />
                <span>24/7 Customer Support</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Additional Info */}
          <div>
            <h3 className="font-semibold text-white">Stay Updated</h3>
            <p className="mt-4 text-sm text-gray-400">
              Subscribe to get the latest updates on ticket availability and exclusive offers.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-gray-400 sm:flex-row">
            <span>
              © 2026 Smart Ticket Booking — All Rights Reserved
            </span>
            <span className="flex items-center gap-1">
              Made with <FaHeart className="text-red-400" /> in Bangladesh
            </span>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms</Link>
              <Link to="/help" className="hover:text-white transition">Help</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}