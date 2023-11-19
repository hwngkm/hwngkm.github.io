const CACHE_NAME = "myHUPH-Schedule";
const OFFLINE_PAGE = "index.html";

self.addEventListener("install", function (event) {
    console.log("[Service Worker] Install Event processing");

    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("[Service Worker] Cached offline page during install");
            return cache.add(OFFLINE_PAGE);
        })
    );
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                console.log("[Service Worker] Add page to offline cache: " + response.url);

                event.waitUntil(updateCache(event.request, response.clone()));

                return response;
            })
            .catch(function (error) {
                console.log("[Service Worker] Network request Failed. Serving content from cache: " + error);
                return fromCache(event.request);
            })
    );
});

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return fetch(OFFLINE_PAGE);
            }

            return matching;
        });
    });
}

function updateCache(request, response) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.put(request, response);
    });
}
