// src/pages/Ticket.jsx
// Professional E-Ticket Page with React Icons - All Logic Preserved

import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, TRANSPORT_TYPES } from "../data/transports";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaPrint,
  FaDownload,
  FaShare,
  FaQrcode,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
  FaCreditCard,
  FaInfoCircle,
  FaLightbulb,
  FaPlane,
  FaTrain,
  FaBus,
  FaShip,
  FaHelicopter,
  FaSubway,
  FaShieldAlt,
  FaTimes,
  FaCopy,
} from "react-icons/fa";
import { MdConfirmationNumber, MdPayment, MdDashboard } from "react-icons/md";

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

export default function Ticket() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    try {
      const bookings = JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
      const found = bookings.find((b) => b.id === bookingId);
      if (found) setBooking(found);
    } catch (e) {
      console.log("Error:", e);
    }
  }, [bookingId]);

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

  if (!booking) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800 animate-fade-in-up">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl dark:bg-red-900/30">
            <FaTimes className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Ticket Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No ticket found with ID "{bookingId}"
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const info = TRANSPORT_TYPES.find((t) => t.id === booking.type);
  const qrData = `ID:${booking.id}|FROM:${booking.from}|TO:${booking.to}|DATE:${booking.date}|SEATS:${booking.seats.join(",")}|TOTAL:${booking.total}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* ---------- Header ---------- */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <FaCheckCircle />
            Booking Confirmed
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Your E-Ticket
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your booking is confirmed. Download or print your ticket below.
          </p>
        </div>

        {/* ---------- Ticket Container (Printable) ---------- */}
        <div
          ref={ticketRef}
          id="printable-ticket"
          className="rounded-2xl bg-white shadow-2xl overflow-hidden dark:bg-gray-800 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Colored Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-10 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-3xl text-white">
                  {transportIcons[booking.type] || info?.icon}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {info?.name}
                  </h2>
                  <p className="text-indigo-100">{booking.operator}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-indigo-200 text-xs font-medium">Booking ID</p>
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

          {/* Main Content */}
          <div className="px-6 md:px-10 py-8">
            {/* Route Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                {/* From */}
                <div className="text-center md:text-left">
                  <p className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    <FaMapMarkerAlt className="text-indigo-500" />
                    Departure
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {booking.from}
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <FaClock className="text-gray-400" />
                    {booking.departure}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-3 text-2xl text-indigo-400">
                    <span>●</span>
                    <FaArrowRight />
                    <span>●</span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                    {booking.duration}
                  </p>
                </div>

                {/* To */}
                <div className="text-center md:text-right">
                  <p className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    <FaMapMarkerAlt className="text-purple-500" />
                    Arrival
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {booking.to}
                  </p>
                  <p className="flex items-center justify-center md:justify-end gap-1.5 text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <FaClock className="text-gray-400" />
                    {booking.arrival}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Booking Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  <FaUser className="text-indigo-500" />
                  Passenger
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {booking.passenger?.name}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  <FaCalendarAlt className="text-indigo-500" />
                  Date
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {booking.date}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  <FaTicketAlt className="text-indigo-500" />
                  Seats
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {booking.seats.join(", ")}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  <FaShieldAlt className="text-indigo-500" />
                  Class
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {booking.class}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* QR Code & Fare */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center mt-6">
              {/* QR Code */}
              <div className="md:col-span-2 flex justify-center">
                <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={qrImageUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50' y='100' font-size='16' fill='%236b7280' text-anchor='middle'%3EQR Code%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <p className="mt-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    <FaQrcode className="inline mr-1" />
                    Scan QR Code
                  </p>
                </div>
              </div>

              {/* Fare Details */}
              <div className="md:col-span-3">
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700">
                  <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                    <FaMoneyBillWave className="text-indigo-500" />
                    Fare Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>
                        {booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''} × {formatPrice(booking.pricePerSeat)}
                      </span>
                      <span className="font-bold">{formatPrice(booking.total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs">
                      <span>Tax & Charges</span>
                      <span>Included</span>
                    </div>
                  </div>
                  <div className="h-px bg-indigo-200 dark:bg-indigo-700 my-4" />
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total Paid</span>
                    <span className="text-2xl text-indigo-600 dark:text-indigo-400">
                      {formatPrice(booking.total)}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Payment Method:</span>
                      <span className="ml-1 text-gray-900 dark:text-white font-semibold">
                        {booking.payment?.method}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Transaction ID:</span>
                      <span className="ml-1 font-mono text-gray-900 dark:text-white">
                        {booking.payment?.trxId}
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Payment Time:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {new Date(booking.payment?.paidAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-6" />

            {/* Passenger Contact */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3 text-sm">
                <FaUser className="text-indigo-500" />
                Passenger Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {booking.passenger?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <FaEnvelope className="inline mr-1" /> Email
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white break-all">
                    {booking.passenger?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <FaPhone className="inline mr-1" /> Phone
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {booking.passenger?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Thank you for choosing Smart Ticket Booking!
              </p>
              <p className="mt-1">Please present this ticket at the counter or scan the QR code above.</p>
              <p className="mt-3 font-bold text-indigo-600 dark:text-indigo-400">
                📞 For support: 01706730155
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Action Buttons ---------- */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
          >
            <FaPrint />
            Print Ticket
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
          >
            <MdDashboard />
            Dashboard
          </Link>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 shadow-md transition hover:shadow-lg hover:scale-105 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
          >
            <FaTicketAlt />
            Book Another
          </Link>
        </div>

        {/* ---------- Tip ---------- */}
        <div className="mt-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4 dark:border-amber-400 dark:bg-amber-900/20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-start gap-3">
            <FaLightbulb className="mt-0.5 text-xl text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-400">Quick Tip</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Save or print this e-ticket. You'll need it for verification at the counter or boarding.
                You can also show the QR code on your phone for scanning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ticket,
          #printable-ticket * {
            visibility: visible;
          }
          #printable-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          #printable-ticket .bg-gradient-to-r {
            background: #4f46e5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-ticket .bg-gray-50 {
            background: #f9fafb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-ticket .bg-gradient-to-br {
            background: #eef2ff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-ticket img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            margin: 0.5cm;
            size: A4 portrait;
          }
        }
      `}</style>

      {/* Animations CSS */}
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