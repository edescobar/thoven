"use client"

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  fallbackSrc = '/placeholder.svg'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // For very large SVGs, use regular img tag with lazy loading
  if (src.endsWith('.svg') && !src.startsWith('http')) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
      />
    )
  }

  // For optimizable images, use Next.js Image
  return (
    <div className={cn('relative', fill && 'w-full h-full', className)}>
      <Image
        src={imgSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || (fill ? '100vw' : undefined)}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill && 'object-cover'
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
    </div>
  )
}

// Lazy load wrapper for heavy images
export function LazyImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={false} />
}