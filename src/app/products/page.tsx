"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetch("/api/products").then((res) => res.json()).then((data) => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  }, []);

  const createProduct = async () => {
    if (!name || !price) return;
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), shopId: 1 }),
    });
    if (res.ok) {
      const newProd = await res.json();
      setProducts([...products, newProd]);
      setShowModal(false);
      setName(""); setPrice("");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("Cannot delete product. It might be linked to an order!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer">Create Product</button>
      <div className="w-full overflow-x-auto">
        <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Name</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Price</th>
              {userRole === "ADMIN" && <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 border border-gray-200 dark:border-gray-700">{p.id}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">{p.name}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">\${Number(p.price).toFixed(2)}</td>
                {userRole === "ADMIN" && (
                  <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-xl w-full max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create Product</h2>
            <input type="text" placeholder="Name" className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Price" className="border p-2 w-full mb-4 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button onClick={createProduct} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold cursor-pointer">Save Product</button>
            <button onClick={() => setShowModal(false)} className="mt-3 text-gray-500 w-full text-center text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
