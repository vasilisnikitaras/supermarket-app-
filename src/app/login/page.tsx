"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Κλειδώνουμε live τον ρόλο και τα στοιχεία στη συσκευή
        localStorage.setItem("userRole", data.role); // "ADMIN" ή "STAFF"
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userId", data.id.toString());
        localStorage.setItem("shopId", data.shopId ? data.shopId.toString() : "1"); // 👑 Multi-Shop ID Storage Lock
        
        // Στέλνουμε τον χρήστη κατευθείαν στο κεντρικό Dashboard
        window.location.href = "/";
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-xl w-full max-w-[400px] border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black">Supermarket App</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Σύνδεση στο σύστημα διαχείρισης</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-center font-medium">
            🛑 {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Email</label>
            <input type="email" required placeholder="name@example.com" className="w-full border p-2.5 rounded-lg bg-gray-50 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full border p-2.5 rounded-lg bg-gray-50 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer text-base mt-2">
            {loading ? "Σύνδεση..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
