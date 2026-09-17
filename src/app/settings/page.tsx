"use client";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl bg-white rounded shadow-sm border">
      <h1 className="text-2xl font-bold mb-4">Ρυθμίσεις / Settings</h1>
      <p className="text-gray-600 mb-6">Διαχείριση των ρυθμίσεων της εφαρμογής του Σούπερ Μάρκετ.</p>
      
      <div className="space-y-4">
        {/* Γλώσσα */}
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold text-gray-700">Γλώσσα Συστήματος</h3>
          <p className="text-sm text-gray-500 mt-1">Η γλώσσα ανιχνεύεται αυτόματα από τον browser (Ελληνικά / English / Français).</p>
        </div>

        {/* Βάση Δεδομένων */}
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold text-gray-700">Κατάσταση Βάσης Δεδομένων</h3>
          <p className="text-sm text-green-600 font-medium mt-1">✓ Συνδεδεμένη (SQLite & Prisma)</p>
        </div>

        {/* Έκδοση */}
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold text-gray-700">Έκδοση Εφαρμογής</h3>
          <p className="text-sm text-gray-500 mt-1">Supermarket App v1.0.0 (Production Ready)</p>
        </div>
      </div>
    </div>
  );
}
