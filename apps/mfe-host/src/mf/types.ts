export type Permission = "auth:view" | "booking:view" | "reporting:view";

export interface RouteConfig {
  path: string;          // "/login"
  title: string;         // "Login"
  elementKey: string;    // "auth:./Login"
  requiredRoles?: Array<"User" | "Admin">;
}

export interface RemoteManifest {
  name: string;          // "auth"
  routes: RouteConfig[];
}
