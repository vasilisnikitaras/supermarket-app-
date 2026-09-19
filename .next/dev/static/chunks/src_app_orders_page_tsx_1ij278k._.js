(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/orders/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrdersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function OrdersPage() {
    _s();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suppliers, setSuppliers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [supplierId, setSupplierId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentItem, setCurrentItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        productId: "",
        quantity: "",
        price: ""
    });
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersPage.useEffect": ()=>{
            setUserRole(localStorage.getItem("userRole"));
            fetch("/api/orders").then({
                "OrdersPage.useEffect": (res)=>res.json()
            }["OrdersPage.useEffect"]).then({
                "OrdersPage.useEffect": (data)=>setOrders(Array.isArray(data) ? data : [])
            }["OrdersPage.useEffect"]).catch({
                "OrdersPage.useEffect": ()=>setOrders([])
            }["OrdersPage.useEffect"]);
            fetch("/api/suppliers").then({
                "OrdersPage.useEffect": (res)=>res.json()
            }["OrdersPage.useEffect"]).then({
                "OrdersPage.useEffect": (data)=>setSuppliers(Array.isArray(data) ? data : [])
            }["OrdersPage.useEffect"]).catch({
                "OrdersPage.useEffect": ()=>setSuppliers([])
            }["OrdersPage.useEffect"]);
            fetch("/api/products").then({
                "OrdersPage.useEffect": (res)=>res.json()
            }["OrdersPage.useEffect"]).then({
                "OrdersPage.useEffect": (data)=>setProducts(Array.isArray(data) ? data : [])
            }["OrdersPage.useEffect"]).catch({
                "OrdersPage.useEffect": ()=>setProducts([])
            }["OrdersPage.useEffect"]);
        }
    }["OrdersPage.useEffect"], []);
    const addItem = ()=>{
        if (!currentItem.productId || !currentItem.quantity || !currentItem.price) return;
        const selectedProd = products.find((p)=>p.id === Number(currentItem.productId));
        const productName = selectedProd ? selectedProd.name : `Product #${currentItem.productId}`;
        setItems([
            ...items,
            {
                ...currentItem,
                productName
            }
        ]);
        setCurrentItem({
            productId: "",
            quantity: "",
            price: ""
        });
    };
    const createOrder = async ()=>{
        if (!supplierId || items.length === 0) return;
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                supplierId: Number(supplierId),
                shopId: 1,
                items: items.map((i)=>({
                        productId: Number(i.productId),
                        quantity: Number(i.quantity),
                        price: Number(i.price)
                    }))
            })
        });
        if (res.ok) {
            const newOrder = await res.json();
            setOrders([
                ...orders,
                newOrder
            ]);
            setShowModal(false);
            setItems([]);
            setSupplierId("");
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm("Are you sure you want to delete this order?")) return;
        const res = await fetch(`/api/orders/${id}`, {
            method: "DELETE"
        });
        if (res.ok) setOrders(orders.filter((o)=>o.id !== id));
    };
    const handlePrintPDF = (order)=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsPDF"]();
        const supplierName = order.supplier?.name || `Supplier #${order.supplierId}`;
        doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(37, 99, 235);
        doc.text("VNF MARKET", 14, 20);
        doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100, 116, 139);
        doc.text("Enterprise Management System", 14, 26);
        doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
        doc.text(`INVOICE #ORD-${order.id}`, 150, 20);
        doc.setFont("helvetica", "normal").text(`Date: ${new Date().toLocaleDateString()}`, 150, 26);
        doc.setDrawColor(226, 232, 240).line(14, 32, 196, 32);
        doc.setFont("helvetica", "bold").setFontSize(12).text("Supplier Info:", 14, 42);
        doc.setFont("helvetica", "normal").setFontSize(11).text(`Company Name: ${supplierName}`, 14, 49);
        if (order.supplier?.phone) doc.text(`Phone: ${order.supplier.phone}`, 14, 55);
        if (order.supplier?.email) doc.text(`Email: ${order.supplier.email}`, 14, 61);
        let y = 75;
        doc.setFont("helvetica", "bold").setFontSize(11).setFillColor(241, 245, 249).rect(14, y, 182, 8, "F");
        doc.setTextColor(0, 0, 0).text("Product Name", 16, y + 6).text("Qty", 90, y + 6).text("Unit Price", 120, y + 6).text("Total", 165, y + 6);
        y += 8;
        doc.setFont("helvetica", "normal");
        if (order.items) {
            order.items.forEach((item)=>{
                const name = item.product?.name || `Product #${item.productId}`;
                doc.text(name, 16, y + 6).text(item.quantity.toString(), 90, y + 6).text(`$${Number(item.price).toFixed(2)}`, 120, y + 6).text(`$${(item.quantity * item.price).toFixed(2)}`, 165, y + 6);
                y += 8;
            });
        }
        doc.line(14, y + 2, 196, y + 2);
        doc.setFont("helvetica", "bold").setFontSize(13).text("GRAND TOTAL:", 115, y + 10).text(`$${Number(order.total || 0).toFixed(2)}`, 165, y + 10);
        doc.setFont("helvetica", "italic").setFontSize(9).setTextColor(148, 163, 184).text("Thank you for your business. Generated by VNF Software.", 14, 280);
        doc.save(`VNF_Order_Invoice_${order.id}.pdf`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4",
                children: "Orders / Παραγγελίες"
            }, void 0, false, {
                fileName: "[project]/src/app/orders/page.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowModal(true),
                className: "bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer hover:bg-blue-700 transition-colors",
                children: "Create Order"
            }, void 0, false, {
                fileName: "[project]/src/app/orders/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full mt-6 border border-collapse border-gray-200 dark:border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "bg-gray-100 dark:bg-gray-800 text-black dark:text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2 border border-gray-200 dark:border-gray-700 text-left",
                                        children: "ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/orders/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2 border border-gray-200 dark:border-gray-700 text-left",
                                        children: "Supplier"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/orders/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2 border border-gray-200 dark:border-gray-700 text-left",
                                        children: "Items / Προϊόντα"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/orders/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2 border border-gray-200 dark:border-gray-700 text-left",
                                        children: "Total"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/orders/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "p-2 border border-gray-200 dark:border-gray-700 text-center",
                                        children: "Actions / Ενέργειες"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/orders/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/orders/page.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: orders.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-gray-200 dark:border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 border border-gray-200 dark:border-gray-700",
                                            children: o.id
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 border border-gray-200 dark:border-gray-700 font-medium",
                                            children: o.supplier?.name || `Supplier #${o.supplierId}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 border border-gray-200 dark:border-gray-700 text-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: o.items && o.items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-gray-600 dark:text-gray-300",
                                                        children: [
                                                            "• ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-blue-600 dark:text-blue-400",
                                                                children: item.product?.name || `Product #${item.productId}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/orders/page.tsx",
                                                                lineNumber: 117,
                                                                columnNumber: 27
                                                            }, this),
                                                            " (",
                                                            item.quantity,
                                                            " x \\$",
                                                            Number(item.price).toFixed(2),
                                                            ")"
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/app/orders/page.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/orders/page.tsx",
                                                lineNumber: 114,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 border border-gray-200 dark:border-gray-700 font-bold",
                                            children: [
                                                "\\$",
                                                Number(o.total || 0).toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "p-2 border border-gray-200 dark:border-gray-700 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handlePrintPDF(o),
                                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer",
                                                        children: "Print PDF"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/orders/page.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 21
                                                    }, this),
                                                    userRole === "ADMIN" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDelete(o.id),
                                                        className: "bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer",
                                                        children: "Delete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/orders/page.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 48
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/orders/page.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, o.id, true, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/orders/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/orders/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-[450px] max-h-[85vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Create Order"
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: "border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white",
                            value: supplierId,
                            onChange: (e)=>setSupplierId(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Supplier"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 15
                                }, this),
                                suppliers.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: s.id,
                                        children: s.name
                                    }, s.id, false, {
                                        fileName: "[project]/src/app/orders/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 43
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border p-3 mb-3 rounded bg-gray-50 dark:bg-gray-700/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white",
                                    value: currentItem.productId,
                                    onChange: (e)=>setCurrentItem({
                                            ...currentItem,
                                            productId: e.target.value
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select Product"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this),
                                        products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: p.id,
                                                children: p.name
                                            }, p.id, false, {
                                                fileName: "[project]/src/app/orders/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 44
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 144,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    placeholder: "Qty",
                                    className: "border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white",
                                    value: currentItem.quantity,
                                    onChange: (e)=>setCurrentItem({
                                            ...currentItem,
                                            quantity: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    placeholder: "Price",
                                    className: "border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white",
                                    value: currentItem.price,
                                    onChange: (e)=>setCurrentItem({
                                            ...currentItem,
                                            price: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: addItem,
                                    className: "bg-green-600 text-white px-2 py-1.5 rounded w-full text-xs font-bold cursor-pointer",
                                    children: "Add Item"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, this),
                        items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 max-h-32 overflow-y-auto space-y-1 border p-2 rounded bg-gray-100/50 dark:bg-gray-900/50",
                            children: items.map((it, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs flex justify-between bg-white dark:bg-gray-700 p-2 rounded",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: it.productName
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 156,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                it.quantity,
                                                " x \\$",
                                                Number(it.price).toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/orders/page.tsx",
                                            lineNumber: 157,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/src/app/orders/page.tsx",
                                    lineNumber: 155,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: createOrder,
                            className: "bg-blue-600 text-white px-4 py-2 rounded w-full font-bold",
                            children: "Save Order"
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowModal(false);
                                setItems([]);
                                setSupplierId("");
                            },
                            className: "mt-3 text-gray-500 w-full text-center text-sm cursor-pointer",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/page.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/orders/page.tsx",
                    lineNumber: 137,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/orders/page.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/orders/page.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(OrdersPage, "hZY8XCNWLM01+J8h2+RMbgQbF6E=");
_c = OrdersPage;
var _c;
__turbopack_context__.k.register(_c, "OrdersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_orders_page_tsx_1ij278k._.js.map