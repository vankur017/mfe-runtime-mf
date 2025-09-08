// auth-app/src/manifest.ts
import type { RemoteManifest } from "@mfeshared/store"; // type shared with host

const manifest: RemoteManifest = {
  name: "auth",
  routes: [
    {
      path: "/login",
      title: "Login",
      elementKey: "auth:./Login",
      requiredRoles: [] // public
    },
    {
      path: "/profile",
      title: "User Profile",
      elementKey: "auth:./UserProfile",
      requiredRoles: ["user"] // example role
    }
  ]
};

export default manifest;
