"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="p-6 max-w-4xl bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <h1 className="text-2xl font-bold mb-4">Χρήστες / Users</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Διαχείριση των λογαριασμών και των δικαιωμάτων πρόσβασης.</p>
      
      <table className="w-full mt-4 border border-collapse border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">ID</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Όνομα / Name</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Email</th>
            <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Ρόλος / Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2 border border-gray-200 dark:border-gray-700">{user.id}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">{user.name}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">{user.email}</td>
              <td className="p-2 border border-gray-200 dark:border-gray-700">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-semibold rounded">
                  {user.role || "Admin"}
                </span>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                Δεν βρέθηκαν εγγεγραμμένοι χρήστες.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
