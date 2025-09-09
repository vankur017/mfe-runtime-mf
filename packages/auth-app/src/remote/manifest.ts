// packages/auth-app/src/remote/manifest.ts
const manifest = {
  routes: [
    {
      path: "/login",
      title: "Login",
      elementKey: "auth:./Login",
      requiredRoles: []
    },
    {
      path: "/profile",
      title: "User Profile",
      elementKey: "auth:./UserProfile",
      requiredRoles: ["User"]
    }
  ]
};

// Module Federation factory must return a function
export default () => Promise.resolve(manifest); // <- important
