// src/pages/Booking.jsx
// Professional Booking Page with Animations - React Icons Version

import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TRANSPORT_TYPES,
  getTripById,
  formatPrice,
} from "../data/transports";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaChair,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaClock,
  FaTicketAlt,
  FaCreditCard,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaBus,
  FaPlane,
  FaTrain,
  FaShip,
  FaHelicopter,
  FaSubway,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";
import { MdConfirmationNumber, MdDashboard } from "react-icons/md";

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

const todayStr = () => new Date().toISOString().split("T")[0];

const getBookedSeats = (tripId, date) => {
  try {
    const bookings = JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
    return bookings
      .filter((b) => b.tripId === tripId && b.date === date && b.status === "paid")
      .flatMap((b) => b.seats);
  } catch {
    return [];
  }
};

export default function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const trip = getTripById(tripId);
  const [date, setDate] = useState(todayStr());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookedSeats = useMemo(
    () => (trip ? getBookedSeats(trip.id, date) : []),
    [trip, date]
  );

  const seats = useMemo(() => {
    if (!trip) return [];
    const rows = Math.ceil(trip.totalSeats / 4);
    const list = [];
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r);
      for (let c = 1; c <= 4; c++) {
        if (list.length < trip.totalSeats) list.push(`${rowLabel}${c}`);
      }
    }
    return list;
  }, [trip]);

  if (!trip) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800 animate-fade-in-up">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No trip found with ID "{tripId}"
          </p>
          <Link
            to="/home"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <FaArrowLeft />
            View All Trips
          </Link>
        </div>
      </div>
    );
  }

  const info = TRANSPORT_TYPES.find((t) => t.id === trip.type);
  const total = selectedSeats.length * trip.price;

  const toggleSeat = (seat) => {
    setError("");
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);
      if (prev.length >= 6) {
        setError("You can book a maximum of 6 seats at a time");
        return prev;
      }
      return [...prev, seat];
    });
  };

  const proceedToPayment = () => {
    if (!date) {
      setError("Please select a travel date");
      return;
    }
    if (date < todayStr()) {
      setError("Cannot book tickets for past dates");
      return;
    }
    if (selectedSeats.length === 0) {
      setError("Please select at least 1 seat");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const pendingBooking = {
        id: "BK-" + Date.now(),
        tripId: trip.id,
        type: trip.type,
        operator: trip.operator,
        from: trip.from,
        to: trip.to,
        departure: trip.departure,
        arrival: trip.arrival,
        duration: trip.duration,
        class: trip.class,
        date,
        seats: [...selectedSeats].sort(),
        pricePerSeat: trip.price,
        total,
        passenger: { id: user.id, name: user.name, email: user.email, phone: user.phone },
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("stb-pending-booking", JSON.stringify(pendingBooking));
      navigate("/payment");
    }, 600);
  };

  const seatClass = (seat) => {
    if (bookedSeats.includes(seat))
      return "cursor-not-allowed bg-gray-300 text-gray-500 line-through dark:bg-gray-700 dark:text-gray-500 hover:scale-100";
    if (selectedSeats.includes(seat))
      return "bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400 ring-offset-2 scale-105 shadow-lg";
    return "bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 border-2 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Back Button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <FaArrowLeft />
          Back to all trips
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-5">
          {/* ---------- Left: Trip Info + Date + Summary ---------- */}
          <div className="space-y-6 lg:col-span-2">
            {/* Trip Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 animate-fade-in-up">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {transportIcons[trip.type] || info?.icon}
                    {info?.name}
                  </span>
                  <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {trip.operator}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{trip.class}</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(trip.price)}
                  </p>
                </div>
              </div>

              {/* Route */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FaMapMarkerAlt className="text-indigo-500" />
                    From
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">{trip.from}</p>
                  <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="text-xs" />
                    {trip.departure}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-indigo-400">→</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {trip.duration}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FaLocationArrow className="text-purple-500" />
                    To
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">{trip.to}</p>
                  <p className="flex items-center justify-end gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="text-xs" />
                    {trip.arrival}
                  </p>
                </div>
              </div>

              {/* Trip ID */}
              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <FaInfoCircle />
                Trip ID: <span className="font-mono">{trip.id}</span>
              </div>
            </div>

            {/* Date Picker */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaCalendarAlt className="text-indigo-500" />
                Travel Date
              </label>
              <input
                type="date"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-400"
                min={todayStr()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSeats([]);
                }}
              />
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <MdConfirmationNumber className="text-indigo-500" />
                Booking Summary
              </h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Passenger</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    <FaUser className="inline mr-1 text-xs text-indigo-500" />
                    {user?.name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Seats</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedSeats.length > 0 ? [...selectedSeats].sort().join(", ") : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Seats</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedSeats.length}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                <span className="font-bold text-gray-900 dark:text-white">Total Fare</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(total)}
                </span>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={proceedToPayment}
                disabled={isSubmitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Proceed to Payment
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ---------- Right: Seat Selection ---------- */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <FaChair className="text-indigo-500" />
                Select Seats
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedSeats.length}/6 selected
              </span>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-700">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span className="inline-block h-4 w-4 rounded border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"></span>
                Available
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span className="inline-block h-4 w-4 rounded bg-gradient-to-r from-indigo-600 to-purple-600"></span>
                Selected
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span className="inline-block h-4 w-4 rounded bg-gray-300 dark:bg-gray-700"></span>
                Booked
              </div>
            </div>

            {/* Seat Grid */}
            <div className="mx-auto mt-6 max-w-sm">
              <div className="text-center mb-4">
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  🧑‍✈️ Front
                </span>
              </div>

              <div className="space-y-2">
                {Array.from({ length: Math.ceil(seats.length / 4) }).map((_, r) => (
                  <div key={r} className="flex justify-center gap-2">
                    {seats.slice(r * 4, r * 4 + 2).map((seat) => (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`h-10 w-12 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 ${seatClass(seat)}`}
                        disabled={bookedSeats.includes(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                    <span className="w-6" />
                    {seats.slice(r * 4 + 2, r * 4 + 4).map((seat) => (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`h-10 w-12 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 ${seatClass(seat)}`}
                        disabled={bookedSeats.includes(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-indigo-50 p-3 text-center text-xs text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
              <FaInfoCircle className="inline mr-1.5" />
              Click on a seat to select or deselect. Maximum 6 seats per booking.
            </div>

            {/* Selected Seats Display */}
            {selectedSeats.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
                {[...selectedSeats].sort().map((seat) => (
                  <span
                    key={seat}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  >
                    {seat}
                    <button
                      onClick={() => toggleSeat(seat)}
                      className="ml-1 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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