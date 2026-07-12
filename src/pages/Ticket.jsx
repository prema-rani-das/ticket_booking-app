// src/pages/Ticket.jsx
// Complete Working Ticket Page with Firebase Auto ID

import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, TRANSPORT_TYPES } from "../data/transports";
import { getBookingById } from "../firebase/bookingsService";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaPrint,
  FaQrcode,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
  FaInfoCircle,
  FaLightbulb,
  FaPlane,
  FaTrain,
  FaBus,
  FaShip,
  FaShieldAlt,
  FaTimes,
  FaCopy,
  FaSpinner,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

// Transport Icons Mapping
const transportIcons = {
  airplane: <FaPlane />,
  train: <FaTrain />,
  bus: <FaBus />,
  launch: <FaShip />,
  helicopter: <FaPlane />,
  metro: <FaTrain />,
  speedboat: <FaShip />,
};

export default function Ticket() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const loadTicket = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("🔍 Searching for booking ID:", bookingId);
        
        // 🔥 STEP 1: Check localStorage FIRST (fastest)
        const allBookings = JSON.parse(localStorage.getItem("stb-bookings") || "[]");
        console.log("📦 Total bookings in localStorage:", allBookings.length);
        
        let found = allBookings.find(b => b.id === bookingId);
        
        // 🔥 STEP 2: If found in localStorage, use it
        if (found) {
          console.log("✅ Found in localStorage:", found);
          setBooking(found);
          checkExpiry(found);
          setLoading(false);
          return;
        }
        
        // 🔥 STEP 3: If not in localStorage, try Firebase
        console.log("🔄 Not in localStorage, checking Firebase...");
        try {
          const result = await getBookingById(bookingId);
          console.log("📡 Firebase result:", result);
          
          if (result && result.ok && result.data) {
            console.log("✅ Found in Firebase:", result.data);
            setBooking(result.data);
            checkExpiry(result.data);
            
            // Also save to localStorage for next time
            const updatedBookings = JSON.parse(localStorage.getItem("stb-bookings") || "[]");
            // Check if already exists
            const exists = updatedBookings.some(b => b.id === bookingId);
            if (!exists) {
              updatedBookings.push(result.data);
              localStorage.setItem("stb-bookings", JSON.stringify(updatedBookings));
              console.log("💾 Saved to localStorage for future");
            }
            
            setLoading(false);
            return;
          }
        } catch (firebaseError) {
          console.error("Firebase error:", firebaseError);
        }
        
        // 🔥 STEP 4: Try pending booking
        const pending = JSON.parse(localStorage.getItem("stb-pending-booking") || "null");
        if (pending && pending.id === bookingId) {
          console.log("✅ Found in pending:", pending);
          setBooking(pending);
          checkExpiry(pending);
          setLoading(false);
          return;
        }
        
        // 🔥 STEP 5: Not found anywhere
        console.log("❌ Booking not found anywhere:", bookingId);
        setError(`Ticket not found with ID: ${bookingId}`);
        
      } catch (err) {
        console.error("Error loading ticket:", err);
        setError("Failed to load ticket. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadTicket();
    } else {
      setError("No booking ID provided");
      setLoading(false);
    }
  }, [bookingId]);

  const checkExpiry = (ticketData) => {
    if (!ticketData || !ticketData.date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ticketDate = new Date(ticketData.date);
    ticketDate.setHours(0, 0, 0, 0);

    const diffTime = ticketDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysRemaining(diffDays);
    setIsExpired(diffDays < 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(booking?.id || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const getStatusDisplay = () => {
    if (isExpired) {
      return {
        icon: <FaTimesCircle className="text-red-500 text-xl" />,
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        border: "border-red-500",
        label: "Expired",
        message: "This ticket has expired."
      };
    } else if (daysRemaining <= 1 && daysRemaining >= 0) {
      return {
        icon: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        border: "border-yellow-500",
        label: "Expiring Soon",
        message: `⚠️ Expires in ${daysRemaining} day!`
      };
    } else if (daysRemaining > 1) {
      return {
        icon: <FaCheckCircle className="text-green-500 text-xl" />,
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        border: "border-green-500",
        label: "Active",
        message: `${daysRemaining} days remaining`
      };
    }
    return {
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      border: "border-green-500",
      label: "Active",
      message: "Valid ticket"
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="text-5xl text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800 animate-fade-in-up">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl dark:bg-red-900/30">
            <FaTimes className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Ticket Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {error || `No ticket found with ID "${bookingId}"`}
          </p>
          <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            <p>💡 Tip: Make sure you're using the correct booking ID</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-xs">/ticket/BK-DEMO-001</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FaTicketAlt />
              Book New Ticket
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const info = TRANSPORT_TYPES.find((t) => t.id === booking.type);
  const qrData = `ID:${booking.id}|FROM:${booking.from}|TO:${booking.to}|DATE:${booking.date}|SEATS:${booking.seats?.join(",")}|TOTAL:${booking.total}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  const status = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${status.color}`}>
            {status.icon}
            {status.label}
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Your E-Ticket
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {status.message}
          </p>
        </div>

        {/* Ticket Container */}
        <div
          ref={ticketRef}
          id="printable-ticket"
          className={`rounded-2xl bg-white shadow-2xl overflow-hidden dark:bg-gray-800 animate-fade-in-up ${
            isExpired ? 'opacity-75' : ''
          }`}
        >
          {/* Header */}
          <div className={`px-6 md:px-10 py-8 ${
            isExpired 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
              : daysRemaining <= 1 && daysRemaining >= 0
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-3xl text-white">
                  {transportIcons[booking.type] || info?.icon || <FaTicketAlt />}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {info?.name || "Transport"}
                  </h2>
                  <p className="text-white/80">{booking.operator}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs font-medium">Booking ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl md:text-2xl font-bold text-white font-mono">
                    {booking.id}
                  </p>
                  <button
                    onClick={handleCopyId}
                    className="rounded-lg bg-white/20 p-1.5 text-white transition hover:bg-white/30"
                    title="Copy ID"
                  >
                    {copied ? <FaCheckCircle className="text-green-300" /> : <FaCopy />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 md:px-10 py-8">
            {/* Route */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-xs text-gray-500 uppercase">From</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{booking.from}</p>
                  <p className="text-sm text-gray-500">{booking.departure}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-indigo-400">→</div>
                  <p className="text-xs text-gray-500">{booking.duration}</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs text-gray-500 uppercase">To</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{booking.to}</p>
                  <p className="text-sm text-gray-500">{booking.arrival}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div>
                <p className="text-xs text-gray-500 uppercase">Passenger</p>
                <p className="font-bold text-gray-900 dark:text-white">{booking.passenger?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className={`font-bold ${isExpired ? 'text-red-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                  {booking.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Seats</p>
                <p className="font-bold text-gray-900 dark:text-white">{booking.seats?.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Class</p>
                <p className="font-bold text-gray-900 dark:text-white">{booking.class}</p>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* QR & Fare */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center mt-6">
              <div className="md:col-span-2 flex justify-center">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
                  <img src={qrImageUrl} alt="QR Code" className="w-48 h-48" />
                  <p className="mt-2 text-center text-xs text-gray-500">Scan QR Code</p>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                  <div className="flex justify-between text-sm">
                    <span>{booking.seats?.length} seats × {formatPrice(booking.pricePerSeat)}</span>
                    <span className="font-bold">{formatPrice(booking.total)}</span>
                  </div>
                  <div className="h-px bg-indigo-200 my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-xl text-indigo-600">{formatPrice(booking.total)}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Payment: {booking.payment?.method}</p>
                  <p>TrxID: {booking.payment?.trxId}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
              <p>Thank you for choosing Smart Ticket Booking!</p>
              <p className="mt-1">📞 Support: 01706730155</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button onClick={handlePrint} className="btn-primary">
            <FaPrint /> Print Ticket
          </button>
          <Link to="/dashboard" className="btn-outline">
            <MdDashboard /> Dashboard
          </Link>
          <Link to="/home" className="btn-outline">
            <FaTicketAlt /> Book Another
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}