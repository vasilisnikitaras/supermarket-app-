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
    fetch("/orders/api/orders" ? "/api/orders" : "/api/orders").then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
    fetch("/api/suppliers").then(res => res.json()).then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(() => setSuppliers([]));
    fetch("/api/products").then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  }, []);

  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.price) return;
    const selectedProd = products.find(p => p.id === Number(currentItem.productId));
    const productName = selectedProd ? selectedProd.name : `Product #${currentItem.productId}`;

    setItems([...items, {
      ...currentItem,
      productName: productName
    }]);
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
      <h1 className="text-2xl font-bold mb-4">Orders / Παραγγελίες</h1>
      <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer hover:bg-blue-700 transition-colors">Create Order</button>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Supplier</th>
              {/* 👑 ΝΕΑ ΣΤΗΛΗ: Live εμφάνιση των προϊόντων στον κεντρικό πίνακα */}
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Items / Προϊόντα</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Total</th>
              {userRole === "ADMIN" && <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.id}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium">{o.supplier?.name || `Supplier #${o.supplierId}`}</td>
                {/* 👑 Live map των προϊόντων της παραγγελίας από το Neon DB Relation */}
                <td className="p-2 border border-gray-200 dark:border-gray-700 text-xs">
                  <div className="space-y-0.5">
                    {o.items && o.items.map((item: any, idx: number) => (
                      <div key={idx} className="text-gray-600 dark:text-gray-300">
                        • <span className="font-semibold text-blue-600 dark:text-blue-400">{item.product?.name || `Product #${item.productId}`}</span> ({item.quantity} x \${Number(item.price).toFixed(2)})
                      </div>
                    ))}
                    {(!o.items || o.items.length === 0) && <span className="text-gray-400">-</span>}
                  </div>
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 font-bold">\${Number(o.total || 0).toFixed(2)}</td>
                {userRole === "ADMIN" && (
                  <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                    {/* 👑 ΔΙΟΡΘΩΘΗΚΕ: Καθαρό, λειτουργικό κουμπί Delete χωρίς σχόλια κειμένου */}
                    <button onClick={() => handleDelete(o.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors">Delete</button>
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
            <select className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">Select Supplier</option>
              {suppliers.map((s: any) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            
            <div className="border p-3 mb-3 rounded bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
              <select className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" value={currentItem.productId} onChange={(e) => setCurrentItem({...currentItem, productId: e.target.value})}>
                <option value="">Select Product</option>
                {products.map((p: any) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
              <input type="number" placeholder="Qty" className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" value={currentItem.quantity} onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})} />
              <input type="number" placeholder="Price" className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" value={currentItem.price} onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})} />
              <button onClick={addItem} className="bg-green-600 text-white px-2 py-1.5 rounded w-full text-xs font-bold cursor-pointer hover:bg-green-700 transition-colors">Add Item</button>
            </div>

            {items.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto space-y-1 border p-2 rounded bg-gray-100/50 dark:bg-gray-900/50 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Added Items / Προϊόντα στην παραγγελία:</p>
                {items.map((it, idx) => (
                  <div key={idx} className="text-xs flex justify-between bg-white dark:bg-gray-700 p-2 rounded shadow-sm border dark:border-gray-600">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{it.productName}</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {it.quantity} x \${Number(it.price).toFixed(2)} = <strong className="text-black dark:text-white">\${(Number(it.quantity) * Number(it.price)).toFixed(2)}</strong>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={createOrder} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold cursor-pointer hover:bg-blue-700 transition-colors">Save Order</button>
            <button onClick={() => { setShowModal(false); setItems([]); setSupplierId(""); }} className="mt-3 text-gray-500 w-full text-center text-sm cursor-pointer hover:underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
