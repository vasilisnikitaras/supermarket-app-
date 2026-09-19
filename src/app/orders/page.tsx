"use client";
import { useEffect, useState, useRef } from "react";
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
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetch("/api/orders").then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]));
    fetch("/api/suppliers").then(res => res.json()).then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(() => setSuppliers([]));
    fetch("/api/products").then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (scannerActive && typeof window !== "undefined") {
      import("html5-qrcode").then((lib) => {
        scannerRef.current = new lib.Html5QrcodeScanner("page-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        scannerRef.current.render(
          (decodedText: string) => {
            const foundProd = products.find(p => p.name.includes(decodedText));
            if (foundProd) {
              setCurrentItem({ productId: foundProd.id.toString(), quantity: "1", price: foundProd.price.toString() });
              setScannerActive(false);
              setShowModal(true);
              if (scannerRef.current) scannerRef.current.clear().catch(() => {});
            } else {
              alert(`Barcode: ${decodedText} \nΔεν βρέθηκε στα προϊόντα!`);
            }
          },
          () => {}
        );
      }).catch(() => {});
    }
    return () => { if (scannerRef.current) scannerRef.current.clear().catch(() => {}); };
  }, [scannerActive, products]);

  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.price) return;
    const selectedProd = products.find(p => p.id === Number(currentItem.productId));
    const productName = selectedProd ? selectedProd.name : `Product #${currentItem.productId}`;
    setItems([...items, { ...currentItem, productName }]);
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
    if (res.ok) setOrders(orders.filter((o) => o.id !== id));
  };

  const handlePrintPDF = (order: any) => {
    const doc = new jsPDF();
    const supplierName = order.supplier?.name || `Supplier #${order.supplierId}`;
    doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(37, 99, 235).text("VNF MARKET", 14, 20);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100, 116, 139).text("Enterprise Management System", 14, 26);
    doc.setFont("helvetica", "bold").setTextColor(0, 0, 0).text(`INVOICE #ORD-${order.id}`, 150, 20);
    doc.setFont("helvetica", "normal").text(`Date: ${new Date().toLocaleDateString()}`, 150, 26);
    doc.setDrawColor(226, 232, 240).line(14, 32, 196, 32);
    let y = 75;
    doc.setFont("helvetica", "bold").setFontSize(11).setFillColor(241, 245, 249).rect(14, y, 182, 8, "F");
    doc.setTextColor(0, 0, 0).text("Product Name", 16, y + 6).text("Qty", 90, y + 6).text("Unit Price", 120, y + 6).text("Total", 165, y + 6);
    y += 8; doc.setFont("helvetica", "normal");
    if (order.items) {
      order.items.forEach((item: any) => {
        const name = item.product?.name || `Product #${item.productId}`;
        doc.text(name, 16, y + 6).text(item.quantity.toString(), 90, y + 6).text(`$${Number(item.price).toFixed(2)}`, 120, y + 6).text(`$${(item.quantity * item.price).toFixed(2)}`, 165, y + 6);
        y += 8;
      });
    }
    doc.line(14, y + 2, 196, y + 2);
    doc.setFont("helvetica", "bold").setFontSize(13).text("GRAND TOTAL:", 115, y + 10).text(`$${Number(order.total || 0).toFixed(2)}`, 165, y + 10);
    doc.save(`VNF_Order_Invoice_${order.id}.pdf`);
  };
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders / Παραγγελίες</h1>
          <p className="text-gray-500 text-sm">Δημιουργία και διαχείριση τιμολογίων προμηθευτών.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer hover:bg-blue-700 transition-colors">Create Order</button>
          <button onClick={() => setScannerActive(!scannerActive)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium cursor-pointer transition-colors">
            {scannerActive ? "🛑 Close Scanner" : "📸 Quick Scan Item"}
          </button>
        </div>
      </div>

      {/* 📸 Live Κάμερα απευθείας στη σελίδα (100% Safe ID Render έξω από το Modal) */}
      {scannerActive && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-purple-300 dark:border-purple-900 max-w-md mx-auto">
          <p className="text-xs font-bold text-purple-600 mb-2 text-center uppercase tracking-wider">Live Barcode Reader Active / Δείξτε το Barcode στην κάμερα:</p>
          <div id="page-reader" className="border rounded overflow-hidden bg-black w-full min-h-[250px]"></div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full border border-collapse border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Supplier</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Items / Προϊόντα</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Total</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions / Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 border border-gray-200 dark:border-gray-700">{o.id}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium">{o.supplier?.name || `Supplier #${o.supplierId}`}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 text-xs">
                  <div className="space-y-0.5">
                    {o.items && o.items.map((item: any, idx: number) => (
                      <div key={idx} className="text-gray-600 dark:text-gray-300">
                        • <span className="font-semibold text-blue-600 dark:text-blue-400">{item.product?.name || `Product #${item.productId}`}</span> ({item.quantity} x \${Number(item.price).toFixed(2)})
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 font-bold">\${Number(o.total || 0).toFixed(2)}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handlePrintPDF(o)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer">Print PDF</button>
                    {userRole === "ADMIN" && ( <button onClick={() => handleDelete(o.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer">Delete</button> )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-[450px] max-h-[85vh] overflow-y-auto text-black dark:text-white">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>
            <select className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">Select Supplier</option>
              {suppliers.map((s: any) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            <div className="border p-3 mb-3 rounded bg-gray-50 dark:bg-gray-700/50">
              <select className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={currentItem.productId} onChange={(e) => setCurrentItem({ ...currentItem, productId: e.target.value })}>
                <option value="">Select Product</option>
                {products.map((p: any) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
              <input type="number" placeholder="Qty" className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })} />
              <input type="number" placeholder="Price" className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white" value={currentItem.price} onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })} />
              <button onClick={addItem} className="bg-green-600 text-white px-2 py-1.5 rounded w-full text-xs font-bold cursor-pointer">Add Item</button>
            </div>
            {items.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto space-y-1 border p-2 rounded bg-gray-100/50 dark:bg-gray-900/50">
                {items.map((it, idx) => (
                  <div key={idx} className="text-xs flex justify-between bg-white dark:bg-gray-700 p-2 rounded">
                    <span>{it.productName}</span>
                    <span>{it.quantity} x \${Number(it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={createOrder} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold">Save Order</button>
            <button onClick={() => { setShowModal(false); setItems([]); setSupplierId(""); }} className="mt-3 text-gray-500 w-full text-center text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
