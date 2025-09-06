import { useState, useEffect, useCallback, useRef } from 'react'
import { getCache, createCacheKey } from '@/lib/cache'

interface UseCachedDataOptions<T> {
  key: (string | number | undefined)[]
  fetcher: () => Promise<T>
  ttl?: number
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  refreshInterval?: number
  fallbackData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseCachedDataResult<T> {
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
  isValidating: boolean
  mutate: (data?: T | Promise<T>) => Promise<T | undefined>
  revalidate: () => Promise<T | undefined>
}

export function useCachedData<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000,
  revalidateOnFocus = true,
  revalidateOnReconnect = true,
  refreshInterval,
  fallbackData,
  onSuccess,
  onError
}: UseCachedDataOptions<T>): UseCachedDataResult<T> {
  const cache = getCache()
  const cacheKey = createCacheKey(key)
  
  const [data, setData] = useState<T | undefined>(() => {
    const cached = cache.get<T>(cacheKey)
    return cached ?? fallbackData
  })
  
  const [error, setError] = useState<Error | undefined>()
  const [isLoading, setIsLoading] = useState(!data)
  const [isValidating, setIsValidating] = useState(false)
  
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  
  const revalidate = useCallback(async () => {
    if (!cacheKey) return undefined
    
    setIsValidating(true)
    setError(undefined)
    
    try {
      const newData = await fetcherRef.current()
      cache.set(cacheKey, newData, ttl)
      setData(newData)
      onSuccess?.(newData)
      return newData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch data')
      setError(error)
      onError?.(error)
      return undefined
    } finally {
      setIsLoading(false)
      setIsValidating(false)
    }
  }, [cacheKey, cache, ttl, onSuccess, onError])
  
  const mutate = useCallback(async (newData?: T | Promise<T>) => {
    if (!cacheKey) return undefined
    
    if (newData !== undefined) {
      // Optimistic update
      if (!(newData instanceof Promise)) {
        setData(newData)
        cache.set(cacheKey, newData, ttl)
        return newData
      }
      
      // Wait for promise
      try {
        const resolved = await newData
        setData(resolved)
        cache.set(cacheKey, resolved, ttl)
        return resolved
      } catch (err) {
        // Revalidate on error
        return revalidate()
      }
    }
    
    return revalidate()
  }, [cacheKey, cache, ttl, revalidate])
  
  // Initial load
  useEffect(() => {
    if (!cacheKey) return
    
    const cached = cache.get<T>(cacheKey)
    if (!cached) {
      revalidate()
    } else {
      setData(cached)
      setIsLoading(false)
    }
  }, [cacheKey])
  
  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus || !cacheKey) return
    
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        revalidate()
      }
    }
    
    document.addEventListener('visibilitychange', handleFocus)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleFocus)
      window.removeEventListener('focus', handleFocus)
    }
  }, [revalidateOnFocus, revalidate, cacheKey])
  
  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect || !cacheKey) return
    
    const handleOnline = () => revalidate()
    
    window.addEventListener('online', handleOnline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [revalidateOnReconnect, revalidate, cacheKey])
  
  // Refresh interval
  useEffect(() => {
    if (!refreshInterval || !cacheKey) return
    
    const interval = setInterval(revalidate, refreshInterval)
    
    return () => clearInterval(interval)
  }, [refreshInterval, revalidate, cacheKey])
  
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    revalidate
  }
}