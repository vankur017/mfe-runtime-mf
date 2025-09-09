// Utility to load MF remotes at runtime
export type RemoteUrlMap = Record<string, string>;

const remoteCache: Record<string, Promise<void>> = {};

function loadRemoteEntry(scope: string, url: string) {
  if (!remoteCache[scope]) {
    remoteCache[scope] = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.async = true;
      script.onload = async () => {
        // Initialize sharing
        // @ts-ignore
        await __webpack_init_sharing__("default");
        // @ts-ignore
        const container = window[scope];
        if (!container) return reject(new Error(`Container ${scope} not found`));
        // @ts-ignore
        await container.init(__webpack_share_scopes__.default);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });
  }
  return remoteCache[scope];
}

export async function loadModule<T = any>(scope: string, module: string): Promise<T> {
  // @ts-ignore
  const container = window[scope];
  // container.get(module) returns a promise that resolves to the factory function
  // @ts-ignore
  const factory = await container.get(module);
  
  // The factory function itself returns a promise that resolves to the module
  // We need to await the result of the factory call.
  const mod = await factory();
  
  return mod.default || mod;
}



export async function ensureRemote<T = any>(scope: string, url: string, module: string): Promise<T> {
  await loadRemoteEntry(scope, url);
  return loadModule<T>(scope, module);
}
