"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "./Footer"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<"en" | "el" | "fr">("en");
  const [open, setOpen] = useState(false); 
  const [darkMode, setDarkMode] = useState(false); 

  // 1. Ανίχνευση Γλώσσας και Θέματος κατά το φόρτωμα
  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      // Ανίχνευση γλώσσας
      const lang = navigator.language;
      if (lang.startsWith("el")) setLocale("el");
      else if (lang.startsWith("fr")) setLocale("fr");
      else setLocale("en");

      // Ανίχνευση αποθηκευμένου Dark Mode
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark"); // Ενεργοποιεί το Dark Mode στον browser
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // 2. Λειτουργία αλλαγής θέματος (Toggle) που επηρεάζει όλο τον browser
  const toggleDarkMode = () => {
    if (darkMode) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark"); // Σβήνει το dark από τον browser
      setDarkMode(false);
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark"); // Επιβάλλει το dark στον browser
      setDarkMode(true);
    }
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
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
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
          <Link href="/" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
            {t.dashboard}
          </Link>
          <Link href="/products" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
            {t.products}
          </Link>
          <Link href="/suppliers" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
            {t.suppliers}
          </Link>
          <Link href="/offers" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
            {t.offers}
          </Link>
          <Link href="/orders" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
            {t.orders}
          </Link>
          <Link href="/users" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
            {t.users}
          </Link>
          <Link href="/settings" onClick={() => setOpen(false)} className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
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

          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/";
            }}
            className="mt-2 p-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors text-center font-semibold"
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
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <button
            className={`md:hidden p-2 border rounded shadow-sm ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
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
