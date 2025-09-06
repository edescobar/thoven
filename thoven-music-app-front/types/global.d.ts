// Global type definitions for third-party libraries

interface Window {
  dataLayer?: any[]
  mixpanel?: {
    track: (event: string, properties?: Record<string, any>) => void
    identify: (id: string) => void
    people: {
      set: (properties: Record<string, any>) => void
    }
    reset: () => void
  }
}