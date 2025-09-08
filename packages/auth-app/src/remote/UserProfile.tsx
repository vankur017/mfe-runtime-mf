import React from "react";
import { useSessionStore } from "@mfeshared/store";

export default function UserProfile() {
  const user = useSessionStore(s => s.user);
  const setUser = useSessionStore(s => s.setUser);

  if (!user) return <div className="p-4">Not logged in</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Roles:</strong> {user.roles.join(", ")}</p>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </div>
  );
}
