import { QuintetLogo } from "@/components/quintet-logo"

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <QuintetLogo className="h-7 w-7 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">Quintet</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>Database Management Systems Project</span>
            <span className="hidden h-4 w-px bg-border md:block" aria-hidden="true" />
            <span>Academic Year 2025{"-"}2026</span>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Built with Next.js & Tailwind CSS {"·"} A University DBMS Project
        </div>
      </div>
    </footer>
  )
}
