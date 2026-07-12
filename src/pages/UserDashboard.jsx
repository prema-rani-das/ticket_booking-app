// src/pages/UserDashboard.jsx
// Updated with Firebase Auto ID

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice, TRANSPORT_TYPES } from "../data/transports";
import { getUserBookings, listenUserBookings } from "../firebase/bookingsService";
import {
  FaUser,
  FaTicketAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaSearch,
  FaPlus,
  FaBus,
  FaPlane,
  FaTrain,
  FaShip,
  FaHelicopter,
  FaSubway,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaInfoCircle,
  FaLightbulb,
  FaChartLine,
  FaWallet,
  FaReceipt,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import { MdDashboard, MdConfirmationNumber, MdPayment } from "react-icons/md";

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

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    spent: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Load bookings from Firebase
    const loadBookings = async () => {
      try {
        const result = await getUserBookings(user.id);
        if (result.ok) {
          setBookings(result.data);
          
          // Calculate stats
          const paid = result.data.filter((b) => b.status === "paid").length;
          const pending = result.data.filter((b) => b.status === "pending").length;
          const spent = result.data.reduce((sum, b) => sum + (b.total || 0), 0);
          setStats({
            total: result.data.length,
            paid,
            pending,
            spent,
          });
        }
      } catch (e) {
        console.log("Error loading bookings:", e);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const allBookings = JSON.parse(localStorage.getItem("stb-bookings") ?? "[]");
        const userBookings = allBookings.filter((b) => b.passenger?.id === user?.id);
        setBookings(userBookings.reverse());
        
        const paid = userBookings.filter((b) => b.status === "paid").length;
        const pending = userBookings.filter((b) => b.status === "pending").length;
        const spent = userBookings.reduce((sum, b) => sum + (b.total || 0), 0);
        setStats({
          total: userBookings.length,
          paid,
          pending,
          spent,
        });
      } catch (e) {
        console.log("Error:", e);
      }
    };

    loadBookings();

    // Real-time listener for Firebase
    const unsubscribe = listenUserBookings(user.id, (updatedBookings) => {
      setBookings(updatedBookings);
      const paid = updatedBookings.filter((b) => b.status === "paid").length;
      const pending = updatedBookings.filter((b) => b.status === "pending").length;
      const spent = updatedBookings.reduce((sum, b) => sum + (b.total || 0), 0);
      setStats({
        total: updatedBookings.length,
        paid,
        pending,
        spent,
      });
    });

    return () => unsubscribe();
  }, [user]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.operator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransportIcon = (type) => {
    return transportIcons[type] || <FaBus />;
  };

  const getStatusColor = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  const getStatusText = (status) => {
    return status === "paid" ? "Confirmed" : "Pending";
  };

  const getStatusIcon = (status) => {
    return status === "paid" ? <FaCheckCircle className="text-green-500" /> : <FaClock className="text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl text-white">
                  <FaUser />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Welcome Back, {user?.name?.split(" ")[0]}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here's an overview of your bookings and trips
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
            >
              <FaPlus />
              Book New Ticket
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl dark:bg-gray-800 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-2xl text-blue-600 transition group-hover:scale-110 dark:bg-blue-900/30 dark:text-blue-400">
                <MdConfirmationNumber />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaChartLine className="text-blue-500" />
              <span>All your trips in one place</span>
            </div>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl dark:bg-gray-800 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmed</p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">{stats.paid}</p>
              </div>
              <div className="rounded-xl bg-green-100 p-3 text-2xl text-green-600 transition group-hover:scale-110 dark:bg-green-900/30 dark:text-green-400">
                <FaCheckCircle />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaCheckCircle className="text-green-500" />
              <span>Successfully completed</span>
            </div>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl dark:bg-gray-800 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              </div>
              <div className="rounded-xl bg-yellow-100 p-3 text-2xl text-yellow-600 transition group-hover:scale-110 dark:bg-yellow-900/30 dark:text-yellow-400">
                <FaClock />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaClock className="text-yellow-500" />
              <span>Awaiting confirmation</span>
            </div>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl dark:bg-gray-800 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(stats.spent)}</p>
              </div>
              <div className="rounded-xl bg-indigo-100 p-3 text-2xl text-indigo-600 transition group-hover:scale-110 dark:bg-indigo-900/30 dark:text-indigo-400">
                <FaMoneyBillWave />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaWallet className="text-indigo-500" />
              <span>Total spent on all trips</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FaSearch className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by route, destination, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Bookings List */}
        <div className="rounded-2xl bg-white shadow-lg dark:bg-gray-800 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-4xl dark:bg-indigo-900/30">
                <FaTicketAlt className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                No Bookings Found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {searchTerm ? "No results match your search." : "You haven't booked any trips yet."}
              </p>
              <Link
                to="/home"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
              >
                <FaPlus />
                Book Your First Ticket
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Trip Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date & Seats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Fare
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-xl text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {getTransportIcon(booking.type)}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {booking.from} <FaArrowRight className="inline text-xs text-gray-400" /> {booking.to}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.operator} • {booking.class}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              ID: <span className="font-mono">{booking.id}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">{booking.date}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <FaTicketAlt className="text-gray-400" />
                          <span>Seats: {booking.seats?.join(", ")}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {formatPrice(booking.total)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.seats?.length} seats × {formatPrice(booking.pricePerSeat)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {getStatusText(booking.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {booking.status === "paid" ? (
                          <Link
                            to={`/ticket/${booking.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg"
                          >
                            <FaTicketAlt />
                            View Ticket
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Awaiting payment
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Link
            to="/home"
            className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-2xl text-indigo-600 transition group-hover:scale-110 dark:bg-indigo-900/30 dark:text-indigo-400">
              <FaTicketAlt />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Book Ticket</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">New trip</p>
          </Link>

          <Link
            to="/profile"
            className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl text-purple-600 transition group-hover:scale-110 dark:bg-purple-900/30 dark:text-purple-400">
              <FaUser />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Profile</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manage account</p>
          </Link>

          <Link
            to="/home"
            className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl text-green-600 transition group-hover:scale-110 dark:bg-green-900/30 dark:text-green-400">
              <FaReceipt />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">My Tickets</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View all</p>
          </Link>

          <button
            onClick={() => window.print()}
            className="group rounded-xl bg-white p-4 text-center shadow-md transition hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl text-orange-600 transition group-hover:scale-110 dark:bg-orange-900/30 dark:text-orange-400">
              <FaPrint />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Print</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This page</p>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-4 dark:border-indigo-400 dark:bg-indigo-900/20 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <div className="flex items-start gap-3">
            <FaLightbulb className="mt-0.5 text-xl text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="font-semibold text-indigo-900 dark:text-indigo-400">Quick Tip</p>
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                All your bookings are securely stored in the cloud. You can view or download your e-tickets anytime from your dashboard.
                Always carry your e-ticket (digital or printed) during travel.
              </p>
            </div>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}