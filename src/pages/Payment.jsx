// src/pages/Payment.jsx
// Professional Payment Page with Real Icons from react-icons

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, TRANSPORT_TYPES } from "../data/transports";
import { FaCreditCard, FaWallet, FaMobileAlt, FaMoneyBillWave, FaArrowLeft, FaCopy, FaCheck, FaInfoCircle, FaLock, FaShieldAlt, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

// Payment Number
const PAYMENT_NUMBER = "01706730155";

const METHODS = [
  { id: "bkash", name: "bKash", icon: FaWallet, color: "border-pink-500", bg: "bg-pink-50", text: "text-pink-600", darkBg: "dark:bg-pink-900/20", darkText: "dark:text-pink-400", type: "wallet" },
  { id: "nagad", name: "Nagad", icon: FaMobileAlt, color: "border-orange-500", bg: "bg-orange-50", text: "text-orange-600", darkBg: "dark:bg-orange-900/20", darkText: "dark:text-orange-400", type: "wallet" },
  { id: "mobile", name: "Mobile Banking", icon: FaMobileAlt, color: "border-purple-500", bg: "bg-purple-50", text: "text-purple-600", darkBg: "dark:bg-purple-900/20", darkText: "dark:text-purple-400", type: "wallet" },
  { id: "card", name: "Card", icon: FaCreditCard, color: "border-blue-500", bg: "bg-blue-50", text: "text-blue-600", darkBg: "dark:bg-blue-900/20", darkText: "dark:text-blue-400", type: "card" },
];

const readPending = () => {
  try {
    return JSON.parse(localStorage.getItem("stb-pending-booking"));
  } catch {
    return null;
  }
};

export default function Payment() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState("bkash");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBooking(readPending());
  }, []);

  // Pending booking check
  if (!booking) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl dark:bg-gray-700">
            🛒
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">No Pending Booking</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please select a trip and book seats before proceeding to payment.
          </p>
          <Link
            to="/home"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <FaTicketAlt /> Find Tickets
          </Link>
        </div>
      </div>
    );
  }

  const info = TRANSPORT_TYPES.find((t) => t.id === booking.type);
  const selected = METHODS.find((m) => m.id === method);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // ---------- Payment Confirm ----------
  const confirmPayment = () => {
    setError("");

    if (selected.type === "wallet") {
      if (!senderNumber.trim() || !/^01[3-9]\d{8}$/.test(senderNumber.trim()))
        return setError("Please enter the 11-digit number you sent money from");
      if (trxId.trim().length < 8)
        return setError("Please enter a valid Transaction ID (at least 8 characters)");
    } else {
      const num = card.number.replace(/\s/g, "");
      if (!/^\d{16}$/.test(num)) return setError("Please enter a valid 16-digit card number");
      if (!card.name.trim()) return setError("Please enter the name on card");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry))
        return setError("Please enter expiry in MM/YY format (e.g., 08/27)");
      if (!/^\d{3,4}$/.test(card.cvv)) return setError("Please enter a valid CVV");
    }

    setProcessing(true);

    // Payment processing simulation
    setTimeout(() => {
      const paidBooking = {
        ...booking,
        status: "paid",
        payment: {
          method: selected.name,
          methodId: method,
          trxId: selected.type === "wallet" ? trxId.trim().toUpperCase() : "CARD-" + Date.now(),
          senderNumber: selected.type === "wallet" ? senderNumber.trim() : null,
          paidAt: new Date().toISOString(),
        },
      };

      const bookings = (() => {
        try {
          return JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
        } catch {
          return [];
        }
      })();
      bookings.push(paidBooking);
      localStorage.setItem("stb-bookings", JSON.stringify(bookings));
      localStorage.removeItem("stb-pending-booking");

      navigate(`/ticket/${paidBooking.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            <FaLock className="text-sm" /> Secure Payment
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Complete Your Payment
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Confirm your booking and get your e-ticket instantly
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* ---------- Left: Order Summary ---------- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                📋 Order Summary
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                {/* Transport */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-700">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl dark:bg-indigo-900/30">
                    {info?.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{booking.operator}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{info?.name}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-indigo-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{booking.from}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <FaClock className="text-[10px]" /> {booking.departure}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600" />
                  <span className="mx-2 text-xs text-gray-400">{booking.duration}</span>
                  <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600" />
                </div>

                <div className="flex items-start justify-end gap-3 text-right">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{booking.to}</p>
                    <p className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <FaClock className="text-[10px]" /> {booking.arrival}
                    </p>
                  </div>
                  <FaMapMarkerAlt className="mt-1 text-purple-500" />
                </div>

                {/* Details */}
                <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.date}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Seats</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.seats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Class</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.class}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:from-indigo-900/20 dark:to-purple-900/20">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(booking.total)}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{booking.seats.length} seats × {formatPrice(booking.pricePerSeat)}</span>
                  <span>incl. all taxes</span>
                </div>
              </div>

              {/* Back Link */}
              <Link
                to={`/booking/${booking.tripId}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                <FaArrowLeft /> Back to seat selection
              </Link>
            </div>

            {/* Passenger Info */}
            <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaUser className="text-indigo-500" /> Passenger Details
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Name:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{booking.passenger?.name}</span>
                <span className="font-medium">Email:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{booking.passenger?.email}</span>
                <span className="font-medium">Phone:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{booking.passenger?.phone}</span>
              </div>
            </div>
          </div>

          {/* ---------- Right: Payment Method ---------- */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <FaWallet /> Select Payment Method
              </h3>

              {/* Method Tabs */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {METHODS.map((m) => {
                  const IconComponent = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMethod(m.id);
                        setError("");
                      }}
                      className={`group rounded-xl border-2 p-3 text-center transition-all ${
                        method === m.id
                          ? `${m.color} ${m.bg} scale-105 shadow-lg ${m.darkBg}`
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className={`flex justify-center text-3xl group-hover:scale-110 transition-transform ${method === m.id ? 'scale-110' : ''} ${method === m.id ? m.text : 'text-gray-600 dark:text-gray-400'}`}>
                        <IconComponent />
                      </div>
                      <p className={`mt-1 text-xs font-bold ${method === m.id ? m.text : 'text-gray-600 dark:text-gray-400'}`}>
                        {m.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* ---------- Wallet Payment ---------- */}
              {selected.type === "wallet" && (
                <div className="mt-6">
                  <div className={`rounded-xl ${selected.bg} p-4 ${selected.darkBg}`}>
                    <p className={`flex items-center gap-2 text-sm font-bold ${selected.text} ${selected.darkText}`}>
                      <FaInfoCircle /> {selected.name} Payment Instructions:
                    </p>
                    <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        Send <b className={selected.text}>{formatPrice(booking.total)}</b> to the number below via <b>{selected.name}</b>
                      </li>
                      <li>Enter the <b>Transaction ID (TrxID)</b> you receive after payment</li>
                      <li>Click <b>"Confirm Payment"</b> — your ticket will be generated instantly!</li>
                    </ol>

                    {/* Number */}
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-900">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selected.name} Number</p>
                        <p className="font-mono text-lg font-bold tracking-wider text-indigo-700 dark:text-indigo-400">
                          {PAYMENT_NUMBER}
                        </p>
                      </div>
                      <button
                        onClick={copyNumber}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                      >
                        {copied ? (
                          <>
                            <FaCheck className="text-green-500" /> Copied
                          </>
                        ) : (
                          <>
                            <FaCopy /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaMobileAlt className="text-indigo-500" /> Sender Number
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        value={senderNumber}
                        onChange={(e) => {
                          setSenderNumber(e.target.value);
                          setError("");
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        📋 Transaction ID
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm uppercase text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder="e.g., 9HK7X2LM4P"
                        value={trxId}
                        onChange={(e) => {
                          setTrxId(e.target.value);
                          setError("");
                        }}
                      />
                    </div>
                  </div>

                  {/* Demo Info */}
                  <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-2 text-center text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    💡 Demo: Send {formatPrice(booking.total)} to {PAYMENT_NUMBER}, then enter any 8+ character TrxID
                  </div>
                </div>
              )}

              {/* ---------- Card Payment ---------- */}
              {selected.type === "card" && (
                <div className="mt-6">
                  <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                      <FaShieldAlt /> Secure Card Payment
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Your card information is encrypted and secure with 256-bit SSL
                    </p>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaCreditCard className="text-blue-500" /> Card Number
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={card.number}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCard({ ...card, number: v.replace(/(\d{4})(?=\d)/g, "$1 ") });
                          setError("");
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaUser className="text-blue-500" /> Name on Card
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm uppercase text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder="RAHIM UDDIN"
                        value={card.name}
                        onChange={(e) => {
                          setCard({ ...card, name: e.target.value });
                          setError("");
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <FaCalendarAlt className="text-blue-500" /> Expiry (MM/YY)
                        </label>
                        <input
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                          placeholder="08/27"
                          maxLength={5}
                          value={card.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                            setCard({ ...card, expiry: v });
                            setError("");
                          }}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <FaLock className="text-blue-500" /> CVV
                        </label>
                        <input
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={card.cvv}
                          onChange={(e) => {
                            setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") });
                            setError("");
                          }}
                        />
                      </div>
                    </div>

                    {/* Card Brands */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      ✅ We accept Visa, Mastercard, American Express
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  <FaExclamationTriangle /> <span>{error}</span>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={confirmPayment}
                disabled={processing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <FaLock /> Confirm Payment — {formatPrice(booking.total)}
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                🔐 Your information is secure. You'll receive your e-ticket with QR code instantly.
              </p>

              {/* Security Badges */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <FaLock className="text-green-500" /> 256-bit SSL
                </span>
                <span className="flex items-center gap-1">
                  <FaShieldAlt className="text-green-500" /> PCI Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}