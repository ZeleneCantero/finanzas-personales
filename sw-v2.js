const CACHE = "finanzas-v24";
const ASSETS = ["./manifest.json", "./icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// HTML: network-first (siempre la versión nueva). Resto: cache-first.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // NUNCA cachear el API (Telegram) ni recursos de otros dominios
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;
  if (u.pathname.includes("/api/")) return;

  const isHTML =
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html") ||
    /\.html?($|\?)/.test(req.url) ||
    /\/$/.test(new URL(req.url).pathname);

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(
      (r) =>
        r ||
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
          .catch(() => caches.match("./index.html"))
    )
  );
});
