"use client";

import { useEffect, useState } from "react";

// 👑 Λεξικό Μεταφράσεων για Αυτόματο Detect
const translations = {
  el: {
    title: "Dashboard",
    subtitle: "Καλώς ήρθατε στο κεντρικό σύστημα διαχείρισης του σούπερ μάρκετ.",
    revenue: "Συνολικά Έσοδα",
    products: "Προϊόντα",
    orders: "Παραγγελίες",
    suppliers: "Προμηθευτές",
    shortcuts: "Γρήγορες Ενέργειες / Shortcuts",
    newOrder: "Νέα Παραγγελία",
    addProduct: "Προσθήκη Προϊόντος",
    loading: "Φόρτωση..."
  },
  en: {
    title: "Dashboard",
    subtitle: "Welcome to the central supermarket management system.",
    revenue: "Total Revenue",
    products: "Products",
    orders: "Orders",
    suppliers: "Suppliers",
    shortcuts: "Quick Actions / Shortcuts",
    newOrder: "New Order",
    addProduct: "Add Product",
    loading: "Loading..."
  }
};

export default function DashboardPage() {
  const [lang, setLang] = useState<"el" | "en">("en"); // Default στα Αγγλικά
  const [stats, setStats] = useState({ products: 0, suppliers: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌍 ΑΥΤΟΜΑΤΟ DETECT: Διαβάζει τη γλώσσα του συστήματος του χρήστη
    const systemLang = navigator.language.startsWith("el") ? "el" : "en";
    setLang(systemLang);

    // Φόρτωση δεδομένων από το Neon DB
    Promise.all([
      fetch("/api/products").then((res) => res.json()).catch(() => []),
      fetch("/api/suppliers").then((res) => res.json()).catch(() => []),
      fetch("/api/orders").then((res) => res.json()).catch(() => []),
    ]).then(([products, suppliers, orders]) => {
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      setStats({
        products: products.length,
        suppliers: suppliers.length,
        orders: orders.length,
        revenue: totalRevenue,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-center">{translations[lang].loading}</div>;

  const t = translations[lang]; // Παίρνουμε τις σωστές λέξεις live

  return (
    <div className="p-6 text-black dark:text-white transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* 📊 Responsive Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md">
          <p className="text-xs font-semibold uppercase opacity-80">{t.revenue}</p>
          <h3 className="text-2xl font-black mt-1">${stats.revenue.toFixed(2)}</h3>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t.products}</p>
          <h3 className="text-2xl font-bold mt-1">{stats.products}</h3>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t.orders}</p>
          <h3 className="text-2xl font-bold mt-1">{stats.orders}</h3>
        </div>

        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t.suppliers}</p>
          <h3 className="text-2xl font-bold mt-1">{stats.suppliers}</h3>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gray-50 dark:bg-gray-800/40">
        <h3 className="text-base font-bold mb-3">{t.shortcuts}</h3>
        <div className="flex flex-wrap gap-2">
          <a href="/orders" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">{t.newOrder}</a>
          <a href="/products" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">{t.addProduct}</a>
        </div>
      </div>
    </div>
  );
}
