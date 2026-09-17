"use client";

import { useEffect, useState } from "react";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // Pop-up για το Cancel
  const [discount, setDiscount] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then(setOffers)
      .catch(() => setOffers([]));

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const createOffer = async () => {
    if (!discount || !productId) return;

    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discount,
        productId: Number(productId),
      }),
    });

    if (res.ok) {
      const newOffer = await res.json();
      setOffers([...offers, newOffer]);
      setShowModal(false);
      setDiscount("");
      setProductId("");
    }
  };

  // Λειτουργία όταν ο χρήστης πατάει Cancel
  const handleCancelClick = () => {
    // Αν έχει γράψει κάτι, τον ρωτάμε με Pop-up για σιγουριά
    if (discount || productId) {
      setShowCancelConfirm(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Offers</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Create Offer
      </button>

      <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Product</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Discount</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer: any) => (
            <tr key={offer.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2 border border-gray-200 dark:border-gray-700">{offer.id}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">{offer.product?.name || `Product #${offer.productId}`}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-semibold">{offer.discount}</td>
            </tr>
          ))}
          {offers.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400">No offers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Main Modal για Create Offer */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-xl w-[450px]">
            <h2 className="text-xl font-bold mb-4">Create Offer</h2>

            <label className="block mb-2 font-medium">Select Product</label>
            <select
              className="border p-2 w-full mb-4 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="" className="text-gray-500">Select product</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id} className="text-black dark:text-white">
                  {p.name} (\${p.price})
                </option>
              ))}
            </select>

            <label className="block mb-2 font-medium">Discount</label>
            <input
              type="text"
              placeholder="e.g. 20% Off"
              className="border p-2 w-full mb-4 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />

            <button
              onClick={createOffer}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold hover:bg-blue-700 transition-colors"
            >
              Save Offer
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

      {/* 🚨 Επαγγελματικό Pop-up Επιβεβαίωσης για το Cancel */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-2xl w-[350px] border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You will lose all inputted data for this offer.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setShowModal(false); // Κλείνει οριστικά το modal
                  setDiscount("");
                  setProductId("");
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
