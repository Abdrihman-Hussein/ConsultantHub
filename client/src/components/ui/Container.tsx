import type { HTMLAttributes, ReactNode } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Container({ children, className = '', ...rest }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-shell px-5 sm:px-8 ${className}`} {...rest}>
      {children}
    </div>
  )
}
