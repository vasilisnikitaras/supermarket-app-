"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") || "ADMIN";
    setCurrentUserRole(savedRole);
    setLoading(false);

    // Φορτώνουμε τους χρήστες μαζί με το live status τους
    fetch("/api/internal-users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

  const createUser = async () => {
    if (!name || !email || !password) return;
    const res = await fetch("/api/internal-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: role.toUpperCase(), shopId: 1 }),
    });
    if (res.ok) {
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setShowModal(false);
      setName(""); setEmail(""); setPassword(""); setRole("STAFF");
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete === null) return;
    const res = await fetch(`/api/internal-users/${userToDelete}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(users.filter((user: any) => user.id !== userToDelete));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (currentUserRole !== "ADMIN") {
    return (
      <div className="p-6 max-w-md mx-auto mt-10 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 p-6 rounded-lg border border-red-200 dark:border-red-900 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold mb-2">🛑 Access Denied / 🚫 Όχι Πρόσβαση</h2>
        <p className="text-sm">Μόνο οι διαχειριστές (Admin) έχουν δικαίωμα να βλέπουν και να πειράζουν τους χρήστες της εφαρμογής.</p>
        <button onClick={() => { localStorage.setItem("userRole", "ADMIN"); window.location.reload(); }} className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm cursor-pointer transition-colors shadow-sm">🔄 Επιστροφή σε Admin View</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Χρήστες / Users</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Διαχείριση των λογαριασμών και των δικαιωμάτων πρόσβασης.</p>
        </div>
        <button onClick={() => { localStorage.setItem("userRole", "STAFF"); window.location.reload(); }} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 cursor-pointer">Γύρνα το σε "Staff" για Test</button>
      </div>
      
      <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors mb-4 cursor-pointer">Create User</button>

      <div className="w-full overflow-x-auto">
        <table className="w-full mt-4 border border-collapse border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-black dark:text-white">
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Status</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Όνομα / Name</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Email</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Ρόλος / Role</th>
              <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                {/* 🟢 ΔΙΟΡΘΩΘΗΚΕ: Live Status Λαμπάκι */}
                <td className="p-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${user.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.isOnline ? "Online" : "Offline"}</span>
                  </div>
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">{user.name}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">{user.email}</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-semibold rounded">{user.role}</span>
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                  <button onClick={() => { setUserToDelete(user.id); setShowDeleteConfirm(true); }} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-xl w-full max-w-[400px] box-border">
            <h2 className="text-xl font-bold mb-4">Create User</h2>
            <input type="text" placeholder="Name" className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 text-base" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 text-base" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="border p-2 w-full mb-3 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 text-base" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select className="border p-2 w-full mb-4 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-pointer text-base" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button onClick={createUser} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold hover:bg-blue-700 transition-colors cursor-pointer">Save User</button>
            <button onClick={() => setShowModal(false)} className="mt-3 text-gray-500 dark:text-gray-400 hover:underline w-full text-center text-sm font-medium transition-colors cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-2xl w-full max-w-[350px] border border-gray-200 dark:border-gray-700 text-center box-border">
            <h3 className="text-lg font-bold mb-2">Delete User?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleDeleteUser} className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition-colors cursor-pointer">Yes, Delete</button>
              <button onClick={() => { setShowDeleteConfirm(false); setUserToDelete(null); }} className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
