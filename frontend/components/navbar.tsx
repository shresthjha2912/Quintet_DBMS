"use client"

import { QuintetLogo } from "@/components/quintet-logo"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <QuintetLogo className="h-9 w-9 text-primary" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Quintet
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#roles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Roles
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About
          </a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#roles"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  )
}
