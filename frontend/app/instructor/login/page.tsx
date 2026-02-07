"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QuintetLogo } from "@/components/quintet-logo"
import { useAuth } from "@/lib/auth-context"
import { loginInstructor } from "@/lib/api"

export default function InstructorLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await loginInstructor(email, password)
      login(res.access_token, res.role, res.user_id)
      router.push("/instructor/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-accent">
            <QuintetLogo className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">Quintet</span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Instructor Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your courses and students</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="instructor@university.edu" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
            </div>
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 disabled:opacity-50">
              {loading ? "Signing in…" : "Sign In as Instructor"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Instructor accounts are created by the Admin. Contact your administrator if you need access.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-accent hover:underline">{"← Back to Home"}</Link>
        </p>
      </div>
    </div>
  )
}
