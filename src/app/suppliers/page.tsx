"use client";
import { useEffect, useState } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  // 🔒 Δυναμικό Shop ID και Κλείδωμα Υποβολής
  const [shopId, setShopId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🏪 Φόρτωση προμηθευτών αυστηρά για το τρέχον κατάστημα
  const fetchSuppliers = async (currentShopId: number) => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "GET",
        headers: {
          "x-shop-id": String(currentShopId) // 🛡️ HTTP Header Ασφαλείας
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(Array.isArray(data) ? data : []);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    
    const storedShopId = localStorage.getItem("shopId");
    if (storedShopId) {
      const parsedId = Number(storedShopId);
      setShopId(parsedId);
      fetchSuppliers(parsedId); // 🔥 Live φόρτωση με το σωστό ID
    }
  }, []);

  const createSupplier = async () => {
    if (!name || !shopId || isSubmitting) return;
    
    setIsSubmitting(true); // 🔥 Κλείδωμα κουμπιού

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-shop-id": String(shopId) // 🛡️ Κλείδωμα στον σωστό tenant
        },
        body: JSON.stringify({ name, phone, email }),
      });

      if (res.ok) {
        const newSup = await res.json();
        setSuppliers([...suppliers, newSup]);
        setShowModal(false);
        setName(""); setPhone(""); setEmail("");
      }
    } catch (err) {
      console.error("Failed to create supplier:", err);
    } finally {
      setIsSubmitting(false); // 🔓 Ξεκλείδωμα
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
    } else {
      alert("Cannot delete supplier. It might be linked to an order!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        {shopId && (
          <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono font-bold px-2.5 py-1 rounded">
            SHOP ID: #{shopId}
          </span>
        )}
      </div>

      <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium cursor-pointer transition-colors">
        Create Supplier
      </button>

      <div className="w-full overflow-x-auto">
        <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Name</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Phone</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Email</th>
              {userRole === "ADMIN" && <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={userRole === "ADMIN" ? 5 : 4} className="p-4 text-center text-gray-400">
                  No suppliers found for this shop.
                </td>
              </tr>
            ) : (
              suppliers.map((s: any) => (
                <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="p-2 border border-gray-200 dark:border-gray-700 font-mono">#{s.id}</td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium">{s.name}</td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">{s.phone || "-"}</td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">{s.email || "-"}</td>
                  {userRole === "ADMIN" && (
                    <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                      <button onClick={() => handleDelete(s.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-xl w-full max-w-[400px] border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Create Supplier</h2>
            <input type="text" placeholder="Name" className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
            <input type="text" placeholder="Phone" className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSubmitting} />
            <input type="email" placeholder="Email" className="border p-2 w-full mb-4 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
            <button 
              onClick={createSupplier} 
              disabled={isSubmitting}
              className={`w-full text-white px-4 py-2 rounded font-bold text-sm transition-colors ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Supplier"}
            </button>
            <button onClick={() => setShowModal(false)} disabled={isSubmitting} className="mt-3 text-gray-500 hover:text-gray-700 w-full text-center text-sm cursor-pointer transition-colors block">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
