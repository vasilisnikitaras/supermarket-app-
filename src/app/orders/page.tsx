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
  const [shopId, setShopId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrderData = async (currentShopId: string) => {
    const opts = { headers: { "x-shop-id": currentShopId } };
    fetch("/api/orders", opts).then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
    fetch("/api/suppliers", opts).then(res => res.json()).then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(() => setSuppliers([]));
    fetch("/api/products", opts).then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    const savedShopId = localStorage.getItem("shopId");
    if (savedShopId) {
      setShopId(savedShopId);
      fetchOrderData(savedShopId);
    }
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
    if (!supplierId || items.length === 0 || !shopId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-shop-id": shopId },
        body: JSON.stringify({ 
          supplierId: Number(supplierId), 
          items: items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity), price: Number(i.price) })) 
        })
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders([...orders, newOrder]); setShowModal(false); setItems([]); setSupplierId("");
      }
    } catch (err) {
      console.error("Failed to create order:", err);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold">Orders / Παραγγελίες {shopId && <span className="text-purple-600 font-mono">(Shop #{shopId})</span>}</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors cursor-pointer">Create Order</button>
      </div>

      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 max-w-md mx-auto shadow-sm">
        <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
          <input type="text" placeholder="Barcode..." className="border p-2 flex-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} autoFocus />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors cursor-pointer">Search</button>
        </form>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border border-collapse border-gray-200 dark:border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 border-b text-left">ID</th>
              <th className="p-3 border-b text-left">Supplier</th>
              <th className="p-3 border-b text-left">Total</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {orders.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-400">No orders found for this shop.</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="p-3 font-mono font-bold">#{o.id}</td>
                  <td className="p-3 font-medium">{o.supplier?.name || `Supplier #${o.supplierId}`}</td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">\${Number(o.total || 0).toFixed(2)}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button onClick={() => handlePrintPDF(o)} className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer">Print PDF</button>
                    {userRole === "ADMIN" && <button onClick={() => handleDelete(o.id)} className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer">Delete</button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-[450px] border border-gray-100 dark:border-gray-700 text-black dark:text-white">
            <h2 className="text-xl font-bold mb-4">Create New Order</h2>
            <select className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:outline-none" value={supplierId} onChange={e => setSupplierId(e.target.value)} disabled={isSubmitting}>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="border border-gray-200 dark:border-gray-600 p-3 mb-3 rounded bg-gray-50 dark:bg-gray-700/50">
              <select className="border p-2 w-full mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:outline-none" value={currentItem.productId} onChange={e => setCurrentItem({ ...currentItem, productId: e.target.value })} disabled={isSubmitting}>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" placeholder="Qty" className="border p-2 w-full mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:outline-none" value={currentItem.quantity} onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })} disabled={isSubmitting} />
              <input type="number" placeholder="Price" className="border p-2 w-full mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm focus:outline-none" value={currentItem.price} onChange={e => setCurrentItem({ ...currentItem, price: e.target.value })} disabled={isSubmitting} />
              <button onClick={addItem} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded w-full text-xs font-bold transition-colors cursor-pointer">Add Item</button>
            </div>
            {items.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto space-y-1 border p-2 rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                {items.map((it, idx) => <div key={idx} className="text-xs flex justify-between"><span>{it.productName}</span><span className="font-mono font-semibold">{it.quantity} x \${Number(it.price).toFixed(2)}</span></div>)}
              </div>
            )}
            <button onClick={createOrder} disabled={isSubmitting} className={`w-full text-white px-4 py-2 rounded font-bold text-sm transition-colors ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}>
              {isSubmitting ? "Saving..." : "Save Order"}
            </button>
            <button onClick={() => { if(!isSubmitting) { setShowModal(false); setItems([]); setSupplierId(""); } }} disabled={isSubmitting} className="mt-3 text-gray-500 hover:text-gray-700 w-full text-center text-sm cursor-pointer transition-colors block">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
