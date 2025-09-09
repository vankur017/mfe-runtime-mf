import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import { useSessionStore, Role } from "@mfeshared/store";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("User");
  const setUser = useSessionStore(s => s.setUser);
  const navigate = useNavigate(); // <-- Initialize the hook

  const login = () => {
    setUser({
      id: "1",
      name,
      email,
      roles: [role],
    });
    // ✅ Navigate to the user profile route after a successful login
    navigate("/profile"); 
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <select
          className="border p-2 mb-4 w-full"
          value={role}
          onChange={e => setRole(e.target.value as Role)}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}