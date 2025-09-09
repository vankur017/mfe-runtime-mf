import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Role = "User" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export interface SessionState {
  user: User | null;
  setUser: (u: User | null) => void;
  hasRole: (r: Role) => boolean;
}



export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      user: null,
      // Pass the action name as the third argument to `set`
      setUser: (u: User | null) => set({ user: u }, false, "auth/setUser"), // <-- UPDATE THIS LINE
      hasRole: (r: Role) => !!get().user?.roles.includes(r),
    }),
    { name: "SessionStore" }
  )
);


export const testStore = "shared-store-ok";

/** --- Remote manifest types --- */
export interface RemoteRoute {
  path: string;
  title: string;
  elementKey: string;
  requiredRoles?: Role[];
}

export interface RemoteManifest {
  name?: string;
  routes: RemoteRoute[];
}
