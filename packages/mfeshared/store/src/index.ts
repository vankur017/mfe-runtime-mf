import {create} from "zustand";

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
  setUser: (u) => set({ user: u }),
  hasRole: (r) => !!get().user?.roles.includes(r),
}));

export const testStore = "shared-store-ok";

