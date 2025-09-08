// // packages/auth-app/src/remote/manifest.ts
// import type { RemoteManifest } from "@mfeshared/store/src/index";
// // or define locally

// export const manifest: RemoteManifest = {

//   routes: [
//     {
//       path: "/login",
//       title: "Login",
//       elementKey: "auth:./Login",
//       requiredRoles: ["User", "Admin"]
//     },
//     {
//       path: "/profile",
//       title: "User Profile",
//       elementKey: "auth:./UserProfile",
//       requiredRoles: ["User"]
//     }
//   ]
// };

// export default manifest;

const manifest = {
  routes: [
    { path: "/login", title: "Login", elementKey: "auth:./Login", requiredRoles: ["User", "Admin"] },
    { path: "/profile", title: "User Profile", elementKey: "auth:./UserProfile", requiredRoles: ["User"] }
  ]
};

export default () => Promise.resolve(manifest);