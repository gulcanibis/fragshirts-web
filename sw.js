const CACHE_NAME = "fragshirts-v2";

// 1. Kurulumda yeni versiyonu beklemeden hemen aktif et
self.addEventListener("install", event => {
    self.skipWaiting();
});

// 2. Aktifleştiğinde kullanıcının cihazındaki ESKİ hafızayı zorla sil
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Eski önbellek silindi.");
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Kullanıcı siteye girdiğinde HER ZAMAN önce güncel siteyi (internetten) çekmeyi dene.
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
