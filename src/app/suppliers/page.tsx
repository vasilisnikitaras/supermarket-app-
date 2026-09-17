"use client";

import { useEffect, useState } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Load suppliers
  useEffect(() => {
    fetch("/api/suppliers")
      .then((res) => res.json())
      .then(setSuppliers);
  }, []);

  // Create supplier
  const createSupplier = async () => {
    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
      }),
    });

    const newSupplier = await res.json();
    setSuppliers([...suppliers, newSupplier]);

    setShowModal(false);
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Supplier
      </button>

      {/* Suppliers Table */}
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.id}</td>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.phone || "-"}</td>
              <td className="p-2 border">{s.email || "-"}</td>
              <td className="p-2 border">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create Supplier</h2>

            <input
              type="text"
              placeholder="Supplier name"
              className="border p-2 w-full mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone"
              className="border p-2 w-full mb-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={createSupplier}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Save Supplier
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-2 text-gray-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
