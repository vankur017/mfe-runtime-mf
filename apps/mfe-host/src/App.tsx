import React, { useEffect, useState } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { useSessionStore } from "@mfeshared/store";
import { ensureRemote } from "./mf/loadRemote";
import type { RemoteManifest } from "./mf/types";
import { log } from "console";

// Fallback UI
const Fallback = ({ msg }: { msg: string }) => (
  <>
     <div style={{ padding: 16 }}>
    <h3>{msg}</h3>
    <p>Please try again later.</p>
  </div>
  </>
 
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

        const loaded: RemoteManifest[] = [];
        for (const [scope, url] of Object.entries(map)) {
          try {
            const getManifest = await ensureRemote<any>(scope as string, url as string, "./manifest");
            console.log("Got manifest for", scope, getManifest);
            loaded.push(await getManifest());
          } catch (e) {
            console.warn(`Failed to load manifest for ${scope}`, e);
          }
        }
        setManifests(loaded);
      } catch (e) {
        console.error("Failed to load registry", e);
      }
    })();
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 16 }}>
        <h2>Host</h2>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {manifests.flatMap(m => m.routes.map(r => (
              <li key={r.path}><Link to={r.path}>{r.title}</Link></li>
            )))}
          </ul>
        </nav>
      </aside>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<div>Welcome. Use the nav to open a module.</div>} />
          {manifests.flatMap(m => m.routes.map(r => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <Protected roles={r.requiredRoles}>
                  <RemoteElement elementKey={r.elementKey} registry={registry} />
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
const cache: Record<string, React.ComponentType<any>> = {};

function RemoteElement({ elementKey, registry }: { elementKey: string; registry: Record<string, string> }) {
  const [Comp, setComp] = React.useState<React.ComponentType<any> | null>(() => cache[elementKey] || null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        if (cache[elementKey]) { setComp(cache[elementKey]); return; }
        const [scope, module] = elementKey.split(":");
        const url = registry[scope];
        if (!url) throw new Error(`No URL for scope ${scope}`);
        const Cmp = await ensureRemote<any>(scope, url, module);
        cache[elementKey] = Cmp;
        setComp(() => Cmp);
      } catch (e: any) {
        setError(e?.message || "Failed to load remote component");
      }
    })();
  }, [elementKey, registry]);

  if (error) return <Fallback msg={`Module is currently unavailable: ${error}`} />;
  if (!Comp) return <div>Loading module…</div>;
  return <Comp />;
}
