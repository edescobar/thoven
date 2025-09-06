import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Only register in production
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
              console.log('Service Worker registered:', registration)
              
              // Check for updates periodically
              setInterval(() => {
                registration.update()
              }, 60 * 60 * 1000) // Check every hour
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error)
            })
        })
        
        // Handle service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      }
    }
  }, [])
}