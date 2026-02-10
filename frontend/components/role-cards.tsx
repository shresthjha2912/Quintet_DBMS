"use client"

import Link from "next/link"

const roles = [
  {
    title: "Student",
    description: "Browse courses, enroll in classes, track your progress, and submit assignments.",
    href: "/student/login",
    color: "bg-primary",
    lightBg: "bg-primary/10",
    textColor: "text-primary",
    buttonText: "text-primary-foreground",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    title: "Instructor",
    description: "Create courses, manage content, grade assignments, and track student performance.",
    href: "/instructor/login",
    color: "bg-accent",
    lightBg: "bg-accent/10",
    textColor: "text-accent",
    buttonText: "text-primary-foreground",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Admin",
    description: "Manage users, configure system settings, oversee departments, and maintain the platform.",
    href: "/admin/login",
    color: "bg-foreground dark:bg-slate-200",
    lightBg: "bg-foreground/10",
    textColor: "text-foreground",
    buttonText: "text-background dark:text-slate-900",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: "Analyst",
    description: "Access analytics dashboards, generate reports, and gain insights from platform data.",
    href: "/analyst/login",
    color: "bg-chart-2",
    lightBg: "bg-accent/10",
    textColor: "text-accent",
    buttonText: "text-primary-foreground",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
  },
]

export function RoleCards() {
  return (
    <section id="roles" className="bg-secondary/50 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Select Your Role
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Choose how you want to access the platform. Each role provides a tailored experience with dedicated tools and dashboards.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className="group relative flex flex-col rounded-xl border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${role.lightBg} ${role.textColor} transition-all duration-300 group-hover:scale-110`}>
                {role.icon}
              </div>
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                {role.title}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
              <div className={`mx-auto inline-flex items-center gap-2 rounded-lg ${role.color} px-6 py-2.5 text-sm font-semibold ${role.buttonText} transition-all group-hover:gap-3`}>
                Sign In
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638l-3.96-3.96a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l3.96-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
