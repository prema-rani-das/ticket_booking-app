// src/data/transports.js
// সব যানবাহনের ডেমো ডাটা — পরে ডাটাবেস যোগ করলে এখান থেকে সরিয়ে API দিয়ে আনা হবে

export const TRANSPORT_TYPES = [
  { id: "flight",     name: "বিমান",       icon: "✈️", tagline: "আকাশপথে দ্রুততম যাত্রা" },
  { id: "helicopter", name: "হেলিকপ্টার",  icon: "🚁", tagline: "ভিআইপি আকাশভ্রমণ" },
  { id: "train",      name: "ট্রেন",       icon: "🚆", tagline: "আরামদায়ক রেলযাত্রা" },
  { id: "metro",      name: "মেট্রোরেল",   icon: "🚇", tagline: "ঢাকার দ্রুত নগর পরিবহন" },
  { id: "bus",        name: "বাস",         icon: "🚌", tagline: "সাশ্রয়ী সড়কপথ" },
  { id: "launch",     name: "লঞ্চ/জাহাজ",  icon: "🚢", tagline: "নদীপথে আয়েশি ভ্রমণ" },
  { id: "speedboat",  name: "স্পিডবোট",    icon: "🛥️", tagline: "পানিপথে ঝড়ের গতি" },
];

export const TRIPS = [
  // ---------- বিমান ----------
  { id: "FL-101", type: "flight", operator: "বিমান বাংলাদেশ এয়ারলাইন্স", from: "ঢাকা", to: "চট্টগ্রাম", departure: "08:30", arrival: "09:25", duration: "৫৫ মিনিট", price: 4500, class: "ইকোনমি", totalSeats: 40 },
  { id: "FL-102", type: "flight", operator: "ইউএস-বাংলা এয়ারলাইন্স", from: "ঢাকা", to: "কক্সবাজার", departure: "10:15", arrival: "11:20", duration: "১ ঘণ্টা ৫ মিনিট", price: 5200, class: "ইকোনমি", totalSeats: 40 },
  { id: "FL-103", type: "flight", operator: "নভোএয়ার", from: "ঢাকা", to: "সিলেট", departure: "13:00", arrival: "13:50", duration: "৫০ মিনিট", price: 4200, class: "ইকোনমি", totalSeats: 40 },
  { id: "FL-104", type: "flight", operator: "ইউএস-বাংলা এয়ারলাইন্স", from: "ঢাকা", to: "সৈয়দপুর", departure: "16:40", arrival: "17:35", duration: "৫৫ মিনিট", price: 4800, class: "বিজনেস", totalSeats: 32 },

  // ---------- হেলিকপ্টার ----------
  { id: "HL-201", type: "helicopter", operator: "স্কয়ার এয়ার লিমিটেড", from: "ঢাকা", to: "কক্সবাজার", departure: "09:00", arrival: "10:30", duration: "১ ঘণ্টা ৩০ মিনিট", price: 25000, class: "ভিআইপি", totalSeats: 6 },
  { id: "HL-202", type: "helicopter", operator: "মেঘনা এভিয়েশন", from: "ঢাকা", to: "সুন্দরবন", departure: "11:00", arrival: "12:15", duration: "১ ঘণ্টা ১৫ মিনিট", price: 22000, class: "ভিআইপি", totalSeats: 6 },

  // ---------- ট্রেন ----------
  { id: "TR-301", type: "train", operator: "সুবর্ণ এক্সপ্রেস", from: "ঢাকা", to: "চট্টগ্রাম", departure: "07:00", arrival: "12:10", duration: "৫ ঘণ্টা ১০ মিনিট", price: 725, class: "স্নিগ্ধা", totalSeats: 60 },
  { id: "TR-302", type: "train", operator: "পদ্মা এক্সপ্রেস", from: "ঢাকা", to: "রাজশাহী", departure: "22:45", arrival: "04:25", duration: "৫ ঘণ্টা ৪০ মিনিট", price: 650, class: "এসি চেয়ার", totalSeats: 60 },
  { id: "TR-303", type: "train", operator: "পারাবত এক্সপ্রেস", from: "ঢাকা", to: "সিলেট", departure: "06:20", arrival: "13:00", duration: "৬ ঘণ্টা ৪০ মিনিট", price: 680, class: "শোভন চেয়ার", totalSeats: 60 },

  // ---------- মেট্রোরেল ----------
  { id: "MT-401", type: "metro", operator: "ঢাকা মেট্রোরেল (MRT-6)", from: "উত্তরা উত্তর", to: "মতিঝিল", departure: "প্রতি ১০ মিনিটে", arrival: "—", duration: "৩৮ মিনিট", price: 100, class: "স্ট্যান্ডার্ড", totalSeats: 48 },
  { id: "MT-402", type: "metro", operator: "ঢাকা মেট্রোরেল (MRT-6)", from: "আগারগাঁও", to: "মতিঝিল", departure: "প্রতি ১০ মিনিটে", arrival: "—", duration: "২০ মিনিট", price: 60, class: "স্ট্যান্ডার্ড", totalSeats: 48 },

  // ---------- বাস ----------
  { id: "BS-501", type: "bus", operator: "গ্রীন লাইন পরিবহন", from: "ঢাকা", to: "চট্টগ্রাম", departure: "08:00", arrival: "14:00", duration: "৬ ঘণ্টা", price: 1250, class: "এসি বিজনেস", totalSeats: 36 },
  { id: "BS-502", type: "bus", operator: "হানিফ এন্টারপ্রাইজ", from: "ঢাকা", to: "কক্সবাজার", departure: "22:00", arrival: "07:30", duration: "৯ ঘণ্টা ৩০ মিনিট", price: 1800, class: "এসি স্লিপার", totalSeats: 30 },
  { id: "BS-503", type: "bus", operator: "শ্যামলী পরিবহন", from: "ঢাকা", to: "খুলনা", departure: "09:30", arrival: "15:30", duration: "৬ ঘণ্টা", price: 900, class: "নন-এসি", totalSeats: 40 },
  { id: "BS-504", type: "bus", operator: "এনা ট্রান্সপোর্ট", from: "ঢাকা", to: "সিলেট", departure: "07:15", arrival: "12:45", duration: "৫ ঘণ্টা ৩০ মিনিট", price: 700, class: "এসি ইকোনমি", totalSeats: 40 },

  // ---------- লঞ্চ/জাহাজ ----------
  { id: "LN-601", type: "launch", operator: "এমভি সুন্দরবন-১৬", from: "ঢাকা (সদরঘাট)", to: "বরিশাল", departure: "20:30", arrival: "05:00", duration: "৮ ঘণ্টা ৩০ মিনিট", price: 1400, class: "ডাবল কেবিন", totalSeats: 50 },
  { id: "LN-602", type: "launch", operator: "এমভি পারাবত-১২", from: "ঢাকা (সদরঘাট)", to: "চাঁদপুর", departure: "07:45", arrival: "11:15", duration: "৩ ঘণ্টা ৩০ মিনিট", price: 450, class: "ডেক চেয়ার", totalSeats: 80 },
  { id: "LN-603", type: "launch", operator: "কর্ণফুলী এক্সপ্রেস", from: "চট্টগ্রাম", to: "সন্দ্বীপ", departure: "09:00", arrival: "11:30", duration: "২ ঘণ্টা ৩০ মিনিট", price: 380, class: "স্ট্যান্ডার্ড", totalSeats: 70 },

  // ---------- স্পিডবোট ----------
  { id: "SB-701", type: "speedboat", operator: "মাওয়া স্পিডবোট সার্ভিস", from: "মাওয়া", to: "মাঝিকান্দি", departure: "প্রতি ৩০ মিনিটে", arrival: "—", duration: "২০ মিনিট", price: 250, class: "স্ট্যান্ডার্ড", totalSeats: 12 },
  { id: "SB-702", type: "speedboat", operator: "টেকনাফ ওয়াটার ট্যাক্সি", from: "টেকনাফ", to: "সেন্টমার্টিন", departure: "10:00", arrival: "10:45", duration: "৪৫ মিনিট", price: 1500, class: "প্রিমিয়াম", totalSeats: 10 },
];

// টাকা ফরম্যাট করার হেল্পার
export const formatPrice = (amount) => `৳ ${amount.toLocaleString("bn-BD")}`;

// টাইপ অনুযায়ী ট্রিপ খোঁজা
export const getTripsByType = (typeId) => TRIPS.filter((t) => t.type === typeId);

// আইডি দিয়ে একটা ট্রিপ খোঁজা
export const getTripById = (tripId) => TRIPS.find((t) => t.id === tripId);