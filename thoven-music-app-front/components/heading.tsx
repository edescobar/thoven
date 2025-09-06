import type React from "react"

export const H1 = ({ children }: { children: React.ReactNode }) => (
  <h1 className="font-display font-bold leading-[0.95] tracking-[-0.015em] text-5xl sm:text-6xl lg:text-7xl">
    {children}
  </h1>
)

export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="font-sans font-bold text-amber-500">{children}</span>
)
