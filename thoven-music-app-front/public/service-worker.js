const CACHE_NAME = 'thoven-v1'
const STATIC_CACHE_NAME = 'thoven-static-v1'
const DYNAMIC_CACHE_NAME = 'thoven-dynamic-v1'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME)
          .map(name => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - implement cache strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }
  
  // API calls - Network first, fallback to cache
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone()
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => cache.put(request, responseToCache))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }
  
  // Static assets - Cache first, fallback to network
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response
          
          return fetch(request).then(response => {
            // Don't cache non-success responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            const responseToCache = response.clone()
            caches.open(STATIC_CACHE_NAME)
              .then(cache => cache.put(request, responseToCache))
            
            return response
          })
        })
    )
    return
  }
  
  // HTML pages - Network first, fallback to cache, then offline page
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseToCache = response.clone()
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => cache.put(request, responseToCache))
        return response
      })
      .catch(() => 
        caches.match(request)
          .then(response => response || caches.match('/offline.html'))
      )
  )
})