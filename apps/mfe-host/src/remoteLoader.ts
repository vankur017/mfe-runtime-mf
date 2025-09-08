// host/src/remoteLoader.ts
export interface RemoteManifest {
  [scope: string]: string; // scope name -> remoteEntry URL
}

// Cache for loaded remotes
const remoteCache: Record<string, any> = {};

/**
 * Dynamically load a remote module from a given scope and module name
 * @param scope - Module Federation scope (e.g., 'auth')
 * @param url - remoteEntry.js URL
 * @param module - exposed module (e.g., './Login')
 */
export async function loadRemote<T = any>(scope: string, url: string, module: string): Promise<T> {
  if (remoteCache[scope]) {
    const factory = await remoteCache[scope].get(module);
    return factory().default || factory();
  }

  // Inject remoteEntry script
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote: ${url}`));
    document.head.appendChild(script);
  });

  // @ts-ignore: __webpack_init_sharing__ exists via Module Federation
  await __webpack_init_sharing__("default");

  // @ts-ignore
  const container = (window as any)[scope];

  if (!container) throw new Error(`Remote ${scope} not found on window`);

  // Initialize sharing
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);

  remoteCache[scope] = container;

  const factory = await container.get(module);
  return factory().default || factory();
}

/**
 * Load all remotes from remotes.json
 * @param manifestUrl - path to JSON manifest (e.g., '/remotes.json')
 */
export async function initRemotesFromManifest(manifestUrl: string): Promise<RemoteManifest> {
  const res = await fetch(manifestUrl);
  const manifest: RemoteManifest = await res.json();
  const entries = Object.entries(manifest);

  await Promise.all(
    entries.map(async ([scope, url]) => {
      try {
        // Preload remote to cache
        await loadRemote(scope, url, "./manifest").catch(() => {}); // optional: ignore missing manifest
      } catch (err) {
        console.warn(`Failed to preload remote ${scope}`, err);
      }
    })
  );

  return manifest;
}
