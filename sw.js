// Service Worker for REHAN Carder
const CACHE_NAME = 'rehan-carder-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    'https://i.postimg.cc/v80yJMN6/Gemini-Generated-Image-pkqccqpkqccqpkqc.png',
    'https://i.postimg.cc/TwT9qjRB/Chat-GPT-Image-Aug-16-2025-10-39-40-AM.png',
    'https://i.postimg.cc/q71QkbVQ/Chat-GPT-Image-Aug-16-2025-10-32-45-AM.png',
    'https://postimg.cc/ctdsjD1k'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
