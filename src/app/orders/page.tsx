"use client";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState({ productId: "", quantity: "", price: "" });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [shopId, setShopId] = useState<string>("1");

  useEffect(() => {
    // 👑 Αν το localStorage είναι άδειο, αναγκάζουμε το app να γράψει shopId: 1 για το τεστ
    if (!localStorage.getItem("shopId")) {
      localStorage.setItem("shopId", "1");
    }
    setUserRole(localStorage.getItem("userRole"));
    const savedShopId = localStorage.getItem("shopId") || "1";
    setShopId(savedShopId);

    const opts = { headers: { "x-shop-id": savedShopId } };
    fetch("/api/orders", opts).then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
    fetch("/api/suppliers", opts).then(res => res.json()).then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(() => setSuppliers([]));
    fetch("/api/products", opts).then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  }, []);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find(p => p.name.includes(barcodeInput.trim()));
    if (found) {
      setCurrentItem({ productId: found.id.toString(), quantity: "1", price: found.price.toString() });
      setBarcodeInput(""); setShowModal(true);
    } else {
      alert(`Barcode: "${barcodeInput}" \nΔεν βρέθηκε!`);
      setBarcodeInput("");
    }
  };

  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.price) return;
    const p = products.find(prod => prod.id === Number(currentItem.productId));
    setItems([...items, { ...currentItem, productName: p ? p.name : `Product #${currentItem.productId}` }]);
    setCurrentItem({ productId: "", quantity: "", price: "" });
  };

  const createOrder = async () => {
    if (!supplierId || items.length === 0) return;
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-shop-id": shopId },
      body: JSON.stringify({ supplierId: Number(supplierId), items: items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity), price: Number(i.price) })) })
    });
    if (res.ok) {
      const newOrder = await res.json();
      setOrders([...orders, newOrder]); setShowModal(false); setItems([]); setSupplierId("");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    if ((await fetch(`/api/orders/${id}`, { method: "DELETE" })).ok) setOrders(orders.filter(o => o.id !== id));
  };

  const handlePrintPDF = (order: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(37, 99, 235).text("VNF MARKET", 14, 20);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100, 116, 139).text("Enterprise Management System", 14, 26).text(`INVOICE #ORD-${order.id}`, 150, 20);
    doc.save(`VNF_Order_Invoice_${order.id}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders / Παραγγελίες (Shop #{shopId})</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Create Order</button>
      </div>

      <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 max-w-md mx-auto">
        <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
          <input type="text" placeholder="Barcode..." className="border p-2 flex-1 rounded text-black" value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} autoFocus />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded font-bold">Search</button>
        </form>
      </div>

      <table className="w-full border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
            <th className="p-2 border text-left">ID</th>
            <th className="p-2 border text-left">Supplier</th>
            <th className="p-2 border text-left">Total</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b">
              <td className="p-2 border">{o.id}</td>
              <td className="p-2 border font-medium">{o.supplier?.name || `Supplier #${o.supplierId}`}</td>
              <td className="p-2 border font-bold">\${Number(o.total || 0).toFixed(2)}</td>
              <td className="p-2 border text-center flex justify-center gap-2">
                <button onClick={() => handlePrintPDF(o)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Print PDF</button>
                {userRole === "ADMIN" && <button onClick={() => handleDelete(o.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-[450px] text-black dark:text-white">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>
            <select className="border p-2 w-full mb-3 rounded text-black" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="border p-3 mb-3 rounded bg-gray-50 dark:bg-gray-700/50">
              <select className="border p-2 w-full mb-2 text-black" value={currentItem.productId} onChange={e => setCurrentItem({ ...currentItem, productId: e.target.value })}>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" placeholder="Qty" className="border p-2 w-full mb-2 text-black" value={currentItem.quantity} onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })} />
              <input type="number" placeholder="Price" className="border p-2 w-full mb-2 text-black" value={currentItem.price} onChange={e => setCurrentItem({ ...currentItem, price: e.target.value })} />
              <button onClick={addItem} className="bg-green-600 text-white px-2 py-1.5 rounded w-full text-xs font-bold">Add Item</button>
            </div>
            {items.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto space-y-1 border p-2 rounded">
                {items.map((it, idx) => <div key={idx} className="text-xs flex justify-between"><span>{it.productName}</span><span>{it.quantity} x \${Number(it.price).toFixed(2)}</span></div>)}
              </div>
            )}
            <button onClick={createOrder} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold">Save Order</button>
            <button onClick={() => { setShowModal(false); setItems([]); setSupplierId(""); }} className="mt-3 text-gray-500 w-full text-center text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
