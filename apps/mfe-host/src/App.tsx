// import React, { useEffect, useState } from "react";
// import { Link, Route, Routes, Navigate } from "react-router-dom";
// import { useSessionStore } from "@mfeshared/store";
// import { ensureRemote } from "./mf/loadRemote";
// import type { RemoteManifest } from "./mf/types";
// import ErrorBoundary from "./mf/ErrorBoundary";

// // Fallback UI
// const Fallback = ({ msg }: { msg: string }) => (
//   <div className="fallback-container" style={{ padding: 16 }}>
//     <h3>{msg}</h3>
//     <p>Please try again later.</p>
//   </div>
// );

// // Role-based protection
// const Protected: React.FC<{ roles?: string[]; children: React.ReactNode }> = ({ roles, children }) => {
//   const hasRole = useSessionStore(s => s.hasRole);
//   if (!roles || roles.length === 0) return <>{children}</>;
//   const ok = roles.some(r => hasRole(r as any));
//   return ok ? <>{children}</> : <Fallback msg="You do not have permission to view this page." />;
// };

// export default function App() {
//   const [registry, setRegistry] = useState<Record<string, string>>({});
//   const [manifests, setManifests] = useState<RemoteManifest[]>([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/remotes.json");
//         const map = await res.json();
//         setRegistry(map);

//         const loaded: RemoteManifest[] = [];
//        for (const [scope, url] of Object.entries(map)) {
//   console.log("Loading manifest for", scope, url);

//   try {
//     const getManifest = await ensureRemote<any>(scope, url as string, "./manifest");
//     console.log("Got manifest for", scope, getManifest);
//     const manifest = await getManifest();
//     if (!manifest || !manifest.routes) {
//       console.warn(`No valid manifest found for ${scope}`);
//       continue;
//     }
//     loaded.push(manifest);
//   } catch (e) {
//     console.warn(`Failed to load manifest for ${scope}`, e);
//   }
// }

//         setManifests(loaded);
//       } catch (e) {
//         console.error("Failed to load registry", e);
//       }
//     })();
//   }, []);

//   console.log(manifests, "manifests");

//   return (
//   <div className="app-container" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
//       <aside className="sidebar" style={{ borderRight: "1px solid #eee", padding: 16 }}>
//         <h2>Host</h2>
//         <nav>
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             {manifests.flatMap(m => m.routes.map(r => (
//               <li key={r.path}><Link to={r.path}>{r.title}</Link></li>
//             )))}
//           </ul>
//         </nav>
//       </aside>
//       <main style={{ padding: 16 }}>
//         <Routes>
//           <Route path="/" element={<div>Welcome. Use the nav to open a module.</div>} />
//           {manifests.flatMap(m => m.routes.map(r => (
//             <Route
//               key={r.path}
//               path={r.path}
//               element={
//                 <Protected roles={r.requiredRoles}>
//                   {/* ✅ Wrap the remote component with the error boundary */}
//                   <ErrorBoundary fallback={<Fallback msg="An unexpected error occurred in the module." />} >
//                     <RemoteElement elementKey={r.elementKey} registry={registry} />
//                   </ErrorBoundary>
//                 </Protected>
//               }
//             />
//           )))}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// // Dynamic remote component loader
// const cache: Record<string, React.ComponentType<any>> = {};

// function RemoteElement({ elementKey, registry }: { elementKey: string; registry: Record<string, string> }) {
//   const [Comp, setComp] = React.useState<React.ComponentType<any> | null>(() => cache[elementKey] || null);
//   const [error, setError] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     (async () => {
//       try {
//         if (cache[elementKey]) { setComp(cache[elementKey]); return; }
//         const [scope, module] = elementKey.split(":");
//         const url = registry[scope];
//         if (!url) throw new Error(`No URL for scope ${scope}`);
//         const Cmp = await ensureRemote<any>(scope, url, module);
//         cache[elementKey] = Cmp;
//         setComp(() => Cmp);
//       } catch (e: any) {
//         setError(e?.message || "Failed to load remote component");
//       }
//     })();
//   }, [elementKey, registry]);

//   if (error) return <Fallback msg={`Module is currently unavailable: ${error}`} />;
//   if (!Comp) return <div className="loading-indicator">Loading module…</div>;
//   return <Comp />;
// }
import React, { useEffect, useState } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { useSessionStore } from "@mfeshared/store";
import { ensureRemote } from "./mf/loadRemote";
import type { RemoteManifest } from "./mf/types";
import "./styles.css";

// Fallback UI
const Fallback = ({ msg }: { msg: string }) => (
  <div style={{ padding: 16 }}>
    <h3>{msg}</h3>
    <p>Please try again later.</p>
  </div>
);

// Role-based protection
const Protected: React.FC<{ roles?: string[]; children: React.ReactNode }> = ({ roles, children }) => {
  const hasRole = useSessionStore(s => s.hasRole);
  if (!roles || roles.length === 0) return <>{children}</>;
  const ok = roles.some(r => hasRole(r as any));
  return ok ? <>{children}</> : <Fallback msg="You do not have permission to view this page." />;
};

export default function App() {
  const [registry, setRegistry] = useState<Record<string, string>>({});
  const [manifests, setManifests] = useState<RemoteManifest[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/remotes.json");
        const map = await res.json();
        setRegistry(map);

        const loaded: RemoteManifest[] = await Promise.all(
          Object.entries(map).map(async ([scope, url]) => {
            const manifestModule = await ensureRemote<() => Promise<RemoteManifest>>(scope as string, url as string, "./manifest");
            const manifest = await manifestModule();
            return { ...manifest, name: scope };
          })
        );
        setManifests(loaded);
      } catch (e) {
        console.error("Failed to load remote manifests:", e);
      }
    })();
  }, []);

  return (
    <div>
      <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
        <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0, padding: 0 }}>
          {manifests.map(manifest =>
            manifest.routes.map(r => (
              <li key={r.elementKey}>
                <Link to={r.path}>{r.title}</Link>
              </li>
            ))
          )}
        </ul>
      </nav>
      <main>
        <Routes>
          {manifests.map(manifest =>
            manifest.routes.map(r => (
            <Route
              key={r.elementKey}
              path={r.path}
              element={
                <Protected roles={r.requiredRoles}>
                  <React.Suspense fallback={<Fallback msg="Loading..." />}>
                    <RemoteElement elementKey={r.elementKey} registry={registry} />
                  </React.Suspense>
                </Protected>
              }
            />
          )))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Dynamic remote component loader
// We removed the cache object here to avoid issues with component re-use.
// Webpack Module Federation already handles caching the module itself.
function RemoteElement({ elementKey, registry }: { elementKey: string; registry: Record<string, string> }) {
  const [Comp, setComp] = React.useState<React.ComponentType<any> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [scope, module] = elementKey.split(":");
        const url = registry[scope];
        if (!url) throw new Error(`No URL for scope ${scope}`);
        const Cmp = await ensureRemote<any>(scope, url, module);
        if (isMounted) {
          setComp(() => Cmp);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || "Failed to load remote component");
        }
      }
    })();
    return () => { isMounted = false; };
  }, [elementKey, registry]);

  if (error) {
    return <Fallback msg={error} />;
  }

  if (!Comp) {
    return <Fallback msg="Loading..." />;
  }

  return <Comp />;
}
