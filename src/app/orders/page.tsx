"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState({ productId: "", quantity: "", price: "" });
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetch("/api/orders").then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
    fetch("/api/suppliers").then(res => res.json()).then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(() => setSuppliers([]));
    fetch("/api/products").then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  }, []);

  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.price) return;
    setItems([...items, currentItem]);
    setCurrentItem({ productId: "", quantity: "", price: "" });
  };

  const createOrder = async () => {
    if (!supplierId || items.length === 0) return;
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: Number(supplierId),
        shopId: 1,
        items: items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity), price: Number(i.price) }))
      })
    });
    if (res.ok) {
      const newOrder = await res.json();
      setOrders([...orders, newOrder]);
      setShowModal(false);
      setItems([]); setSupplierId("");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer">Create Order</button>
      <div className="w-full overflow-x-auto">
        <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Supplier</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Total</th>
              {userRole === "ADMIN" && <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.id}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.supplier?.name || `Supplier #${o.supplierId}`}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">\${Number(o.total || 0).toFixed(2)}</td>
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
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-xl w-full max-w-[450px] max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>
            <select className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">Select Supplier</option>
              {suppliers.map((s: any) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            <div className="border p-3 mb-3 rounded bg-gray-50 dark:bg-gray-700/50">
              <select className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={currentItem.productId} onChange={(e) => setCurrentItem({...currentItem, productId: e.target.value})}>
                <option value="">Select Product</option>
                {products.map((p: any) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
              <input type="number" placeholder="Qty" className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={currentItem.quantity} onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})} />
              <input type="number" placeholder="Price" className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={currentItem.price} onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})} />
              <button onClick={addItem} className="bg-green-600 text-white px-2 py-1 rounded w-full text-xs font-bold cursor-pointer">Add Item</button>
            </div>
            <button onClick={createOrder} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold cursor-pointer">Save Order</button>
            <button onClick={() => setShowModal(false)} className="mt-3 text-gray-500 w-full text-center text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
