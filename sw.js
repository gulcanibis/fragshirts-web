// DİKKAT: Siteye her yeni forma eklediğinde buradaki v1 yazısını v2, v3, v4 diye değiştir!
const CACHE_NAME = "fragshirts-v2";

// Kurulum aşaması: Yeni versiyon gelirse hemen yükle
self.addEventListener("install", event => {
    self.skipWaiting();
});

// Aktivasyon aşaması: Yeni versiyon yüklendiğinde, ESKİ versiyonları KULLANICININ TELEFONUNDAN ZORLA SİL
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Eski versiyon silindi, yeni versiyon yüklendi.");
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Veri çekme aşaması (Network First stratejisi)
// HER ZAMAN önce internetten güncel siteyi çeker. Sadece internet yoksa hafızadakini gösterir.
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // İnternetten güncel veriyi çekince, bir kopyasını da çevrimdışı kullanım için hafızaya atar
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Eğer kullanıcının interneti kesikse, hafızadaki eski siteyi açar
                return caches.match(event.request);
            })
    );
});
