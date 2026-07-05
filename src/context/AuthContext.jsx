// src/context/AuthContext.jsx
// ইউজার রেজিস্ট্রেশন/লগইন + স্ট্যাটিক অ্যাডমিন লগইন — আপাতত localStorage এ,
// পরে ব্যাকএন্ড যোগ করলে শুধু এই ফাইলের ফাংশনগুলো API কল দিয়ে বদলালেই হবে

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// স্ট্যাটিক অ্যাডমিন
const ADMIN = { username: "admin", password: "admin123" };

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON("stb-current-user", null));
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("stb-admin") === "true"
  );

  useEffect(() => {
    if (user) localStorage.setItem("stb-current-user", JSON.stringify(user));
    else localStorage.removeItem("stb-current-user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("stb-admin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  // ---------- রেজিস্ট্রেশন ----------
  const register = ({ name, email, phone, password }) => {
    const users = readJSON("stb-users", []);
    if (users.some((u) => u.email === email)) {
      return { ok: false, message: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে!" };
    }
    const newUser = {
      id: "U-" + Date.now(),
      name,
      email,
      phone,
      password,
      joinedAt: new Date().toLocaleDateString("bn-BD"),
    };
    users.push(newUser);
    localStorage.setItem("stb-users", JSON.stringify(users));
    setUser(newUser);
    return { ok: true };
  };

  // ---------- ইউজার লগইন ----------
  const login = ({ email, password }) => {
    const users = readJSON("stb-users", []);
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      return { ok: false, message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়!" };
    }
    setUser(found);
    return { ok: true };
  };

  // ---------- অ্যাডমিন লগইন (স্ট্যাটিক) ----------
  const adminLogin = ({ username, password }) => {
    if (username === ADMIN.username && password === ADMIN.password) {
      setIsAdmin(true);
      return { ok: true };
    }
    return { ok: false, message: "অ্যাডমিন ইউজারনেম বা পাসওয়ার্ড ভুল!" };
  };

  // ---------- লগআউট ----------
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  // ---------- প্রোফাইল আপডেট ----------
  const updateProfile = (updates) => {
    const users = readJSON("stb-users", []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return { ok: false, message: "ইউজার পাওয়া যায়নি!" };
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem("stb-users", JSON.stringify(users));
    setUser(users[idx]);
    return { ok: true };
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, register, login, adminLogin, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে");
  return ctx;
}