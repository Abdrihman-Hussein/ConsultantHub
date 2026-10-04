import { useState } from 'react'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-28 w-28 text-2xl',
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-accent-50 ring-1 ring-line ${sizes[size]} ${className}`}
    >
      {/* Shimmer placeholder, visible until the image decodes. */}
      {showImage && !loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden bg-accent-100"
        >
          <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </span>
      )}

      {showImage ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-accent-700">
          {initials(name)}
        </span>
      )}
    </div>
  )
}
