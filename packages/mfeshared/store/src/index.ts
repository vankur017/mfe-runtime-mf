import { create } from "zustand";

/** --- Session store types --- */
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

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  setUser: (u: User | null) => set({ user: u }),
  hasRole: (r: Role) => !!get().user?.roles.includes(r),
}));

export const testStore = "shared-store-ok";

/** --- Remote manifest types --- */
export interface RemoteRoute {
  path: string;               // route path the host will mount, e.g. "/auth/login"
  title: string;              // label/title shown in nav
  elementKey: string;         // format: "<scope>:./ExportedModule" e.g. "auth:./Login"
  requiredRoles?: Role[];     // optional roles required to render this route
}

export interface RemoteManifest {
  name?: string;              // optional remote name
  routes: RemoteRoute[];      // all exposed routes
}
