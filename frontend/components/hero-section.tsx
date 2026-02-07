"use client"

import { QuintetLogo } from "@/components/quintet-logo"

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-20 text-primary/[0.06]">
          <DatabaseIcon className="h-40 w-40" />
        </div>
        <div className="absolute bottom-10 right-16 text-accent/[0.08]">
          <ChartIcon className="h-32 w-32" />
        </div>
        <div className="absolute right-1/4 top-10 text-primary/[0.05]">
          <BookIcon className="h-24 w-24" />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          <QuintetLogo className="h-16 w-16 text-primary md:h-20 md:w-20" />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-wide text-primary">
            DBMS Academic Project
          </span>
        </div>

        <h1 className="mb-6 text-balance font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Quintet{" "}
          <span className="text-primary">{"–"}</span>{" "}
          A Unified Learning & Database Management Platform
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          A comprehensive DBMS-based learning system that empowers students, instructors,
          administrators, and analysts through a single, unified platform. Select your role below to get started.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#roles"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Choose Your Role
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
