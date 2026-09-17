"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "",
    price: ""
  });

  // Load orders, suppliers, products
  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);

    fetch("/api/suppliers")
      .then((res) => res.json())
      .then(setSuppliers);

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // Add item to order
  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.price) return;

    setItems([...items, currentItem]);
    setCurrentItem({ productId: "", quantity: "", price: "" });
  };

  // Create order
  const createOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: Number(supplierId),
        items: items.map((i) => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity),
          price: Number(i.price)
        }))
      })
    });

    const newOrder = await res.json();
    setOrders([...orders, newOrder]);
    setShowModal(false);
    setItems([]);
    setSupplierId("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Order
      </button>

      {/* Orders Table */}
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">{order.supplier?.name}</td>
              <td className="p-2 border">${order.total.toFixed(2)}</td>
              <td className="p-2 border">
                {order.items.map((item) => (
                  <div key={item.id}>
                    {item.product?.name} x{item.quantity} (${item.price})
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[500px]">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>

            {/* Supplier */}
            <label className="block mb-2">Supplier</label>
            <select
              className="border p-2 w-full mb-4"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Add Item */}
            <div className="border p-4 mb-4">
              <h3 className="font-bold mb-2">Add Item</h3>

              <select
                className="border p-2 w-full mb-2"
                value={currentItem.productId}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, productId: e.target.value })
                }
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity"
                className="border p-2 w-full mb-2"
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, quantity: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                className="border p-2 w-full mb-2"
                value={currentItem.price}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, price: e.target.value })
                }
              />

              <button
                onClick={addItem}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Add Item
              </button>
            </div>

            {/* Items Preview */}
            <div className="mb-4">
              <h3 className="font-bold mb-2">Items</h3>
              {items.map((item, index) => (
                <div key={index} className="border p-2 mb-1">
                  Product #{item.productId} — Qty: {item.quantity} — Price: {item.price}
                </div>
              ))}
            </div>

            <button
              onClick={createOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Save Order
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
