"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { QuintetLogo } from "@/components/quintet-logo"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardShellProps {
  role: string
  title: string
  children: React.ReactNode
  navItems?: { label: string; href: string }[]
}

export function DashboardShell({ role, title, children, navItems }: DashboardShellProps) {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!user || user.role !== role) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-destructive">Access Denied</p>
        <p className="text-sm text-muted-foreground">You must be logged in as <span className="font-medium">{role}</span> to view this page.</p>
        <Link href={`/${role}/login`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <QuintetLogo className="h-8 w-8 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">Quintet</span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold capitalize text-primary">
              {role}
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {navItems?.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={logout} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              Logout
            </button>
          </div>
        </nav>
      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">{title}</h1>
        {children}
      </main>
    </div>
  )
}
