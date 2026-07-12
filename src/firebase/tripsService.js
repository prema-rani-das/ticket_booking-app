// src/firebase/tripsService.js
import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "./config";

const TRIPS_COLLECTION = "trips";

// Add a new trip
export const addTrip = async (tripData) => {
  try {
    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      ...tripData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ok: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding trip:", error);
    return { ok: false, message: error.message };
  }
};

// Get all trips
export const getTrips = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TRIPS_COLLECTION));
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    return { ok: true, data: trips };
  } catch (error) {
    console.error("Error getting trips:", error);
    return { ok: false, message: error.message };
  }
};

// Get trips by type
export const getTripsByType = async (type) => {
  try {
    const q = query(
      collection(db, TRIPS_COLLECTION),
      where("type", "==", type),
      orderBy("departure", "asc")
    );
    const querySnapshot = await getDocs(q);
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    return { ok: true, data: trips };
  } catch (error) {
    console.error("Error getting trips by type:", error);
    return { ok: false, message: error.message };
  }
};

// Get trip by ID
export const getTripById = async (tripId) => {
  try {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ok: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { ok: false, message: "Trip not found" };
    }
  } catch (error) {
    console.error("Error getting trip:", error);
    return { ok: false, message: error.message };
  }
};

// Update trip
export const updateTrip = async (tripId, tripData) => {
  try {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(docRef, {
      ...tripData,
      updatedAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (error) {
    console.error("Error updating trip:", error);
    return { ok: false, message: error.message };
  }
};

// Delete trip
export const deleteTrip = async (tripId) => {
  try {
    await deleteDoc(doc(db, TRIPS_COLLECTION, tripId));
    return { ok: true };
  } catch (error) {
    console.error("Error deleting trip:", error);
    return { ok: false, message: error.message };
  }
};

// Real-time listener for trips
export const listenTrips = (callback) => {
  return onSnapshot(collection(db, TRIPS_COLLECTION), (snapshot) => {
    const trips = [];
    snapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    callback(trips);
  });
};