const CACHE='ddl-v3';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png']).catch(()=>{})));});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch',e=>{
  const url = new URL(e.request.url);
  // Only intercept same-origin GET requests (app shell) — never touch cross-origin API calls (Supabase etc.)
  if(e.request.method!=='GET' || url.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
