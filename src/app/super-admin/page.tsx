"use client";
import { useEffect, useState } from "react";

export default function SuperAdminPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [newShopName, setNewShopName] = useState("");
  const [loading, setLoading] = useState(true);

  // Φορτώνει live όλα τα μαγαζιά από τη βάση (Neon DB)
  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops");
      if (res.ok) {
        const data = await res.json();
        setShops(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Δημιουργία ολοκαίνουργιου μαγαζιού
  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;

    try {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newShopName.trim() })
      });

      if (res.ok) {
        setNewShopName("");
        fetchShops(); // Ανανέωση του πίνακα live
      }
    } catch (err) {
      console.error("Failed to create shop:", err);
    }
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-purple-600">SaaS Super Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Κεντρικός έλεγχος και δημιουργία νέων καταστημάτων (Multi-Tenancy Core).</p>
      </div>

      {/* 👑 ΦΟΡΜΑ ΔΗΜΙΟΥΡΓΙΑΣ ΝΕΟΥ ΜΑΓΑΖΙΟΥ */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-200 dark:border-purple-900 shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-3 text-black dark:text-white">🚀 Προσθήκη Νέου Καταστήματος / Πελάτη</h2>
        <form onSubmit={handleCreateShop} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Όνομα Καταστήματος (e.g. Supermarket Alpha)"
            className="border p-2.5 flex-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={newShopName}
            onChange={(e) => setNewShopName(e.target.value)}
            required
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded font-bold text-sm transition-colors cursor-pointer">
            + Create New Shop ID
          </button>
        </form>
      </div>

      {/* 📊 ΠΙΝΑΚΑΣ SAAS ΠΕΛΑΤΩΝ / ΚΑΤΑΣΤΗΜΑΤΩΝ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm">Ενεργά Καταστήματα στο Neon DB ({shops.length})</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-700">
                <th className="p-3 text-left">SHOP ID</th>
                <th className="p-3 text-left">Όνομα Καταστήματος</th>
                <th className="p-3 text-center">Χρήστες (Staff)</th>
                <th className="p-3 text-center">Προϊόντα</th>
                <th className="p-3 text-center">Παραγγελίες</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-black dark:text-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-400">Φόρτωση SaaS υποδομής...</td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-400">Δεν βρέθηκαν καταστήματα στη βάση.</td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-purple-600">#{shop.id}</td>
                    <td className="p-3 font-semibold">{shop.name}</td>
                    <td className="p-3 text-center bg-gray-50/50 dark:bg-gray-900/10 font-bold">{shop._count?.users || 0}</td>
                    <td className="p-3 text-center font-bold">{shop._count?.products || 0}</td>
                    <td className="p-3 text-center font-bold">{shop._count?.orders || 0}</td>
                    <td className="p-3 text-center">
                      <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Active Cloud
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
