import React from "react";
import { useSessionStore } from "@mfeshared/store";

export default function UserProfile() {
  const user = useSessionStore(s => s.user);
  const setUser = useSessionStore(s => s.setUser);

  if (!user) return <div className="p-4">Not logged in</div>;

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-heading">User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Roles:</strong> {user.roles.join(", ")}</p>
      <button
        className="btn btn-danger"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </div>
  );
}