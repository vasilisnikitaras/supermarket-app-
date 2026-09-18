"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "./Footer"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<"en" | "el" | "fr">("en");
  const [open, setOpen] = useState(false); 
  const [darkMode, setDarkMode] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. Ανίχνευση Γλώσσας, Θέματος και Έλεγχος Ασφάλειας (Auth Guard)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 🔒 AUTH GUARD: Έλεγχος αν υπάρχει συνδεδεμένος χρήστης
      const role = localStorage.getItem("userRole");
      
      // Αν είμαστε στη σελίδα login, επιτρέπουμε την πρόσβαση χωρίς redirect
      if (window.location.pathname === "/login") {
        setLoading(false);
        return;
      }

      // Αν δεν υπάρχει ρόλος, κλειδώνουμε την εφαρμογή και πετάμε τον χρήστη στο Login
      if (!role) {
        window.location.href = "/login";
        return;
      }

      setUserRole(role);

      // Ανίχνευση γλώσσας
      const lang = navigator.language;
      if (lang.startsWith("el")) setLocale("el");
      else if (lang.startsWith("fr")) setLocale("fr");
      else setLocale("en");

      // Ανίχνευση αποθηκευμένου Dark Mode
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.remove("dark");
      }
      setLoading(false);
    }
  }, []);

  // 2. Λειτουργία αλλαγής θέματος (Toggle)
  const toggleDarkMode = () => {
    if (darkMode) {
      localStorage.setItem("theme", "light");
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  // 🚪 Λειτουργία Logout που καθαρίζει το Session και σε κλειδώνει έξω
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const labels = {
    en: {
      dashboard: "Dashboard",
      products: "Products",
      suppliers: "Suppliers",
      offers: "Offers",
      orders: "Orders",
      users: "Users",
      settings: "Settings",
      logout: "Logout",
      lightMode: "☀️ Light Mode",
      darkMode: "🌙 Dark Mode"
    },
    el: {
      dashboard: "Πίνακας",
      products: "Προϊόντα",
      suppliers: "Προμηθευτές",
      offers: "Προσφορές",
      orders: "Παραγγελίες",
      users: "Χρήστες",
      settings: "Ρυθμίσεις",
      logout: "Αποσύνδεση",
      lightMode: "☀️ Φωτεινό",
      darkMode: "🌙 Σκοτεινό"
    },
    fr: {
      dashboard: "Tableau",
      products: "Produits",
      suppliers: "Fournisseurs",
      offers: "Offres",
      orders: "Commandes",
      users: "Utilisateurs",
      settings: "Paramètres",
      logout: "Déconnexion",
      lightMode: "☀️ Mode Clair",
      darkMode: "🌙 Mode Sombre"
    },
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">Loading App...</div>;
  }

  // Αν είμαστε στη σελίδα login, επιστρέφουμε σκέτο το περιεχόμενο χωρίς τη sidebar
  if (typeof window !== "undefined" && window.location.pathname === "/login") {
    return <>{children}</>;
  }

  const t = labels[locale];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row relative transition-colors duration-200 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
    }`}>
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full border-r w-64 p-4 z-50 transition-all duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-screen md:sticky ${
          darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-black"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t.dashboard}</h2>
          <button 
            className="md:hidden text-xl p-1"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <Link href="/" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
            {t.dashboard}
          </Link>
          <Link href="/products" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
            {t.products}
          </Link>
          <Link href="/suppliers" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
            {t.suppliers}
          </Link>
          <Link href="/offers" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
            {t.offers}
          </Link>
          <Link href="/orders" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
            {t.orders}
          </Link>
          
          {/* 👥 ΕΛΕΓΧΟΣ: Μόνο ο Admin βλέπει το κουμπί Users στο μενού */}
          {userRole === "ADMIN" && (
            <Link href="/users" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
              {t.users}
            </Link>
          )}

          <Link href="/settings" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"}`}>
            {t.settings}
          </Link>

          <button
            onClick={toggleDarkMode}
            className={`mt-4 p-2 text-left rounded font-medium border text-sm transition-all ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-yellow-400 hover:bg-gray-600" 
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {darkMode ? t.lightMode : t.darkMode}
          </button>

          {/* 👑 ΔΙΟΡΘΩΘΗΚΕ: Το κουμπί καλεί πλέον τηhandleLogout για σωστή αποσύνδεση */}
          <button 
            onClick={handleLogout}
            className="mt-2 p-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors text-center font-semibold text-base"
          >
            {t.logout}
          </button>
        </nav>
      </aside>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`border-b p-4 flex items-center justify-between sticky top-0 z-30 transition-colors ${
          darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-black"
        }`}>
          <button
            className={`md:hidden p-2 border rounded shadow-sm ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"
            }`}
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">{t.dashboard}</h1>
          <div className="w-8 md:hidden" /> 
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
