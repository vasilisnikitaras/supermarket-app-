"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ revenue: 0, products: 0, orders: 0, suppliers: 0 });
  const [shopId, setShopId] = useState("1");

  useEffect(() => {
    // 👑 SaaS Fix: Διαβάζουμε το shopId από τη μνήμη της συσκευής
    const savedShopId = localStorage.getItem("shopId") || "1";
    setShopId(savedShopId);

    // Δημιουργούμε τα Multi-Tenant Options με το σωστό Header
    const fetchOptions = { 
      headers: { "x-shop-id": savedShopId } 
    };

    Promise.all([
      fetch("/api/products", fetchOptions).then((res) => res.json()).catch(() => []),
      fetch("/api/suppliers", fetchOptions).then((res) => res.json()).catch(() => []),
      fetch("/api/orders", fetchOptions).then((res) => res.json()).catch(() => []),
    ]).then(([products, suppliers, orders]) => {
      // Ασφάλεια: Αν ο server επιστρέψει σφάλμα αντί για πίνακα, βάζουμε κενό Array []
      const validOrders = Array.isArray(orders) ? orders : [];
      const validProducts = Array.isArray(products) ? products : [];
      const validSuppliers = Array.isArray(suppliers) ? suppliers : [];

      const totalRevenue = validOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      
      setStats({
        revenue: totalRevenue,
        products: validProducts.length,
        orders: validOrders.length,
        suppliers: validSuppliers.length,
      });
    }).catch((err) => console.error("❌ Dashboard Fetch Crash:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard / Πίνακας Ελέγχου</h1>
      <p className="text-gray-500 text-sm mb-6">Κεντρική διαχείριση καταστήματος (Shop #{shopId})</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border rounded-xl bg-blue-600 text-white shadow-sm">
          <p className="text-xs uppercase font-bold opacity-80">Total Revenue</p>
          <p className="text-2xl font-black mt-1">${stats.revenue.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Products</p>
          <p className="text-2xl font-black mt-1">{stats.products}</p>
        </div>
        <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Orders</p>
          <p className="text-2xl font-black mt-1">{stats.orders}</p>
        </div>
        <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Suppliers</p>
          <p className="text-2xl font-black mt-1">{stats.suppliers}</p>
        </div>
      </div>
    </div>
  );
}
