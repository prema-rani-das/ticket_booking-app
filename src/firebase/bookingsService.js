// src/firebase/bookingsService.js
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
} from "./config";

const BOOKINGS_COLLECTION = "bookings";

// Add a new booking
export const addBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ok: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding booking:", error);
    return { ok: false, message: error.message };
  }
};

// Get all bookings for a user
export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("passenger.id", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return { ok: true, data: bookings };
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return { ok: false, message: error.message };
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async () => {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return { ok: true, data: bookings };
  } catch (error) {
    console.error("Error getting all bookings:", error);
    return { ok: false, message: error.message };
  }
};

// Get a single booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ok: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { ok: false, message: "Booking not found" };
    }
  } catch (error) {
    console.error("Error getting booking:", error);
    return { ok: false, message: error.message };
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { ok: false, message: error.message };
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
    return { ok: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { ok: false, message: error.message };
  }
};

// Real-time listener for user bookings
export const listenUserBookings = (userId, callback) => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("passenger.id", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const bookings = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    callback(bookings);
  });
};

// Real-time listener for all bookings (Admin)
export const listenAllBookings = (callback) => {
  const q = query(collection(db, BOOKINGS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const bookings = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    callback(bookings);
  });
};