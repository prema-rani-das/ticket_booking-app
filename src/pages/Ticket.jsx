// src/pages/Ticket.jsx
// ই-টিকিট পেজ — QR কোড, সব তথ্য এবং প্রিন্টেবল

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, TRANSPORT_TYPES } from "../data/transports";

export default function Ticket() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    try {
      const bookings = JSON.parse(localStorage.getItem("stb-bookings")) ?? [];
      const found = bookings.find((b) => b.id === bookingId);
      if (found) setBooking(found);
    } catch (e) {
      console.log("Error:", e);
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="card w-full max-w-md text-center">
          <p className="text-5xl">❌</p>
          <h2 className="section-title mt-3">টিকিট পাওয়া যায়নি</h2>
          <p className="text-muted mt-2">
            "{bookingId}" আইডির কোনো টিকিট খুঁজে পাওয়া যায়নি।
          </p>
          <Link to="/dashboard" className="btn-primary mt-5">
            ← ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const info = TRANSPORT_TYPES.find((t) => t.id === booking.type);
  // QR কোড ডাটা তৈরি করা
  const qrData = `ID:${booking.id}|FROM:${booking.from}|TO:${booking.to}|DATE:${booking.date}|SEATS:${booking.seats.join(",")}|TOTAL:${booking.total}`;
  // QR API দিয়ে ইমেজ জেনারেট করা
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* হেডার */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-4">
            ✅ বুকিং কনফার্মড
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">আপনার ই-টিকিট</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            আপনার বুকিং কনফার্ম হয়েছে। নিচে টিকিট ডাউনলোড বা প্রিন্ট করুন।
          </p>
        </div>

        {/* টিকিট কন্টেনার (প্রিন্টেবল) */}
        <div
          id="printable-ticket"
          className="rounded-3xl bg-white shadow-2xl overflow-hidden dark:bg-gray-800"
        >
          {/* সবুজ হেডার */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-10 py-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {info?.icon} {info?.name}
                </h2>
                <p className="mt-2 text-green-100 text-lg">{booking.operator}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">বুকিং আইডি</p>
                <p className="text-2xl font-bold text-white font-mono">{booking.id}</p>
              </div>
            </div>
          </div>

          {/* মূল কন্টেন্ট */}
          <div className="px-6 md:px-10 py-8">
            {/* রুট সেকশন */}
            <div className="mb-8">
              <div className="grid grid-cols-3 items-center gap-4">
                {/* যাত্রা */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">🚀 যাত্রা</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {booking.from}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 font-semibold">
                    🕐 {booking.departure}
                  </p>
                </div>

                {/* তীর */}
                <div className="text-center">
                  <div className="flex justify-center text-3xl text-green-600 mb-2">→</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                    {booking.duration}
                  </p>
                </div>

                {/* গন্তব্য */}
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">📍 গন্তব্য</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {booking.to}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 font-semibold">
                    🕐 {booking.arrival}
                  </p>
                </div>
              </div>
            </div>

            {/* লাইন */}
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-6" />

            {/* যাত্রী ও বুকিং ডিটেইলস */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">👤 যাত্রী</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {booking.passenger?.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">📅 তারিখ</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {booking.date}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">💺 সিট</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {booking.seats.join(", ")}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">✨ ক্লাস</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {booking.class}
                </p>
              </div>
            </div>

            {/* লাইন */}
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-6" />

            {/* QR কোড এবং ভাড়া */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              {/* QR কোড */}
              <div className="md:col-span-2 flex justify-center">
                <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={qrImageUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                  <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    QR কোড স্ক্যান করুন
                  </p>
                </div>
              </div>

              {/* ভাড়া ডিটেইলস */}
              <div className="md:col-span-3">
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">💰 ভাড়া বিবরণী</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>
                        {booking.seats.length} সিট × {formatPrice(booking.pricePerSeat)}
                      </span>
                      <span className="font-bold">{formatPrice(booking.total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400 text-xs">
                      <span>ট্যাক্স ও চার্জ</span>
                      <span>অন্তর্ভুক্ত</span>
                    </div>
                  </div>
                  <div className="h-px bg-green-200 dark:bg-green-700 my-4" />
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>মোট পরিশোধ</span>
                    <span className="text-green-600 dark:text-green-400 text-2xl">
                      {formatPrice(booking.total)}
                    </span>
                  </div>
                </div>

                {/* পেমেন্ট তথ্য */}
                <div className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-bold">পেমেন্ট মাধ্যম:</span> {booking.payment?.method}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-bold">ট্রানজেকশন আইডি:</span> {booking.payment?.trxId}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-bold">পেমেন্ট সময়:</span>{" "}
                    {new Date(booking.payment?.paidAt).toLocaleString("bn-BD")}
                  </p>
                </div>
              </div>
            </div>

            {/* লাইন */}
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-6" />

            {/* যাত্রী যোগাযোগ */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">📋 যাত্রী তথ্য</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">👤 নাম</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {booking.passenger?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">📧 ইমেইল</p>
                  <p className="font-bold text-gray-900 dark:text-white break-all">
                    {booking.passenger?.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">📱 ফোন</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {booking.passenger?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* ফুটার */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold">স্মার্ট টিকিট বুকিংয়ে আমাদের বেছে নেওয়ার জন্য ধন্যবাদ!</p>
              <p className="mt-1">কাউন্টারে উপস্থাপন করুন বা উপরের QR কোড স্ক্যান করুন।</p>
              <p className="mt-3 font-bold text-gray-700 dark:text-gray-300">
                সহায়তার জন্য: 01706730155
              </p>
            </div>
          </div>
        </div>

        {/* অ্যাকশন বাটন */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="btn-primary"
          >
            🖨️ টিকিট প্রিন্ট করুন
          </button>
          <Link to="/dashboard" className="btn-outline">
            ← ড্যাশবোর্ডে ফিরে যান
          </Link>
          <Link to="/home" className="btn-primary">
            🎫 আরেকটা টিকিট কাটুন
          </Link>
        </div>

        {/* টিপস */}
        <div className="mt-8 rounded-lg bg-amber-50 border-l-4 border-amber-500 p-4 dark:bg-amber-900/20">
          <p className="text-sm text-amber-900 dark:text-amber-400">
            <strong>💡 টিপস:</strong> এই ই-টিকিটটি সংরক্ষণ বা প্রিন্ট করুন। কাউন্টারে উপস্থাপন করার সময় এটি প্রয়োজন হবে।
          </p>
        </div>
      </div>

      {/* প্রিন্ট স্টাইল */}
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
            box-shadow: none;
          }
          @page {
            margin: 0;
            size: a4;
          }
        }
      `}</style>
    </div>
  );
}