// src/pages/Landing.jsx
// Professional Landing Page with Animations

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TRANSPORT_TYPES } from "../data/transports";
import {
  FaTicketAlt,
  FaBolt,
  FaCreditCard,
  FaPrint,
  FaLock,
  FaMoon,
  FaRocket,
  FaArrowRight,
  FaUserPlus,
  FaPlane,
  FaTrain,
  FaBus,
  FaShip,
  FaHelicopter,
  FaSubway,
  FaCheckCircle,
  FaShoppingCart,
  FaWallet,
  FaQrcode,
  FaStar,
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaAward,
  FaArrowLeft,
  FaArrowRight as FaArrowRightIcon,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

// Transport Icons Mapping
const transportIcons = {
  "✈️": <FaPlane />,
  "🚆": <FaTrain />,
  "🚌": <FaBus />,
  "🚢": <FaShip />,
  "🚁": <FaHelicopter />,
  "🚇": <FaSubway />,
  "🛥️": <FaShip />,
};

const FEATURES = [
  {
    icon: <FaTicketAlt />,
    title: "All Vehicles One Platform",
    desc: "Air, rail, road, and waterways — book tickets for 7 types of vehicles from one place.",
    delay: 0.1,
  },
  {
    icon: <FaBolt />,
    title: "Instant Booking",
    desc: "From route selection to receiving your ticket — the entire process takes just minutes.",
    delay: 0.2,
  },
  {
    icon: <FaCreditCard />,
    title: "Easy Payment",
    desc: "bKash, Nagad, Cards & Mobile Banking — pay with any method you prefer.",
    delay: 0.3,
  },
  {
    icon: <FaPrint />,
    title: "Professional E-Ticket",
    desc: "Premium tickets with QR codes — download and print instantly.",
    delay: 0.4,
  },
  {
    icon: <FaLock />,
    title: "Secure Account",
    desc: "All your bookings in one account — view old tickets anytime.",
    delay: 0.5,
  },
  {
    icon: <FaMoon />,
    title: "Light & Dark Mode",
    desc: "Day or night — use in your preferred mode for eye comfort.",
    delay: 0.6,
  },
];

const STEPS = [
  {
    num: "01",
    icon: <FaShoppingCart />,
    title: "Select Vehicle",
    desc: "Choose your preferred transport and route.",
    delay: 0.1,
  },
  {
    num: "02",
    icon: <FaTicketAlt />,
    title: "Book Seat",
    desc: "Pick your seat and provide passenger details.",
    delay: 0.2,
  },
  {
    num: "03",
    icon: <FaWallet />,
    title: "Make Payment",
    desc: "Pay via bKash, Nagad, Card or Mobile Banking.",
    delay: 0.3,
  },
  {
    num: "04",
    icon: <FaQrcode />,
    title: "Get E-Ticket",
    desc: "Download e-ticket with QR code and start your journey!",
    delay: 0.4,
  },
];

const TESTIMONIALS = [
  {
    name: "Rahim Uddin",
    role: "Business Traveler",
    text: "Smart Ticket Booking has completely changed how I travel for business. Quick, reliable, and the e-tickets are professional.",
    rating: 5,
    delay: 0.1,
  },
  {
    name: "Sadia Rahman",
    role: "Student",
    text: "As a student, I travel frequently. This platform saves me time and the QR code system makes boarding so easy!",
    rating: 5,
    delay: 0.2,
  },
  {
    name: "Imran Hossain",
    role: "Tourist",
    text: "Visiting Bangladesh has never been easier! Booked all my transport tickets in one place. Highly recommended for tourists.",
    rating: 5,
    delay: 0.3,
  },
];

export default function Landing() {
  const { user } = useAuth();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ---------- Hero Section - White ---------- */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-pink-100/20 to-indigo-100/20 rounded-full blur-3xl animate-float-delayed"></div>
          
          {/* Floating Transport Icons */}
          <div className="absolute top-10 left-10 text-7xl opacity-10 animate-float">
            <FaPlane className="text-indigo-600" />
          </div>
          <div className="absolute top-40 right-20 text-6xl opacity-10 animate-float-delayed">
            <FaTrain className="text-purple-600" />
          </div>
          <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-float">
            <FaBus className="text-blue-600" />
          </div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-10 animate-float-delayed">
            <FaShip className="text-teal-600" />
          </div>
          <div className="absolute top-1/2 left-10 text-5xl opacity-5 animate-pulse-slow">
            <FaHelicopter className="text-green-600" />
          </div>
          <div className="absolute bottom-1/3 right-10 text-5xl opacity-5 animate-pulse-slow">
            <FaSubway className="text-red-600" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-32 text-center z-10">
          {/* Badge - Fade In */}
          <div className="animate-fade-in-down inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            🇧🇩 Bangladesh's Leading Ticket Platform
          </div>

          {/* Main Heading - Fade In Up */}
          <h1 className="animate-fade-in-up mt-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
            From Sky to River —<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Your Journey Starts Here
            </span>
          </h1>

          {/* Subtitle - Fade In Up */}
          <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400" style={{ animationDelay: "0.2s" }}>
            Book tickets for flights, trains, buses, launches, and more in minutes.
            Get professional e-tickets with QR codes instantly.
          </p>

          {/* CTA Buttons - Scale In */}
          <div className="animate-scale-in mt-8 flex flex-wrap justify-center gap-4" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/home"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-lg font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
            >
              <FaTicketAlt className="group-hover:rotate-12 transition-transform" />
              Book Tickets
              <FaArrowRight className="group-hover:translate-x-1 transition-transform text-sm" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-8 py-3.5 text-lg font-semibold text-gray-700 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 hover:scale-105"
              >
                <FaUserPlus className="group-hover:rotate-12 transition-transform" />
                Create Account
              </Link>
            )}
          </div>

          {/* Stats - Fade In Up */}
          <div className="animate-fade-in-up mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 border-t border-gray-200 pt-12 dark:border-gray-700" style={{ animationDelay: "0.6s" }}>
            {[
              { number: "50K+", label: "Happy Customers", icon: <FaUsers /> },
              { number: "100+", label: "Routes Covered", icon: <FaGlobe /> },
              { number: "24/7", label: "Customer Support", icon: <FaShieldAlt /> },
              { number: "4.8★", label: "User Rating", icon: <FaAward /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators - Fade In Up */}
          <div className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400" style={{ animationDelay: "0.8s" }}>
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-green-500 animate-pulse-slow" />
              Trusted by 50K+ travelers
            </span>
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-400 animate-pulse-slow" />
              4.8/5 average rating
            </span>
            <span className="flex items-center gap-1">
              <FaLock className="text-indigo-600 dark:text-indigo-400 animate-pulse-slow" />
              100% secure booking
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Transport Types Showcase ---------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
            Transport Options
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
            Air, rail, water, or road — all in one platform
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {TRANSPORT_TYPES.map((t, index) => (
            <Link
              key={t.id}
              to="/home"
              className="group rounded-2xl bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <span className="text-4xl text-indigo-600 dark:text-indigo-400 block transition-all group-hover:scale-110 group-hover:rotate-12">
                {transportIcons[t.icon] || t.icon}
              </span>
              <p className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">{t.name}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Features Section ---------- */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              Why Smart Ticket Booking?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
              Everything you need for hassle-free travel
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, index) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 dark:bg-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-2xl text-indigo-600 transition-all group-hover:scale-110 group-hover:rotate-6 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How It Works ---------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
            Book in 4 Easy Steps
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
            Get your e-ticket in just minutes
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {STEPS.map((s, index) => (
            <div
              key={s.num}
              className="group relative rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 dark:bg-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl text-white transition-all group-hover:scale-110 group-hover:rotate-12">
                {s.icon}
              </div>
              <div className="absolute -top-2 right-4 text-4xl font-bold text-indigo-100 dark:text-indigo-900/30 animate-pulse-slow">
                {s.num}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              What Our Travelers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
              Real reviews from real customers
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, index) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 dark:bg-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <FaStar key={i} className="animate-pulse-slow" />
                  ))}
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  "{t.text}"
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 shadow-xl">
            {/* Animated background elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>

            <div className="relative z-10 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-3 text-indigo-100">
                Book your tickets now and travel with ease
              </p>
              <Link
                to="/home"
                className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-lg font-semibold text-indigo-700 transition-all hover:bg-indigo-50 hover:shadow-lg hover:scale-105"
              >
                <FaRocket className="group-hover:rotate-12 transition-transform" />
                Book Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 7s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}