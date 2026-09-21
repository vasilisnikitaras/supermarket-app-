"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicOffersPage() {
  const params = useParams();
  const shopId = params?.shopId as string;
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;
    
    // Τραβάμε live τις προσφορές από το API στέλνοντας το σωστό x-shop-id header
    fetch("/api/offers", {
      headers: { "x-shop-id": shopId }
    })
      .then((res) => res.json())
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching public offers:", err))
      .finally(() => setLoading(false));
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50 text-black p-4">
      {/* ΚΕΦΑΛΙΔΑ ΜΑΓΑΖΙΟΥ */}
      <div className="text-center py-6 bg-blue-600 text-white rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-black tracking-tight">ΨΗΦΙΑΚΟ ΦΥΛΛΑΔΙΟ</h1>
        <p className="text-sm font-semibold opacity-90 mt-1">Live Προσφορές Καταστήματος (Shop #{shopId})</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium">Ανανέωση προσφορών live από το Cloud...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-gray-500 font-medium">Δεν υπάρχουν ενεργές προσφορές για αυτό το κατάστημα αυτή τη στιγμή.</p>
        </div>
      ) : (
        /* ΛΙΣΤΑ ΠΡΟΣΦΟΡΩΝ ΓΙΑ ΤΟ ΚΙΝΗΤΟ */
        <div className="space-y-4 max-w-md mx-auto">
          {offers.map((offer: any) => (
            <div key={offer.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex justify-between items-center transition-all">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{offer.product?.name || `Προϊόν #${offer.productId}`}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Κωδικός: #{offer.id}</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-black tracking-wider uppercase mb-1">
                  {offer.discount || "ΕΚΠΤΩΣΗ"}
                </span>
                <p className="text-xs text-gray-500">Live στο ταμείο</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center mt-12 py-4 text-xs text-gray-400 font-medium">
        Powered by VNF Software — Created by Vasilis Nikitaras
      </div>
    </div>
  );
}
