import Link from "next/link"
import { QuintetLogo } from "@/components/quintet-logo"

export default function StudentLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-primary">
            <QuintetLogo className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">Quintet</span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Student Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access your courses and assignments</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input id="email" type="email" placeholder="student@university.edu" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input id="password" type="password" placeholder="Enter your password" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button type="submit" className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
              Sign In as Student
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <a href="#" className="font-medium text-primary hover:underline">Sign Up</a>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">{"← Back to Home"}</Link>
        </p>
      </div>
    </div>
  )
}
