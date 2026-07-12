// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  googleProvider,
  signInWithPopup,
} from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userObject = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || "User",
              email: firebaseUser.email,
              phone: userData.phone || "",
              isAdmin: userData.isAdmin || false,
              joinedAt: userData.joinedAt || new Date().toISOString().split("T")[0],
              lastPasswordChange: userData.lastPasswordChange || new Date().toISOString().split("T")[0],
            };
            setUser(userObject);
            setIsAdmin(userData.isAdmin || false);
          } else {
            const newUser = {
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email,
              phone: "",
              isAdmin: false,
              joinedAt: new Date().toISOString().split("T")[0],
              lastPasswordChange: new Date().toISOString().split("T")[0],
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newUser);
            setUser({
              id: firebaseUser.uid,
              ...newUser,
            });
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          setError(err.message);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register with Email & Password
  const register = async (formData) => {
    try {
      setError(null);
      
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        await updateProfile(userCredential.user, {
          displayName: formData.name,
        });
        
        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          isAdmin: false,
          joinedAt: new Date().toISOString().split("T")[0],
          lastPasswordChange: new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
        };
        
        await setDoc(doc(db, "users", userCredential.user.uid), userData);
        
        return { ok: true };
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          const loginResult = await login({
            email: formData.email,
            password: formData.password
          });
          if (loginResult.ok) {
            return { ok: true, message: "Already registered! Logged in successfully." };
          }
          return { ok: false, message: "Account exists but password is incorrect. Please login." };
        }
        throw err;
      }
    } catch (err) {
      console.error("Registration error:", err);
      let message = "Registration failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "Email already in use! Please login instead.";
      } else if (err.code === "auth/weak-password") {
        message = "Password must be at least 6 characters!";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format!";
      }
      return { ok: false, message };
    }
  };

  // Login with Email & Password
  const login = async (formData) => {
    try {
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      return { ok: true };
    } catch (err) {
      console.error("Login error:", err);
      let message = "Login failed. Please try again.";
      if (err.code === "auth/user-not-found") {
        message = "User not found! Please register first.";
      } else if (err.code === "auth/wrong-password") {
        message = "Invalid password! Please try again.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format!";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later.";
      }
      return { ok: false, message };
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        const userData = {
          name: userCredential.user.displayName || "User",
          email: userCredential.user.email,
          phone: "",
          isAdmin: false,
          joinedAt: new Date().toISOString().split("T")[0],
          lastPasswordChange: new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", userCredential.user.uid), userData);
      }
      
      return { ok: true };
    } catch (err) {
      console.error("Google login error:", err);
      let message = "Google login failed!";
      if (err.code === "auth/popup-closed-by-user") {
        message = "Login cancelled. Please try again.";
      } else if (err.code === "auth/account-exists-with-different-credential") {
        message = "An account already exists with the same email address.";
      }
      return { ok: false, message };
    }
  };

  // ✅ Admin Login - Fixed with email support
  const adminLogin = async (formData) => {
    try {
      setError(null);
      
      // Check if username is email format
      const isEmail = formData.username.includes('@') && formData.username.includes('.');
      
      // If email, try Firebase login
      if (isEmail) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.username,
            formData.password
          );
          
          const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
          
          if (userDoc.exists() && userDoc.data().isAdmin === true) {
            return { ok: true };
          } else {
            await signOut(auth);
            return { ok: false, message: "Access denied. Admin privileges required!" };
          }
        } catch (firebaseError) {
          console.error("Firebase admin login error:", firebaseError);
          // Fall through to static check
        }
      }
      
      // ✅ Static admin check (always available)
      if (formData.username === "admin" && formData.password === "admin123") {
        const adminData = {
          id: "admin",
          name: "Administrator",
          email: "admin@smartticket.com",
          isAdmin: true,
        };
        setUser(adminData);
        setIsAdmin(true);
        localStorage.setItem("stb-user", JSON.stringify(adminData));
        return { ok: true };
      }
      
      return { ok: false, message: "Invalid admin credentials!" };
    } catch (err) {
      console.error("Admin login error:", err);
      return { ok: false, message: "Invalid admin credentials!" };
    }
  };

  // Update Profile
  const updateProfileData = async (data) => {
    try {
      setError(null);
      
      if (!user) {
        return { ok: false, message: "No user logged in!" };
      }
      
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, data);
      
      setUser((prev) => ({
        ...prev,
        ...data,
      }));
      
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.name,
        });
      }
      
      return { ok: true };
    } catch (err) {
      console.error("Profile update error:", err);
      return { ok: false, message: "Failed to update profile!" };
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("stb-user");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    error,
    register,
    login,
    adminLogin,
    loginWithGoogle,
    updateProfile: updateProfileData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);