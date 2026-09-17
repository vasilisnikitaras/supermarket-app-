"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // Pop-up για το Cancel

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Load products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // Create product
  const createProduct = async () => {
    if (!name || !price) return;

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
      }),
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setShowModal(false);
      setName("");
      setPrice("");
    }
  };

  // Λειτουργία όταν ο χρήστης πατάει Cancel
  const handleCancelClick = () => {
    // Αν έχει γράψει όνομα ή τιμή, τον ρωτάμε με Pop-up για σιγουριά
    if (name || price) {
      setShowCancelConfirm(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Create Product
      </button>

      {/* Products Table */}
      <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Name</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Price</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2 border border-gray-200 dark:border-gray-700">{p.id}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">{p.name}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">${Number(p.price).toFixed(2)}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Main Modal για Create Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          {/* ΔΙΟΡΘΩΘΗΚΕ: Προσθήκη dark:bg-gray-800 και dark:text-white */}
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create Product</h2>

            <input
              type="text"
              placeholder="Product name"
              className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              onClick={createProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold hover:bg-blue-700 transition-colors"
            >
              Save Product
            </button>

            <button
              onClick={handleCancelClick}
              className="mt-3 text-gray-500 dark:text-gray-400 hover:underline w-full text-center text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🚨 Pop-up Επιβεβαίωσης για το Cancel */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-2xl w-[350px] border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You will lose all inputted data for this product.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setShowModal(false); // Κλείνει οριστικά το modal
                  setName("");
                  setPrice("");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
