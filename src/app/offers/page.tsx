"use client";
import { useEffect, useState } from "react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState("");
  const [discount, setDiscount] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetch("/api/offers").then(res => res.json()).then(data => setOffers(Array.isArray(data) ? data : [])).catch(() => setOffers([]));
    fetch("/api/products").then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  }, []);

  const createOffer = async () => {
    if (!productId || !discount) return;
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: Number(productId), discount }),
    });
    if (res.ok) {
      const newOffer = await res.json();
      setOffers([...offers, newOffer]);
      setShowModal(false);
      setProductId(""); setDiscount("");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Offers</h1>
      <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer">Create Offer</button>
      <div className="w-full overflow-x-auto">
        <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Product</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Discount</th>
              {userRole === "ADMIN" && <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {offers.map((o: any) => (
              <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.id}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.product?.name || `Product #${o.productId}`}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.discount}</td>
                {userRole === "ADMIN" && (
                  <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                    <button onClick={() => handleDelete(o.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create Offer</h2>
            <select className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Select Product</option>
              {products.map((p: any) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            <input type="text" placeholder="Discount (e.g. 20% OFF)" className="border p-2 w-full mb-4 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            <button onClick={createOffer} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold cursor-pointer">Save Offer</button>
            <button onClick={() => setShowModal(false)} className="mt-3 text-gray-500 w-full text-center text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
