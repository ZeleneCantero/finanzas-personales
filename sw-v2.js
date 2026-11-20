const CACHE = "finanzas-v25";
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

// Web Push: muestra la notificación aunque la app esté cerrada.
self.addEventListener("push", (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; }
  catch (err) { try { data = { body: e.data.text() }; } catch (err2) {} }
  const title = data.title || "💰 Finanzas";
  const options = {
    body: data.body || "Tienes una novedad en tus finanzas.",
    icon: data.icon || "./icon.svg",
    badge: "./icon.svg",
    tag: "finanzas-rendimiento",
    data: { url: data.url || "./" },
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Al tocar la notificación, abre (o enfoca) la app en la sección indicada.
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const destino = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const objetivo = new URL(destino, self.location.href).href;
      for (const c of clients) {
        if (new URL(c.url).href === objetivo) return c.focus();
      }
      for (const c of clients) {
        if (new URL(c.url).origin === self.location.origin) {
          c.navigate(destino);
          return c.focus();
        }
      }
      return self.clients.openWindow(destino);
    })
  );
});
