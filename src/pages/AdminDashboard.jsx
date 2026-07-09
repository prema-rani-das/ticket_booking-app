// src/pages/AdminDashboard.jsx
// Professional Admin Dashboard with Complete CRUD Operations

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice, TRANSPORT_TYPES } from "../data/transports";
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
};

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("trips");
  const [searchTerm, setSearchTerm] = useState("");
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState(defaultTrip);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalAvailableSeats: 0,
    totalBookings: 0,
    paidBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }

    setLoading(true);
    loadAllData();
    setLoading(false);
  }, [isAdmin, navigate]);

  const loadAllData = () => {
    // Load Trips
    try {
      const saved = localStorage.getItem("stb-trips");
      if (saved) {
        setTrips(JSON.parse(saved));
      } else {
        const defaultTrips = [
          {
            id: "TRIP001",
            from: "Dhaka",
            to: "Chittagong",
            departure: "08:00 AM",
            arrival: "10:30 AM",
            duration: "2h 30m",
            date: "2026-07-15",
            type: "airplane",
            operator: "Biman Bangladesh",
            pricePerSeat: 5000,
            totalSeats: 100,
            availableSeats: 45,
            class: "Economy",
          },
          {
            id: "TRIP002",
            from: "Dhaka",
            to: "Sylhet",
            departure: "10:00 AM",
            arrival: "12:15 PM",
            duration: "2h 15m",
            date: "2026-07-15",
            type: "train",
            operator: "Bengal Express",
            pricePerSeat: 800,
            totalSeats: 200,
            availableSeats: 120,
            class: "Standard",
          },
          {
            id: "TRIP003",
            from: "Dhaka",
            to: "Cox's Bazar",
            departure: "09:00 AM",
            arrival: "12:30 PM",
            duration: "3h 30m",
            date: "2026-07-16",
            type: "bus",
            operator: "Green Line",
            pricePerSeat: 1200,
            totalSeats: 40,
            availableSeats: 15,
            class: "AC Business",
          },
        ];
        setTrips(defaultTrips);
        localStorage.setItem("stb-trips", JSON.stringify(defaultTrips));
      }
    } catch (e) {
      console.log("Error loading trips:", e);
    }

    // Load Bookings
    try {
      const allBookings = JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
      setBookings(allBookings.reverse());
    } catch (e) {
      console.log("Error loading bookings:", e);
    }

    // Load Users
    try {
      const allUsers = JSON.parse(localStorage.getItem("stb-users")) ?? [];
      setUsers(allUsers);
    } catch (e) {
      console.log("Error loading users:", e);
    }

    // Calculate Stats
    calculateStats();
  };

  const calculateStats = () => {
    const allBookings = JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
    const allUsers = JSON.parse(localStorage.getItem("stb-users")) ?? [];
    const allTrips = JSON.parse(localStorage.getItem("stb-trips")) ?? [];

    const paid = allBookings.filter((b) => b.status === "paid").length;
    const revenue = allBookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const availableSeats = allTrips.reduce((sum, t) => sum + (t.availableSeats || 0), 0);

    setStats({
      totalTrips: allTrips.length,
      totalAvailableSeats: availableSeats,
      totalBookings: allBookings.length,
      paidBookings: paid,
      totalRevenue: revenue,
      totalUsers: allUsers.length,
    });
  };

  // Filter Data
  const filteredTrips = trips.filter(
    (t) =>
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.passenger?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransportIcon = (type) => {
    return transportIcons[type] || <FaBus />;
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
    const ratio = available / total;
    if (ratio > 0.5) return { color: "bg-green-500", text: "Available" };
    if (ratio > 0.2) return { color: "bg-yellow-500", text: "Limited" };
    return { color: "bg-red-500", text: "Almost Full" };
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
      if (editingTrip) {
        const updated = trips.map((t) =>
          t.id === editingTrip.id ? { ...formData, id: editingTrip.id } : t
        );
        setTrips(updated);
        localStorage.setItem("stb-trips", JSON.stringify(updated));
      } else {
        const newTrip = {
          ...formData,
          id: "TRIP" + Date.now(),
        };
        const updated = [...trips, newTrip];
        setTrips(updated);
        localStorage.setItem("stb-trips", JSON.stringify(updated));
      }

      calculateStats();
      setShowModal(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteTrip = (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      const updated = trips.filter((t) => t.id !== id);
      setTrips(updated);
      localStorage.setItem("stb-trips", JSON.stringify(updated));
      calculateStats();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="text-5xl text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                Smart Ticket Booking System Management
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Trips</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalTrips}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Available Seats</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalAvailableSeats}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalBookings}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.paidBookings}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Users</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.totalUsers}
            </p>
          </div>
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
                  Trips ({stats.totalTrips})
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
                  Bookings ({stats.totalBookings})
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
                  Users ({stats.totalUsers})
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {activeTab === "trips" && (
                  <button
                    onClick={handleAddTrip}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg"
                  >
                    <FaPlus />
                    Add Trip
                  </button>
                )}

                <div className="relative flex-1 md:w-64">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trips Tab */}
          {activeTab === "trips" && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Trip ID</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Route</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Operator</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Time</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Price</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Seats</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <MdAirplaneTicket className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No trips found</p>
                          <button
                            onClick={handleAddTrip}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                          >
                            <FaPlus />
                            Add your first trip
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip) => {
                      const seatStatus = getSeatStatus(trip.availableSeats, trip.totalSeats);
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
                                  {trip.class}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {trip.operator}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">
                            <p>{trip.departure}</p>
                            <p className="text-xs text-gray-400">{trip.duration}</p>
                          </td>
                          <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(trip.pricePerSeat)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {trip.availableSeats}/{trip.totalSeats}
                              </span>
                              <span className={`h-2 w-2 rounded-full ${seatStatus.color}`} />
                              <span className="text-xs text-gray-500">{seatStatus.text}</span>
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
                    })
                  )}
                </tbody>
              </table>
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
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Fare</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FaTicketAlt className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No bookings found</p>
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
                          <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(booking.total)}
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
                                {user.name.charAt(0).toUpperCase()}
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
          <button className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-2xl text-indigo-600 transition group-hover:scale-110 dark:bg-indigo-900/30 dark:text-indigo-400">
              <FaDownload />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Export Data</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CSV Report</p>
          </button>
          <button className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl text-purple-600 transition group-hover:scale-110 dark:bg-purple-900/30 dark:text-purple-400">
              <FaPrint />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Print Report</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Summary</p>
          </button>
          <button className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl text-green-600 transition group-hover:scale-110 dark:bg-green-900/30 dark:text-green-400">
              <FaChartLine />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Analytics</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View reports</p>
          </button>
          <button className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl text-orange-600 transition group-hover:scale-110 dark:bg-orange-900/30 dark:text-orange-400">
              <FaFilter />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Advanced Filter</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Refine results</p>
          </button>
        </div>

        {/* Note */}
        <div className="mt-8 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="mt-0.5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-400">Admin Note</p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                This dashboard displays all trips, bookings, and users in the system. You can add, edit, or delete trips.
                Additional features like reports, exports, and advanced analytics will be added in future updates.
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
                  <FaBus className="inline mr-1.5 text-indigo-500" />
                  Transport Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  {TRANSPORT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.name}
                    </option>
                  ))}
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