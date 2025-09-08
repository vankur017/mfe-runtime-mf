import React, { useState } from "react";
import { useSessionStore } from "@mfeshared/store";

export default function Login() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const setUser = useSessionStore(s => s.setUser);

  const login = () => {
    setUser({ id: "1", name, roles: [role] });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <select className="border p-2 mb-4 w-full" value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}
