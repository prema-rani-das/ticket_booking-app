// src/pages/AdminDashboard.jsx
// Professional Admin Dashboard with Category System

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice, TRANSPORT_TYPES, TRIPS } from "../data/transports";
import {
  FaShieldAlt,
  FaSignOutAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaUsers,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaArrowRight,
  FaBus,
  FaPlane,
  FaTrain,
  FaShip,
  FaInfoCircle,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaSpinner,
  FaEye,
  FaFilter,
  FaDownload,
  FaPrint,
  FaUserPlus,
  FaMapMarkerAlt,
  FaClock as FaClockIcon,
  FaDollarSign,
  FaChair,
  FaTag,
  FaSync,
  FaHistory,
  FaChartBar,
  FaList,
  FaThLarge,
} from "react-icons/fa";
import { MdDashboard, MdConfirmationNumber, MdPayment, MdAirplaneTicket } from "react-icons/md";

// Transport Icons Mapping
const transportIcons = {
  flight: <FaPlane />,
  helicopter: <FaPlane />,
  train: <FaTrain />,
  metro: <FaTrain />,
  bus: <FaBus />,
  launch: <FaShip />,
  speedboat: <FaShip />,
  cng: <FaBus />,
  taxi: <FaBus />,
};

const defaultTrip = {
  from: "",
  to: "",
  departure: "",
  arrival: "",
  duration: "",
  date: "",
  type: "bus",
  operator: "",
  pricePerSeat: 0,
  totalSeats: 50,
  availableSeats: 50,
  class: "Economy",
  popularity: 0,
};

// Category colors
const categoryColors = {
  flight: "bg-blue-500",
  helicopter: "bg-purple-500",
  train: "bg-green-500",
  metro: "bg-cyan-500",
  bus: "bg-orange-500",
  launch: "bg-indigo-500",
  speedboat: "bg-teal-500",
  cng: "bg-yellow-500",
  taxi: "bg-red-500",
};

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("trips");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalAvailableSeats: 0,
    totalBookings: 0,
    paidBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });

  // Category wise stats
  const [categoryStats, setCategoryStats] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState(defaultTrip);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use ref to prevent infinite loop
  const isInitialized = useRef(false);

  // Check admin access
  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [isAdmin, navigate]);

  // Load data - ONLY ONCE on mount
  useEffect(() => {
    if (!isAdmin || isInitialized.current) return;
    isInitialized.current = true;

    loadAllData();
  }, [isAdmin]);

  // Separate function to load all data
  const loadAllData = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get today's date
      const today = new Date().toISOString().split("T")[0];
      
      // Load ALL trips from TRIPS array
      let tripData = [];
      
      if (TRIPS && TRIPS.length > 0) {
        tripData = TRIPS.map((trip) => ({
          ...trip,
          date: trip.date || today,
          availableSeats: trip.totalSeats || 50,
          id: trip.id || "TRIP" + Date.now() + Math.random().toString(36).substr(2, 4),
        }));
        
        // Save to localStorage for persistence
        localStorage.setItem("stb-trips", JSON.stringify(tripData));
      } else {
        // Fallback if TRIPS is empty
        tripData = [
          {
            id: "TRIP001",
            from: "Dhaka",
            to: "Chittagong",
            departure: "08:00 AM",
            arrival: "10:30 AM",
            duration: "2h 30m",
            date: today,
            type: "bus",
            operator: "Green Line",
            pricePerSeat: 1200,
            totalSeats: 50,
            availableSeats: 50,
            class: "AC Business",
            popularity: 80,
          },
          {
            id: "TRIP002",
            from: "Dhaka",
            to: "Cox's Bazar",
            departure: "09:00 AM",
            arrival: "12:00 PM",
            duration: "3h",
            date: today,
            type: "bus",
            operator: "Hanif Enterprise",
            pricePerSeat: 1800,
            totalSeats: 40,
            availableSeats: 40,
            class: "AC Sleeper",
            popularity: 90,
          },
        ];
        localStorage.setItem("stb-trips", JSON.stringify(tripData));
      }
      
      setTrips(tripData || []);

      // Calculate category stats
      calculateCategoryStats(tripData);

      // Load Bookings
      const allBookings = JSON.parse(localStorage.getItem("stb-bookings") || "[]");
      setBookings(allBookings.reverse());

      // Load Users
      const allUsers = JSON.parse(localStorage.getItem("stb-users") || "[]");
      setUsers(allUsers);

      // Calculate Stats - with safe values
      const paid = allBookings.filter((b) => b.status === "paid").length;
      const revenue = allBookings.reduce((sum, b) => sum + (b.total || 0), 0);
      const availableSeats = (tripData || []).reduce((sum, t) => sum + (t.availableSeats || 0), 0);

      setStats({
        totalTrips: (tripData || []).length || 0,
        totalAvailableSeats: availableSeats || 0,
        totalBookings: allBookings.length || 0,
        paidBookings: paid || 0,
        totalRevenue: revenue || 0,
        totalUsers: allUsers.length || 0,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate category wise stats
  const calculateCategoryStats = (tripData) => {
    const stats = {};
    TRANSPORT_TYPES.forEach(cat => {
      const tripsInCategory = tripData.filter(t => t.type === cat.id);
      stats[cat.id] = {
        ...cat,
        count: tripsInCategory.length,
        totalSeats: tripsInCategory.reduce((sum, t) => sum + (t.totalSeats || 0), 0),
        availableSeats: tripsInCategory.reduce((sum, t) => sum + (t.availableSeats || 0), 0),
        bookedSeats: tripsInCategory.reduce((sum, t) => sum + ((t.totalSeats || 0) - (t.availableSeats || 0)), 0),
      };
    });
    setCategoryStats(Object.values(stats));
  };

  // Reset seats for next day
  const resetSeatsForNextDay = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const updatedTrips = trips.map((trip) => ({
        ...trip,
        date: today,
        availableSeats: trip.totalSeats,
      }));
      setTrips(updatedTrips);
      localStorage.setItem("stb-trips", JSON.stringify(updatedTrips));
      
      // Recalculate stats
      const availableSeats = updatedTrips.reduce((sum, t) => sum + (t.availableSeats || 0), 0);
      setStats(prev => ({
        ...prev,
        totalAvailableSeats: availableSeats || 0,
      }));
      
      calculateCategoryStats(updatedTrips);
      
      alert(`Seats reset successfully! ${updatedTrips.length} trips updated.`);
    } catch (err) {
      console.error("Error resetting seats:", err);
      alert("Failed to reset seats. Please try again.");
    }
  };

  // Force reload all trips from TRIPS array
  const reloadAllTrips = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      if (TRIPS && TRIPS.length > 0) {
        const freshData = TRIPS.map((trip) => ({
          ...trip,
          date: trip.date || today,
          availableSeats: trip.totalSeats || 50,
          id: trip.id || "TRIP" + Date.now() + Math.random().toString(36).substr(2, 4),
        }));
        setTrips(freshData);
        localStorage.setItem("stb-trips", JSON.stringify(freshData));
        
        const availableSeats = freshData.reduce((sum, t) => sum + (t.availableSeats || 0), 0);
        setStats(prev => ({
          ...prev,
          totalTrips: freshData.length || 0,
          totalAvailableSeats: availableSeats || 0,
        }));
        
        calculateCategoryStats(freshData);
        
        alert(`Reloaded ${freshData.length} trips successfully!`);
      }
    } catch (err) {
      console.error("Error reloading trips:", err);
      alert("Failed to reload trips. Please refresh the page.");
    }
  };

  // Filter Data by category and search
  const filteredTrips = trips.filter(
    (t) => {
      const categoryMatch = selectedCategory === "all" || t.type === selectedCategory;
      const searchMatch = 
        t.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    }
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.passenger?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.to?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransportIcon = (type) => {
    return transportIcons[type] || <FaBus />;
  };

  const getCategoryColor = (type) => {
    return categoryColors[type] || "bg-gray-500";
  };

  const getStatusBadge = (status) => {
    if (status === "paid") {
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-400",
        icon: <FaCheckCircle className="text-green-500" />,
        label: "Paid",
      };
    }
    return {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-400",
      icon: <FaClock className="text-yellow-500" />,
      label: "Pending",
    };
  };

  const getSeatStatus = (available, total) => {
    if (!total || total === 0) return { color: "bg-gray-500", text: "No Seats", label: "N/A" };
    const ratio = available / total;
    if (ratio > 0.5) return { color: "bg-green-500", text: "Available", label: "Good" };
    if (ratio > 0.2) return { color: "bg-yellow-500", text: "Limited", label: "Few left" };
    return { color: "bg-red-500", text: "Almost Full", label: "Hurry!" };
  };

  // Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Seats") || name.includes("Price") || name === "pricePerSeat" 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const handleAddTrip = () => {
    setEditingTrip(null);
    setFormData({
      ...defaultTrip,
      date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setFormData(trip);
    setShowModal(true);
  };

  const handleSaveTrip = () => {
    if (!formData.from || !formData.to || !formData.operator || !formData.pricePerSeat) {
      alert("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        let updatedTrips;
        if (editingTrip) {
          updatedTrips = trips.map((t) =>
            t.id === editingTrip.id ? { ...formData, id: editingTrip.id } : t
          );
        } else {
          const newTrip = {
            ...formData,
            id: "TRIP" + Date.now(),
          };
          updatedTrips = [...trips, newTrip];
        }
        setTrips(updatedTrips);
        localStorage.setItem("stb-trips", JSON.stringify(updatedTrips));

        // Recalculate stats
        const availableSeats = updatedTrips.reduce((sum, t) => sum + (t.availableSeats || 0), 0);
        setStats(prev => ({
          ...prev,
          totalTrips: updatedTrips.length || 0,
          totalAvailableSeats: availableSeats || 0,
        }));
        
        calculateCategoryStats(updatedTrips);

        setShowModal(false);
      } catch (err) {
        console.error("Error saving trip:", err);
        alert("Failed to save trip. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  const handleDeleteTrip = (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const updated = trips.filter((t) => t.id !== id);
        setTrips(updated);
        localStorage.setItem("stb-trips", JSON.stringify(updated));
        
        const availableSeats = updated.reduce((sum, t) => sum + (t.availableSeats || 0), 0);
        setStats(prev => ({
          ...prev,
          totalTrips: updated.length || 0,
          totalAvailableSeats: availableSeats || 0,
        }));
        
        calculateCategoryStats(updated);
      } catch (err) {
        console.error("Error deleting trip:", err);
        alert("Failed to delete trip. Please try again.");
      }
    }
  };

  // Safe format price function
  const safeFormatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "৳ 0";
    }
    return formatPrice(amount);
  };

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <FaInfoCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="text-5xl text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading trips...</p>
        </div>
      </div>
    );
  }

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All";
    const cat = TRANSPORT_TYPES.find(t => t.id === selectedCategory);
    return cat ? `${cat.icon} ${cat.name}` : selectedCategory;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl text-white">
              <FaShieldAlt />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {trips.length} Trips • {TRANSPORT_TYPES.length} Categories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={reloadAllTrips}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              title="Reload all trips from data file"
            >
              <FaSync />
              Reload All Trips
            </button>
            <button
              onClick={resetSeatsForNextDay}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              title="Reset seats for next day"
            >
              <FaClockIcon />
              Reset Seats
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Category Stats Cards - Click to Filter */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <FaFilter className="inline mr-2" />
            Filter by Category:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <div
              onClick={() => setSelectedCategory("all")}
              className={`cursor-pointer rounded-xl p-4 text-center transition-all hover:scale-105 ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-2"
                  : "bg-white text-gray-700 hover:bg-indigo-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <FaThLarge className="text-2xl mx-auto mb-1" />
              <p className="text-xs font-semibold">All Categories</p>
              <p className="text-lg font-bold">{stats.totalTrips}</p>
            </div>
            {categoryStats.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer rounded-xl p-4 text-center transition-all hover:scale-105 ${
                  selectedCategory === cat.id
                    ? `${getCategoryColor(cat.id)} text-white shadow-lg ring-2 ring-offset-2`
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                style={selectedCategory === cat.id ? { ringColor: getCategoryColor(cat.id).replace("bg-", "") } : {}}
              >
                <span className="text-2xl block mb-1">{cat.icon}</span>
                <p className="text-xs font-semibold truncate">{cat.name}</p>
                <p className="text-lg font-bold">{cat.count}</p>
                {selectedCategory === cat.id && (
                  <span className="text-xs opacity-75">✓ Active</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Category Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filter:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {getSelectedCategoryName()}
          </span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <FaTimes className="inline" /> Clear
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Trips</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {filteredTrips.length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Available Seats</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {filteredTrips.reduce((sum, t) => sum + (t.availableSeats || 0), 0)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalBookings || 0}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.paidBookings || 0}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {safeFormatPrice(stats.totalRevenue)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Users</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.totalUsers || 0}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-4">
          <span>
            Showing <strong className="text-indigo-600">{filteredTrips.length}</strong> trips
            {selectedCategory !== "all" && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {TRANSPORT_TYPES.find(t => t.id === selectedCategory)?.icon} {TRANSPORT_TYPES.find(t => t.id === selectedCategory)?.name}
              </span>
            )}
          </span>
          <span>
            <FaClockIcon className="inline mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        {/* Tabs and Search */}
        <div className="rounded-2xl bg-white shadow-lg dark:bg-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setActiveTab("trips"); setSearchTerm(""); }}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "trips"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <MdAirplaneTicket />
                  Trips ({filteredTrips.length})
                </button>
                <button
                  onClick={() => { setActiveTab("bookings"); setSearchTerm(""); }}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "bookings"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <FaTicketAlt />
                  Bookings ({stats.totalBookings || 0})
                </button>
                <button
                  onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "users"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <FaUsers />
                  Users ({stats.totalUsers || 0})
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {activeTab === "trips" && (
                  <>
                    <button
                      onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      title={viewMode === "table" ? "Switch to Grid View" : "Switch to Table View"}
                    >
                      {viewMode === "table" ? <FaThLarge /> : <FaList />}
                    </button>
                    <button
                      onClick={handleAddTrip}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg"
                    >
                      <FaPlus />
                      Add Trip
                    </button>
                  </>
                )}

                <div className="relative flex-1 md:w-64">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder={`Search ${filteredTrips.length} trips...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trips Tab - Category Filtered */}
          {activeTab === "trips" && (
            <div className="p-6">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <MdAirplaneTicket className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No trips found in this category</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {selectedCategory !== "all" 
                        ? `No "${TRANSPORT_TYPES.find(t => t.id === selectedCategory)?.name}" trips available. Try selecting a different category.`
                        : "Try adjusting your search"}
                    </p>
                    {selectedCategory !== "all" && (
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        View All Categories
                      </button>
                    )}
                  </div>
                </div>
              ) : viewMode === "table" ? (
                /* Table View */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Trip ID</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Route</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Category</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Operator</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Time</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Price</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Seats</th>
                        <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips.map((trip) => {
                        const seatStatus = getSeatStatus(trip.availableSeats, trip.totalSeats);
                        const booked = (trip.totalSeats || 0) - (trip.availableSeats || 0);
                        const typeInfo = TRANSPORT_TYPES.find(t => t.id === trip.type);
                        const categoryColor = getCategoryColor(trip.type);
                        
                        return (
                          <tr
                            key={trip.id}
                            className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                              {trip.id}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getTransportIcon(trip.type)}</span>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {trip.from} → {trip.to}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {trip.class} • {trip.date}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white ${categoryColor}`}>
                                {typeInfo?.icon} {typeInfo?.name || trip.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">
                              {trip.operator}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">
                              <p>{trip.departure}</p>
                              <p className="text-xs text-gray-400">{trip.duration}</p>
                            </td>
                            <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                              {safeFormatPrice(trip.pricePerSeat)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-[80px]">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {trip.availableSeats}/{trip.totalSeats}
                                    </span>
                                    <span className="text-gray-500">{booked} booked</span>
                                  </div>
                                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      className={`h-1.5 rounded-full transition-all ${seatStatus.color}`}
                                      style={{ width: `${((trip.availableSeats || 0) / (trip.totalSeats || 1)) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditTrip(trip)}
                                  className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteTrip(trip.id)}
                                  className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTrips.map((trip) => {
                    const seatStatus = getSeatStatus(trip.availableSeats, trip.totalSeats);
                    const booked = (trip.totalSeats || 0) - (trip.availableSeats || 0);
                    const typeInfo = TRANSPORT_TYPES.find(t => t.id === trip.type);
                    const categoryColor = getCategoryColor(trip.type);
                    
                    return (
                      <div
                        key={trip.id}
                        className="rounded-xl bg-white p-4 shadow-md transition hover:shadow-xl dark:bg-gray-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTransportIcon(trip.type)}</span>
                            <div>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white ${categoryColor}`}>
                                {typeInfo?.name || trip.type}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {trip.from} → {trip.to}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditTrip(trip)}
                              className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400"
                              title="Edit"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="rounded-lg bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                              title="Delete"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600 dark:text-gray-300">{trip.operator}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {trip.departure} - {trip.arrival} • {trip.duration}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{trip.class} • {trip.date}</p>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {safeFormatPrice(trip.pricePerSeat)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{trip.availableSeats}/{trip.totalSeats}</span>
                            <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`h-1.5 rounded-full ${seatStatus.color}`}
                                style={{ width: `${((trip.availableSeats || 0) / (trip.totalSeats || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Booking ID</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Route</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Seats</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Fare</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FaTicketAlt className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No bookings found</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Bookings will appear here after users purchase tickets</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => {
                      const status = getStatusBadge(booking.status);
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition"
                        >
                          <td className="px-4 py-3 font-mono text-indigo-600 dark:text-indigo-400">
                            {booking.id}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {booking.passenger?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.passenger?.phone}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-900 dark:text-white">
                              {booking.from} → {booking.to}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.date}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {booking.seats?.join(", ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                            {safeFormatPrice(booking.total)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${status.bg} ${status.text}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => window.open(`/ticket/${booking.id}`, "_blank")}
                              className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                              title="View Ticket"
                            >
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Phone</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Joined</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300 text-center">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FaUsers className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Users will appear here after registration</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const userBookings = bookings.filter(
                        (b) => b.passenger?.id === user.id
                      );
                      return (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-lg text-white">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {user.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400 break-all">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {user.phone}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {user.joinedAt || "2026"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                              {userBookings.length}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={reloadAllTrips}
            className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl text-blue-600 transition group-hover:scale-110 dark:bg-blue-900/30 dark:text-blue-400">
              <FaSync />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Reload Trips</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">From data file</p>
          </button>
          <button
            onClick={resetSeatsForNextDay}
            className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl text-green-600 transition group-hover:scale-110 dark:bg-green-900/30 dark:text-green-400">
              <FaClockIcon />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Reset Seats</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Next day reset</p>
          </button>
          <button className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl text-purple-600 transition group-hover:scale-110 dark:bg-purple-900/30 dark:text-purple-400">
              <FaChartBar />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Analytics</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View reports</p>
          </button>
          <button className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl text-orange-600 transition group-hover:scale-110 dark:bg-orange-900/30 dark:text-orange-400">
              <FaDownload />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Export</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CSV Report</p>
          </button>
        </div>

        {/* Note */}
        <div className="mt-8 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="mt-0.5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-400">System Status</p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>{trips.length}</strong> trips loaded across <strong>{TRANSPORT_TYPES.length}</strong> categories.
                Click on any category card above to filter trips by type. Currently viewing: <strong>{getSelectedCategoryName()}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur animate-fade-in">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingTrip ? (
                  <span className="flex items-center gap-2"><FaEdit className="text-indigo-500" /> Edit Trip</span>
                ) : (
                  <span className="flex items-center gap-2"><FaPlus className="text-indigo-500" /> Add New Trip</span>
                )}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaMapMarkerAlt className="inline mr-1.5 text-indigo-500" />
                  From
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="from"
                  value={formData.from}
                  onChange={handleFormChange}
                  placeholder="e.g., Dhaka"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaMapMarkerAlt className="inline mr-1.5 text-purple-500" />
                  To
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="to"
                  value={formData.to}
                  onChange={handleFormChange}
                  placeholder="e.g., Chittagong"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaClockIcon className="inline mr-1.5 text-indigo-500" />
                  Departure Time
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="departure"
                  value={formData.departure}
                  onChange={handleFormChange}
                  placeholder="08:00 AM"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaClockIcon className="inline mr-1.5 text-purple-500" />
                  Arrival Time
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleFormChange}
                  placeholder="10:30 AM"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaClockIcon className="inline mr-1.5 text-indigo-500" />
                  Duration
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  placeholder="2h 30m"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaCalendarAlt className="inline mr-1.5 text-purple-500" />
                  Date
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaTag className="inline mr-1.5 text-indigo-500" />
                  Category
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  {TRANSPORT_TYPES && TRANSPORT_TYPES.length > 0 ? (
                    TRANSPORT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.icon} {t.name}
                      </option>
                    ))
                  ) : (
                    <option value="bus">🚌 Bus</option>
                  )}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaTag className="inline mr-1.5 text-purple-500" />
                  Operator
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="operator"
                  value={formData.operator}
                  onChange={handleFormChange}
                  placeholder="e.g., Biman Bangladesh"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaDollarSign className="inline mr-1.5 text-indigo-500" />
                  Price per Seat
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  type="number"
                  name="pricePerSeat"
                  value={formData.pricePerSeat}
                  onChange={handleFormChange}
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaChair className="inline mr-1.5 text-purple-500" />
                  Total Seats
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaChair className="inline mr-1.5 text-indigo-500" />
                  Available Seats
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaTag className="inline mr-1.5 text-purple-500" />
                  Class
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="class"
                  value={formData.class}
                  onChange={handleFormChange}
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                  <option>Standard</option>
                  <option>AC Business</option>
                  <option>AC Sleeper</option>
                  <option>Non-AC</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveTrip}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><FaSpinner className="animate-spin" /> Saving...</>
                ) : (
                  <><FaSave /> Save Trip</>
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}