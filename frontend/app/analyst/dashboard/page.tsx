"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStatistics, getCoursesSummary, getEnrollmentsSummary } from "@/lib/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

/* ---------- types ---------- */
interface Statistics {
  total_students: number
  total_instructors: number
  total_courses: number
  total_enrollments: number
  total_universities: number
  total_contents: number
  average_evaluation_score: number
  courses_per_university: { university: string; course_count: number }[]
  students_per_country: { country: string; student_count: number }[]
}

interface CourseSummary {
  course_id: number
  course_name: string
  program_type: string
  duration: string
  instructor_name: string | null
  university_name: string | null
  enrollment_count: number
  average_score: number
}

interface EnrollmentsSummary {
  total_enrollments: number
  average_score: number
  max_score: number
  min_score: number
  top_5_courses_by_enrollment: { course_name: string; enrollment_count: number }[]
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

export default function AnalystDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([])
  const [enrollmentSummary, setEnrollmentSummary] = useState<EnrollmentsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [s, cs, es] = await Promise.all([
          getStatistics(),
          getCoursesSummary(),
          getEnrollmentsSummary(),
        ])
        setStats(s as unknown as Statistics)
        setCourseSummary(cs as unknown as CourseSummary[])
        setEnrollmentSummary(es as unknown as EnrollmentsSummary)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardShell role="analyst" title="Analyst Dashboard">
      {loading ? (
        <p className="text-muted-foreground">Loading analytics…</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="space-y-10">
          {/* ── KPI cards ── */}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Students", value: stats.total_students },
                { label: "Instructors", value: stats.total_instructors },
                { label: "Courses", value: stats.total_courses },
                { label: "Enrollments", value: stats.total_enrollments },
                { label: "Universities", value: stats.total_universities },
                { label: "Content Items", value: stats.total_contents },
                { label: "Avg Score", value: stats.average_evaluation_score },
              ].map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="pb-2">
                    <CardDescription>{kpi.label}</CardDescription>
                    <CardTitle className="text-3xl">{kpi.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* ── Courses per University bar chart ── */}
          {stats && stats.courses_per_university.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Courses per University</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.courses_per_university}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="university" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="course_count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Students per Country pie chart ── */}
          {stats && stats.students_per_country.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Students per Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.students_per_country}
                        dataKey="student_count"
                        nameKey="country"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {stats.students_per_country.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Enrollment Summary ── */}
          {enrollmentSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Summary</CardTitle>
                <CardDescription>Aggregate enrollment statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Enrollments</p>
                    <p className="text-2xl font-bold">{enrollmentSummary.total_enrollments}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold">{enrollmentSummary.average_score}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Max Score</p>
                    <p className="text-2xl font-bold">{enrollmentSummary.max_score}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Min Score</p>
                    <p className="text-2xl font-bold">{enrollmentSummary.min_score}</p>
                  </div>
                </div>

                {/* Top 5 most enrolled courses chart */}
                {enrollmentSummary.top_5_courses_by_enrollment.length > 0 && (
                  <div className="mt-6 h-64">
                    <p className="mb-2 text-sm font-semibold text-muted-foreground">Top 5 Most Enrolled Courses</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={enrollmentSummary.top_5_courses_by_enrollment} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="course_name" type="category" width={150} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="enrollment_count" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Course Summary Table ── */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Per-course enrollment and score data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Course</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Instructor</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">University</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Type</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Duration</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Enrolled</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseSummary.map((c) => (
                      <tr key={c.course_id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{c.course_name}</td>
                        <td className="py-2 pr-4">{c.instructor_name ?? "—"}</td>
                        <td className="py-2 pr-4">{c.university_name ?? "—"}</td>
                        <td className="py-2 pr-4">
                          <Badge variant="outline">{c.program_type}</Badge>
                        </td>
                        <td className="py-2 pr-4">{c.duration}</td>
                        <td className="py-2 pr-4 text-right">{c.enrollment_count}</td>
                        <td className="py-2 text-right font-medium">{c.average_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
