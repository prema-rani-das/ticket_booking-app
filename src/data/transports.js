// src/data/transports.js
// Comprehensive Transport Data - Global Flights, Bangladesh Bus & Train Routes

export const TRANSPORT_TYPES = [
  { id: "flight", name: "Flight", icon: "✈️", tagline: "Global & Domestic Air Travel" },
  { id: "helicopter", name: "Helicopter", icon: "🚁", tagline: "VIP Air Travel" },
  { id: "train", name: "Train", icon: "🚆", tagline: "Bangladesh Railway Network" },
  { id: "metro", name: "Metro Rail", icon: "🚇", tagline: "Dhaka Rapid Transit" },
  { id: "bus", name: "Bus", icon: "🚌", tagline: "Bangladesh & Kolkata Bus Routes" },
  { id: "launch", name: "Launch/Ship", icon: "🚢", tagline: "Waterways of Bangladesh" },
  { id: "speedboat", name: "Speedboat", icon: "🛥️", tagline: "Fast Water Transport" },
  { id: "cng", name: "CNG Auto", icon: "🛺", tagline: "Quick City Commute" },
  { id: "taxi", name: "Taxi/Cab", icon: "🚕", tagline: "Private City Travel" },
];

export const TRIPS = [
  // ==========================================
  // ========== GLOBAL FLIGHTS ==========
  // ==========================================
  
  // ----- Domestic Flights (Bangladesh) -----
  { id: "FL-101", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Chattogram", departure: "08:30", arrival: "09:25", duration: "55 min", price: 4500, class: "Economy", totalSeats: 40, popularity: 85 },
  { id: "FL-102", type: "flight", operator: "US-Bangla Airlines", from: "Dhaka", to: "Cox's Bazar", departure: "10:15", arrival: "11:20", duration: "1 hr 5 min", price: 5200, class: "Economy", totalSeats: 40, popularity: 90 },
  { id: "FL-103", type: "flight", operator: "Novoair", from: "Dhaka", to: "Sylhet", departure: "13:00", arrival: "13:50", duration: "50 min", price: 4200, class: "Economy", totalSeats: 40, popularity: 75 },
  { id: "FL-104", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Rajshahi", departure: "09:00", arrival: "10:00", duration: "1 hr", price: 3900, class: "Economy", totalSeats: 40, popularity: 70 },
  { id: "FL-105", type: "flight", operator: "US-Bangla Airlines", from: "Dhaka", to: "Barishal", departure: "11:45", arrival: "12:35", duration: "50 min", price: 3600, class: "Economy", totalSeats: 40, popularity: 55 },
  { id: "FL-106", type: "flight", operator: "Novoair", from: "Dhaka", to: "Jessore", departure: "14:30", arrival: "15:25", duration: "55 min", price: 4100, class: "Economy", totalSeats: 40, popularity: 60 },
  { id: "FL-107", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Saidpur", departure: "16:40", arrival: "17:35", duration: "55 min", price: 4800, class: "Business", totalSeats: 32, popularity: 65 },
  { id: "FL-108", type: "flight", operator: "US-Bangla Airlines", from: "Chattogram", to: "Cox's Bazar", departure: "07:00", arrival: "07:30", duration: "30 min", price: 2800, class: "Economy", totalSeats: 40, popularity: 80 },

  // ----- International Flights (Global) -----
  // South Asia
  { id: "FL-201", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Kolkata", departure: "09:30", arrival: "10:30", duration: "1 hr", price: 18500, class: "Economy", totalSeats: 40, popularity: 88 },
  { id: "FL-202", type: "flight", operator: "IndiGo", from: "Dhaka", to: "Delhi", departure: "12:00", arrival: "13:30", duration: "1 hr 30 min", price: 22000, class: "Economy", totalSeats: 40, popularity: 85 },
  { id: "FL-203", type: "flight", operator: "US-Bangla Airlines", from: "Dhaka", to: "Kolkata", departure: "16:30", arrival: "17:30", duration: "1 hr", price: 16500, class: "Economy", totalSeats: 40, popularity: 80 },
  { id: "FL-204", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Mumbai", departure: "14:00", arrival: "17:00", duration: "3 hr", price: 32000, class: "Economy", totalSeats: 40, popularity: 75 },
  { id: "FL-205", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Chennai", departure: "10:30", arrival: "12:30", duration: "2 hr", price: 28000, class: "Economy", totalSeats: 40, popularity: 70 },
  { id: "FL-206", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Kathmandu", departure: "08:00", arrival: "10:15", duration: "2 hr 15 min", price: 26000, class: "Economy", totalSeats: 40, popularity: 65 },
  { id: "FL-207", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Colombo", departure: "13:30", arrival: "16:00", duration: "2 hr 30 min", price: 35000, class: "Economy", totalSeats: 40, popularity: 60 },
  
  // Southeast Asia
  { id: "FL-301", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Singapore", departure: "23:00", arrival: "05:00", duration: "6 hr", price: 42000, class: "Business", totalSeats: 20, popularity: 95 },
  { id: "FL-302", type: "flight", operator: "Singapore Airlines", from: "Dhaka", to: "Singapore", departure: "01:30", arrival: "07:30", duration: "6 hr", price: 55000, class: "Economy", totalSeats: 40, popularity: 90 },
  { id: "FL-303", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Bangkok", departure: "11:00", arrival: "15:00", duration: "4 hr", price: 32000, class: "Economy", totalSeats: 40, popularity: 82 },
  { id: "FL-304", type: "flight", operator: "Thai Airways", from: "Dhaka", to: "Bangkok", departure: "14:30", arrival: "18:30", duration: "4 hr", price: 38000, class: "Economy", totalSeats: 40, popularity: 78 },
  { id: "FL-305", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Kuala Lumpur", departure: "09:00", arrival: "15:00", duration: "6 hr", price: 38000, class: "Economy", totalSeats: 40, popularity: 80 },
  { id: "FL-306", type: "flight", operator: "Malaysia Airlines", from: "Dhaka", to: "Kuala Lumpur", departure: "12:00", arrival: "18:00", duration: "6 hr", price: 42000, class: "Economy", totalSeats: 40, popularity: 75 },
  { id: "FL-307", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Jakarta", departure: "08:30", arrival: "14:30", duration: "6 hr", price: 45000, class: "Economy", totalSeats: 40, popularity: 60 },
  { id: "FL-308", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Ho Chi Minh", departure: "15:00", arrival: "19:30", duration: "4 hr 30 min", price: 36000, class: "Economy", totalSeats: 40, popularity: 55 },
  { id: "FL-309", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Manila", departure: "07:00", arrival: "12:30", duration: "5 hr 30 min", price: 40000, class: "Economy", totalSeats: 40, popularity: 50 },

  // Middle East
  { id: "FL-401", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Dubai", departure: "10:00", arrival: "13:30", duration: "3 hr 30 min", price: 48000, class: "Economy", totalSeats: 40, popularity: 92 },
  { id: "FL-402", type: "flight", operator: "Emirates", from: "Dhaka", to: "Dubai", departure: "19:30", arrival: "23:00", duration: "3 hr 30 min", price: 55000, class: "Economy", totalSeats: 40, popularity: 88 },
  { id: "FL-403", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Doha", departure: "08:30", arrival: "11:00", duration: "2 hr 30 min", price: 45000, class: "Economy", totalSeats: 40, popularity: 75 },
  { id: "FL-404", type: "flight", operator: "Qatar Airways", from: "Dhaka", to: "Doha", departure: "14:00", arrival: "16:30", duration: "2 hr 30 min", price: 52000, class: "Economy", totalSeats: 40, popularity: 70 },
  { id: "FL-405", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Riyadh", departure: "12:00", arrival: "15:30", duration: "3 hr 30 min", price: 50000, class: "Economy", totalSeats: 40, popularity: 85 },
  { id: "FL-406", type: "flight", operator: "Saudia", from: "Dhaka", to: "Riyadh", departure: "17:00", arrival: "20:30", duration: "3 hr 30 min", price: 56000, class: "Economy", totalSeats: 40, popularity: 80 },
  { id: "FL-407", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Kuwait", departure: "09:00", arrival: "12:00", duration: "3 hr", price: 48000, class: "Economy", totalSeats: 40, popularity: 70 },
  { id: "FL-408", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Muscat", departure: "11:30", arrival: "14:30", duration: "3 hr", price: 46000, class: "Economy", totalSeats: 40, popularity: 65 },
  { id: "FL-409", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Bahrain", departure: "07:30", arrival: "10:30", duration: "3 hr", price: 47000, class: "Economy", totalSeats: 40, popularity: 60 },

  // Europe
  { id: "FL-501", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "London", departure: "21:00", arrival: "04:00", duration: "7 hr", price: 85000, class: "Business", totalSeats: 20, popularity: 92 },
  { id: "FL-502", type: "flight", operator: "British Airways", from: "Dhaka", to: "London", departure: "23:30", arrival: "06:30", duration: "7 hr", price: 95000, class: "Economy", totalSeats: 40, popularity: 88 },
  { id: "FL-503", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Paris", departure: "19:00", arrival: "02:00", duration: "7 hr", price: 82000, class: "Economy", totalSeats: 40, popularity: 75 },
  { id: "FL-504", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Rome", departure: "08:00", arrival: "14:00", duration: "6 hr", price: 78000, class: "Economy", totalSeats: 40, popularity: 70 },
  { id: "FL-505", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Frankfurt", departure: "13:30", arrival: "20:00", duration: "6 hr 30 min", price: 80000, class: "Economy", totalSeats: 40, popularity: 68 },
  { id: "FL-506", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Amsterdam", departure: "15:00", arrival: "21:30", duration: "6 hr 30 min", price: 79000, class: "Economy", totalSeats: 40, popularity: 62 },

  // USA & Canada
  { id: "FL-601", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "New York", departure: "20:00", arrival: "06:00", duration: "10 hr", price: 120000, class: "Business", totalSeats: 20, popularity: 90 },
  { id: "FL-602", type: "flight", operator: "Delta Airlines", from: "Dhaka", to: "New York", departure: "22:30", arrival: "08:30", duration: "10 hr", price: 135000, class: "Economy", totalSeats: 40, popularity: 85 },
  { id: "FL-603", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Toronto", departure: "18:00", arrival: "05:00", duration: "11 hr", price: 115000, class: "Economy", totalSeats: 40, popularity: 80 },
  { id: "FL-604", type: "flight", operator: "Air Canada", from: "Dhaka", to: "Toronto", departure: "21:00", arrival: "08:00", duration: "11 hr", price: 130000, class: "Economy", totalSeats: 40, popularity: 75 },

  // Australia & Pacific
  { id: "FL-701", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Sydney", departure: "16:00", arrival: "09:00", duration: "17 hr", price: 110000, class: "Economy", totalSeats: 40, popularity: 78 },
  { id: "FL-702", type: "flight", operator: "Qantas", from: "Dhaka", to: "Sydney", departure: "20:00", arrival: "13:00", duration: "17 hr", price: 125000, class: "Economy", totalSeats: 40, popularity: 72 },

  // East Asia
  { id: "FL-801", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Tokyo", departure: "09:00", arrival: "16:00", duration: "7 hr", price: 72000, class: "Economy", totalSeats: 40, popularity: 78 },
  { id: "FL-802", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Seoul", departure: "12:00", arrival: "18:30", duration: "6 hr 30 min", price: 68000, class: "Economy", totalSeats: 40, popularity: 72 },
  { id: "FL-803", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Beijing", departure: "07:30", arrival: "13:30", duration: "6 hr", price: 62000, class: "Economy", totalSeats: 40, popularity: 68 },
  { id: "FL-804", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Shanghai", departure: "14:30", arrival: "20:30", duration: "6 hr", price: 64000, class: "Economy", totalSeats: 40, popularity: 65 },
  { id: "FL-805", type: "flight", operator: "Biman Bangladesh Airlines", from: "Dhaka", to: "Hong Kong", departure: "10:00", arrival: "14:30", duration: "4 hr 30 min", price: 55000, class: "Economy", totalSeats: 40, popularity: 82 },

  // ==========================================
  // ========== HELICOPTERS ==========
  // ==========================================
  { id: "HL-201", type: "helicopter", operator: "Square Air Limited", from: "Dhaka", to: "Cox's Bazar", departure: "09:00", arrival: "10:30", duration: "1 hr 30 min", price: 25000, class: "VIP", totalSeats: 6, popularity: 50 },
  { id: "HL-202", type: "helicopter", operator: "Meghna Aviation", from: "Dhaka", to: "Sundarbans", departure: "11:00", arrival: "12:15", duration: "1 hr 15 min", price: 22000, class: "VIP", totalSeats: 6, popularity: 45 },
  { id: "HL-203", type: "helicopter", operator: "Square Air Limited", from: "Dhaka", to: "Saint Martin", departure: "07:00", arrival: "09:30", duration: "2 hr 30 min", price: 35000, class: "VIP", totalSeats: 6, popularity: 40 },
  { id: "HL-204", type: "helicopter", operator: "Meghna Aviation", from: "Dhaka", to: "Sylhet", departure: "14:00", arrival: "15:15", duration: "1 hr 15 min", price: 24000, class: "VIP", totalSeats: 6, popularity: 35 },

  // ==========================================
  // ========== TRAINS - Bangladesh ==========
  // ==========================================
  
  // Dhaka to Major Cities
  { id: "TR-301", type: "train", operator: "Subarna Express", from: "Dhaka", to: "Chattogram", departure: "07:00", arrival: "12:10", duration: "5 hr 10 min", price: 725, class: "Snigdha", totalSeats: 60, popularity: 85 },
  { id: "TR-302", type: "train", operator: "Parabat Express", from: "Dhaka", to: "Sylhet", departure: "06:20", arrival: "13:00", duration: "6 hr 40 min", price: 680, class: "Shovon Chair", totalSeats: 60, popularity: 80 },
  { id: "TR-303", type: "train", operator: "Padma Express", from: "Dhaka", to: "Rajshahi", departure: "22:45", arrival: "04:25", duration: "5 hr 40 min", price: 650, class: "AC Chair", totalSeats: 60, popularity: 75 },
  { id: "TR-304", type: "train", operator: "Sundarban Express", from: "Dhaka", to: "Khulna", departure: "08:30", arrival: "14:00", duration: "5 hr 30 min", price: 620, class: "AC Chair", totalSeats: 60, popularity: 70 },
  { id: "TR-305", type: "train", operator: "Rangpur Express", from: "Dhaka", to: "Rangpur", departure: "07:30", arrival: "14:30", duration: "7 hr", price: 600, class: "Shovon", totalSeats: 65, popularity: 65 },
  { id: "TR-306", type: "train", operator: "Barisal Express", from: "Dhaka", to: "Barishal", departure: "06:00", arrival: "12:30", duration: "6 hr 30 min", price: 550, class: "Shovon", totalSeats: 65, popularity: 60 },
  { id: "TR-307", type: "train", operator: "Jamuna Express", from: "Dhaka", to: "Jamalpur", departure: "08:00", arrival: "14:00", duration: "6 hr", price: 480, class: "Shovon", totalSeats: 65, popularity: 55 },

  // Chattogram to Other Cities
  { id: "TR-308", type: "train", operator: "Paharika Express", from: "Chattogram", to: "Sylhet", departure: "06:30", arrival: "12:30", duration: "6 hr", price: 550, class: "Shovon", totalSeats: 65, popularity: 55 },
  { id: "TR-309", type: "train", operator: "Chattogram Express", from: "Chattogram", to: "Dhaka", departure: "21:00", arrival: "02:10", duration: "5 hr 10 min", price: 725, class: "Snigdha", totalSeats: 60, popularity: 75 },

  // Sylhet to Other Cities
  { id: "TR-310", type: "train", operator: "Surma Express", from: "Sylhet", to: "Dhaka", departure: "22:30", arrival: "05:10", duration: "6 hr 40 min", price: 680, class: "Shovon Chair", totalSeats: 60, popularity: 70 },

  // Rajshahi to Other Cities
  { id: "TR-311", type: "train", operator: "Silk City Express", from: "Rajshahi", to: "Dhaka", departure: "05:30", arrival: "11:10", duration: "5 hr 40 min", price: 650, class: "AC Chair", totalSeats: 60, popularity: 65 },

  // Khulna to Other Cities
  { id: "TR-312", type: "train", operator: "Rupsa Express", from: "Khulna", to: "Dhaka", departure: "15:00", arrival: "20:30", duration: "5 hr 30 min", price: 620, class: "AC Chair", totalSeats: 60, popularity: 60 },

  // ==========================================
  // ========== METRO RAIL - Dhaka ==========
  // ==========================================
  { id: "MT-401", type: "metro", operator: "Dhaka Metro Rail (MRT-6)", from: "Uttara North", to: "Motijheel", departure: "Every 10 min", arrival: "—", duration: "38 min", price: 100, class: "Standard", totalSeats: 48, popularity: 90 },
  { id: "MT-402", type: "metro", operator: "Dhaka Metro Rail (MRT-6)", from: "Agargaon", to: "Motijheel", departure: "Every 10 min", arrival: "—", duration: "20 min", price: 60, class: "Standard", totalSeats: 48, popularity: 85 },
  { id: "MT-403", type: "metro", operator: "Dhaka Metro Rail (MRT-6)", from: "Uttara North", to: "Agargaon", departure: "Every 10 min", arrival: "—", duration: "18 min", price: 50, class: "Standard", totalSeats: 48, popularity: 80 },
  { id: "MT-404", type: "metro", operator: "Dhaka Metro Rail (MRT-6)", from: "Motijheel", to: "Uttara North", departure: "Every 10 min", arrival: "—", duration: "38 min", price: 100, class: "Standard", totalSeats: 48, popularity: 88 },

  // ==========================================
  // ========== BUSES - Bangladesh & Kolkata ==========
  // ==========================================
  
  // Dhaka to Divisional Cities
  { id: "BS-501", type: "bus", operator: "Green Line Paribahan", from: "Dhaka", to: "Chattogram", departure: "08:00", arrival: "14:00", duration: "6 hr", price: 1250, class: "AC Business", totalSeats: 36, popularity: 85 },
  { id: "BS-502", type: "bus", operator: "Hanif Enterprise", from: "Dhaka", to: "Cox's Bazar", departure: "22:00", arrival: "07:30", duration: "9 hr 30 min", price: 1800, class: "AC Sleeper", totalSeats: 30, popularity: 90 },
  { id: "BS-503", type: "bus", operator: "Shyamoli Paribahan", from: "Dhaka", to: "Khulna", departure: "09:30", arrival: "15:30", duration: "6 hr", price: 900, class: "Non-AC", totalSeats: 40, popularity: 70 },
  { id: "BS-504", type: "bus", operator: "ENA Transport", from: "Dhaka", to: "Sylhet", departure: "07:15", arrival: "12:45", duration: "5 hr 30 min", price: 700, class: "AC Economy", totalSeats: 40, popularity: 75 },
  { id: "BS-505", type: "bus", operator: "Green Line Paribahan", from: "Dhaka", to: "Rajshahi", departure: "08:30", arrival: "14:30", duration: "6 hr", price: 850, class: "AC Economy", totalSeats: 40, popularity: 68 },
  { id: "BS-506", type: "bus", operator: "Hanif Enterprise", from: "Dhaka", to: "Barishal", departure: "07:00", arrival: "13:00", duration: "6 hr", price: 750, class: "AC", totalSeats: 40, popularity: 65 },
  { id: "BS-507", type: "bus", operator: "Shyamoli Paribahan", from: "Dhaka", to: "Rangpur", departure: "06:30", arrival: "14:30", duration: "8 hr", price: 800, class: "Non-AC", totalSeats: 40, popularity: 60 },
  { id: "BS-508", type: "bus", operator: "ENA Transport", from: "Dhaka", to: "Jessore", departure: "10:00", arrival: "15:30", duration: "5 hr 30 min", price: 650, class: "Non-AC", totalSeats: 40, popularity: 55 },

  // Dhaka to District Towns
  { id: "BS-509", type: "bus", operator: "Green Line Paribahan", from: "Dhaka", to: "Mymensingh", departure: "08:00", arrival: "11:00", duration: "3 hr", price: 450, class: "AC", totalSeats: 36, popularity: 50 },
  { id: "BS-510", type: "bus", operator: "Hanif Enterprise", from: "Dhaka", to: "Comilla", departure: "09:00", arrival: "12:30", duration: "3 hr 30 min", price: 400, class: "Non-AC", totalSeats: 40, popularity: 55 },
  { id: "BS-511", type: "bus", operator: "Shyamoli Paribahan", from: "Dhaka", to: "Tangail", departure: "07:30", arrival: "10:00", duration: "2 hr 30 min", price: 350, class: "Non-AC", totalSeats: 40, popularity: 45 },
  { id: "BS-512", type: "bus", operator: "ENA Transport", from: "Dhaka", to: "Narayanganj", departure: "06:00", arrival: "07:30", duration: "1 hr 30 min", price: 150, class: "Local", totalSeats: 50, popularity: 40 },

  // Chattogram to Other Cities
  { id: "BS-513", type: "bus", operator: "Green Line Paribahan", from: "Chattogram", to: "Cox's Bazar", departure: "07:00", arrival: "10:00", duration: "3 hr", price: 800, class: "AC", totalSeats: 36, popularity: 80 },
  { id: "BS-514", type: "bus", operator: "Hanif Enterprise", from: "Chattogram", to: "Dhaka", departure: "21:00", arrival: "03:00", duration: "6 hr", price: 1250, class: "AC Business", totalSeats: 36, popularity: 75 },

  // Sylhet to Other Cities
  { id: "BS-515", type: "bus", operator: "ENA Transport", from: "Sylhet", to: "Dhaka", departure: "07:00", arrival: "12:30", duration: "5 hr 30 min", price: 700, class: "AC Economy", totalSeats: 40, popularity: 70 },

  // Khulna to Other Cities
  { id: "BS-516", type: "bus", operator: "Shyamoli Paribahan", from: "Khulna", to: "Dhaka", departure: "08:00", arrival: "14:00", duration: "6 hr", price: 900, class: "Non-AC", totalSeats: 40, popularity: 65 },

  // International - Dhaka to Kolkata Bus
  { id: "BS-601", type: "bus", operator: "Shohagh Paribahan", from: "Dhaka", to: "Kolkata", departure: "07:00", arrival: "16:00", duration: "9 hr", price: 3000, class: "AC Executive", totalSeats: 30, popularity: 88 },
  { id: "BS-602", type: "bus", operator: "Green Line Paribahan", from: "Dhaka", to: "Kolkata", departure: "08:30", arrival: "17:30", duration: "9 hr", price: 3200, class: "AC Sleeper", totalSeats: 28, popularity: 85 },
  { id: "BS-603", type: "bus", operator: "Shyamoli Paribahan", from: "Dhaka", to: "Kolkata", departure: "09:00", arrival: "18:00", duration: "9 hr", price: 2800, class: "AC Economy", totalSeats: 32, popularity: 80 },

  // International - Dhaka to Agartala Bus
  { id: "BS-604", type: "bus", operator: "BRTC", from: "Dhaka", to: "Agartala", departure: "06:30", arrival: "14:30", duration: "8 hr", price: 2500, class: "AC", totalSeats: 30, popularity: 75 },

  // ==========================================
  // ========== LAUNCH/SHIP - Bangladesh ==========
  // ==========================================
  { id: "LN-601", type: "launch", operator: "MV Sundarban-16", from: "Dhaka (Sadarghat)", to: "Barishal", departure: "20:30", arrival: "05:00", duration: "8 hr 30 min", price: 1400, class: "Double Cabin", totalSeats: 50, popularity: 75 },
  { id: "LN-602", type: "launch", operator: "MV Parabat-12", from: "Dhaka (Sadarghat)", to: "Chandpur", departure: "07:45", arrival: "11:15", duration: "3 hr 30 min", price: 450, class: "Deck Chair", totalSeats: 80, popularity: 65 },
  { id: "LN-603", type: "launch", operator: "Karnaphuli Express", from: "Chattogram", to: "Sandwip", departure: "09:00", arrival: "11:30", duration: "2 hr 30 min", price: 380, class: "Standard", totalSeats: 70, popularity: 60 },
  { id: "LN-604", type: "launch", operator: "MV Meghna-7", from: "Dhaka (Sadarghat)", to: "Bhola", departure: "21:00", arrival: "06:30", duration: "9 hr 30 min", price: 1200, class: "Single Cabin", totalSeats: 40, popularity: 55 },
  { id: "LN-605", type: "launch", operator: "MV Karnaphuli-3", from: "Dhaka (Sadarghat)", to: "Patuakhali", departure: "19:30", arrival: "08:00", duration: "12 hr 30 min", price: 1100, class: "Deck", totalSeats: 90, popularity: 50 },
  { id: "LN-606", type: "launch", operator: "MV Sundarban-12", from: "Dhaka (Sadarghat)", to: "Khulna", departure: "18:00", arrival: "07:30", duration: "13 hr 30 min", price: 1500, class: "Double Cabin", totalSeats: 45, popularity: 70 },

  // ==========================================
  // ========== SPEEDBOATS ==========
  // ==========================================
  { id: "SB-701", type: "speedboat", operator: "Mawa Speedboat Service", from: "Mawa", to: "Majhikandi", departure: "Every 30 min", arrival: "—", duration: "20 min", price: 250, class: "Standard", totalSeats: 12, popularity: 80 },
  { id: "SB-702", type: "speedboat", operator: "Teknaf Water Taxi", from: "Teknaf", to: "Saint Martin", departure: "10:00", arrival: "10:45", duration: "45 min", price: 1500, class: "Premium", totalSeats: 10, popularity: 85 },
  { id: "SB-703", type: "speedboat", operator: "Mawa Speedboat Service", from: "Majhikandi", to: "Mawa", departure: "Every 30 min", arrival: "—", duration: "20 min", price: 250, class: "Standard", totalSeats: 12, popularity: 75 },
  { id: "SB-704", type: "speedboat", operator: "Cox's Bazar Water Taxi", from: "Cox's Bazar", to: "Saint Martin", departure: "08:00", arrival: "10:00", duration: "2 hr", price: 1200, class: "Standard", totalSeats: 15, popularity: 70 },

  // ==========================================
  // ========== CNG Auto ==========
  // ==========================================
  { id: "CG-801", type: "cng", operator: "City CNG Service", from: "Uttara", to: "Gulshan", departure: "On Demand", arrival: "—", duration: "30 min", price: 250, class: "Standard", totalSeats: 3, popularity: 75 },
  { id: "CG-802", type: "cng", operator: "City CNG Service", from: "Motijheel", to: "Mirpur", departure: "On Demand", arrival: "—", duration: "25 min", price: 200, class: "Standard", totalSeats: 3, popularity: 70 },
  { id: "CG-803", type: "cng", operator: "City CNG Service", from: "Dhanmondi", to: "Airport", departure: "On Demand", arrival: "—", duration: "30 min", price: 280, class: "Standard", totalSeats: 3, popularity: 65 },

  // ==========================================
  // ========== Taxi/Cab ==========
  // ==========================================
  { id: "TX-901", type: "taxi", operator: "UBER", from: "Dhaka (Anywhere)", to: "Anywhere in Dhaka", departure: "On Demand", arrival: "—", duration: "Varies", price: 500, class: "Standard", totalSeats: 4, popularity: 85 },
  { id: "TX-902", type: "taxi", operator: "Pathao", from: "Dhaka (Anywhere)", to: "Anywhere in Dhaka", departure: "On Demand", arrival: "—", duration: "Varies", price: 450, class: "Standard", totalSeats: 4, popularity: 90 },
  { id: "TX-903", type: "taxi", operator: "Obhai", from: "Dhaka (Anywhere)", to: "Anywhere in Dhaka", departure: "On Demand", arrival: "—", duration: "Varies", price: 480, class: "Standard", totalSeats: 4, popularity: 80 },
];

// Helper Functions
export const formatPrice = (amount) => `৳ ${amount.toLocaleString("en")}`;

export const getTripsByType = (typeId) => TRIPS.filter((t) => t.type === typeId);

export const getTripById = (tripId) => TRIPS.find((t) => t.id === tripId);

export const getTripsByRoute = (from, to) => {
  return TRIPS.filter((t) => 
    t.from.toLowerCase().includes(from.toLowerCase()) &&
    t.to.toLowerCase().includes(to.toLowerCase())
  );
};

export const getUniqueDestinations = () => {
  const destinations = new Set();
  TRIPS.forEach(t => {
    destinations.add(t.from);
    destinations.add(t.to);
  });
  return Array.from(destinations);
};

export const getTripsByOperator = (operator) => {
  return TRIPS.filter((t) => 
    t.operator.toLowerCase().includes(operator.toLowerCase())
  );
};