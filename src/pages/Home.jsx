// src/pages/Home.jsx
// Professional Home Page with Animations - React Icons Version

import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TRANSPORT_TYPES,
  TRIPS,
  formatPrice,
} from "../data/transports";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaTimes,
  FaTicketAlt,
  FaBus,
  FaPlane,
  FaTrain,
  FaShip,
  FaHelicopter,
  FaSubway,
  FaClock,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaInfoCircle,
  FaArrowLeft,
  FaFilter,
  FaSort,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";
import { MdDepartureBoard, MdDashboard } from "react-icons/md";

// Transport Icons Mapping
const transportIcons = {
  airplane: <FaPlane />,
  train: <FaTrain />,
  bus: <FaBus />,
  launch: <FaShip />,
  helicopter: <FaHelicopter />,
  metro: <FaSubway />,
  speedboat: <FaShip />,
};

export default function Home() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [animateItems, setAnimateItems] = useState(false);

  // Filtered trips
  const trips = useMemo(() => {
    let filtered = TRIPS.filter((t) => {
      const typeOk = selectedType === "all" || t.type === selectedType;
      const fromOk = !from.trim() || t.from.toLowerCase().includes(from.trim().toLowerCase());
      const toOk = !to.trim() || t.to.toLowerCase().includes(to.trim().toLowerCase());
      return typeOk && fromOk && toOk;
    });

    // Sort
    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "duration") {
      filtered.sort((a, b) => {
        const durA = parseInt(a.duration);
        const durB = parseInt(b.duration);
        return durA - durB;
      });
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  }, [selectedType, from, to, sortBy]);

  const typeInfo = (typeId) => TRANSPORT_TYPES.find((t) => t.id === typeId);

  // Animation for items
  useEffect(() => {
    setAnimateItems(false);
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, [selectedType, from, to]);

  // Scroll to top on filter change
  const resultsRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* ---------- Header ---------- */}
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            <FaTicketAlt />
            Book Your Journey
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Where are you going?
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Select your transport, find routes, book tickets — it's that simple!
          </p>
        </div>

        {/* ---------- Transport Tabs ---------- */}
        <div className="mt-8 overflow-x-auto pb-2">
          <div className="flex flex-nowrap justify-start md:justify-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedType("all")}
              className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                selectedType === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <FaSearch className="text-xs" />
              All
            </button>
            {TRANSPORT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  selectedType === t.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{transportIcons[t.id] || t.icon}</span>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Search & Filters ---------- */}
        <div className="mt-8">
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* From */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaMapMarkerAlt className="text-indigo-500" />
                  From
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="e.g., Dhaka"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
              </div>

              {/* To */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaLocationArrow className="text-purple-500" />
                  To
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="e.g., Cox's Bazar"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaSort className="text-gray-500" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="duration">Duration: Shortest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {(from || to || selectedType !== "all") && (
                  <button
                    onClick={() => {
                      setFrom("");
                      setTo("");
                      setSelectedType("all");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  >
                    <FaTimes />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Quick:</span>
              <button
                onClick={() => { setFrom("Dhaka"); setTo("Cox's Bazar"); }}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-indigo-100 hover:text-indigo-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                Dhaka → Cox's Bazar
              </button>
              <button
                onClick={() => { setFrom("Dhaka"); setTo("Chittagong"); }}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-indigo-100 hover:text-indigo-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                Dhaka → Chittagong
              </button>
              <button
                onClick={() => { setFrom("Dhaka"); setTo("Sylhet"); }}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-indigo-100 hover:text-indigo-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
              >
                Dhaka → Sylhet
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Results Count ---------- */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {trips.length > 0
              ? `${trips.length} trip${trips.length > 1 ? 's' : ''} found`
              : "No trips found"}
          </p>
          {trips.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Showing {trips.length} of {TRIPS.length} total
            </p>
          )}
        </div>

        {/* ---------- Results ---------- */}
        <div ref={resultsRef} className="mt-4 grid gap-5 md:grid-cols-2">
          {trips.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-gray-800 animate-fade-in-up">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                No trips found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try a different route or transport type
              </p>
              <button
                onClick={() => {
                  setFrom("");
                  setTo("");
                  setSelectedType("all");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <FaSearch />
                Clear Search
              </button>
            </div>
          ) : (
            trips.map((trip, index) => {
              const info = typeInfo(trip.type);
              return (
                <div
                  key={trip.id}
                  className={`group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 ${
                    animateItems ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {transportIcons[trip.type] || info?.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            {info?.name}
                          </span>
                          {trip.popularity > 50 && (
                            <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                              <FaStar className="text-xs" />
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                          {trip.operator}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {formatPrice(trip.price)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {trip.class}
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Departure</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trip.from}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <FaClock className="inline mr-1 text-xs" />
                        {trip.departure}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl text-indigo-400">→</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {trip.duration}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Arrival</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trip.to}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <FaClock className="inline mr-1 text-xs" />
                        {trip.arrival}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ID: <span className="font-mono">{trip.id}</span>
                      </span>
                      {trip.seatsAvailable && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          ✓ {trip.seatsAvailable} seats
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/booking/${trip.id}`}
                      className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-medium text-white transition hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
                    >
                      <FaTicketAlt />
                      Book Now
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ---------- Auth Notice ---------- */}
        {!user && trips.length > 0 && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6 text-center dark:from-indigo-900/20 dark:to-purple-900/20 animate-fade-in-up">
            <p className="text-gray-700 dark:text-gray-300">
              <FaInfoCircle className="inline mr-2 text-indigo-500" />
              To book tickets, please{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign In
              </Link>{" "}
              or{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Create Account
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Add animations CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .btn-primary {
          @apply inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 hover:shadow-lg;
        }

        .btn-outline {
          @apply inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400;
        }
      `}</style>
    </div>
  );
}