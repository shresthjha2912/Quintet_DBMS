"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QuintetLogo } from "@/components/quintet-logo"
import { useAuth } from "@/lib/auth-context"
import { signupStudent } from "@/lib/api"

export default function StudentSignup() {
  const [form, setForm] = useState({
    email_id: "",
    password: "",
    age: "",
    skill_level: "Beginner",
    category: "Undergraduate",
    country: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await signupStudent({
        email_id: form.email_id,
        password: form.password,
        age: parseInt(form.age),
        skill_level: form.skill_level,
        category: form.category,
        country: form.country,
      })
      login(res.access_token, res.role, res.user_id)
      router.push("/student/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-primary">
            <QuintetLogo className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">Quintet</span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Create Student Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in your details to get started</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input id="email" type="email" required value={form.email_id} onChange={(e) => update("email_id", e.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input id="password" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 6 characters" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-foreground">Age</label>
                <input id="age" type="number" required min={15} max={80} value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="21" className={inputClass} />
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-foreground">Country</label>
                <input id="country" type="text" required value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="India" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="skill" className="mb-1.5 block text-sm font-medium text-foreground">Skill Level</label>
              <select id="skill" value={form.skill_level} onChange={(e) => update("skill_level", e.target.value)} className={inputClass}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
              <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/student/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">{"← Back to Home"}</Link>
        </p>
      </div>
    </div>
  )
}
