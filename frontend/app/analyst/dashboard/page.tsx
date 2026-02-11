"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getStatistics,
  getCoursesSummary,
  getEnrollmentsSummary,
  getAnalystCourseDetail,
  getAnalystStudentDetail,
} from "@/lib/api"
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
  pass_count: number
  fail_count: number
  courses_per_university: { university: string; course_count: number }[]
  students_per_country: { country: string; student_count: number }[]
  students_per_skill_level: { skill_level: string; count: number }[]
  students_per_category: { category: string; count: number }[]
  score_distribution: { range: string; count: number }[]
  courses_per_program_type: { program_type: string; count: number }[]
  avg_score_per_program_type: { program_type: string; avg_score: number }[]
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
  max_score: number
  min_score: number
  pass_count: number
  fail_count: number
  content_count: number
}

interface EnrollmentsSummary {
  total_enrollments: number
  average_score: number
  max_score: number
  min_score: number
  top_5_courses_by_enrollment: { course_name: string; enrollment_count: number }[]
}

interface CourseDetail {
  course_id: number
  course_name: string
  program_type: string
  duration: string
  instructor_name: string | null
  instructor_expertise: string | null
  university_name: string | null
  enrollment_count: number
  average_score: number
  max_score: number
  min_score: number
  pass_count: number
  fail_count: number
  pass_rate: number
  topics: string[]
  textbooks: { title: string; author: string; link: string | null }[]
  content_by_type: { type: string; count: number }[]
  score_distribution: { range: string; count: number }[]
  skill_level_breakdown: { skill_level: string; count: number }[]
  enrolled_students: {
    student_id: number
    email: string
    age: number
    country: string
    skill_level: string
    category: string
    evaluation_score: number
  }[]
}

interface StudentDetail {
  student_id: number
  email: string
  age: number
  country: string
  skill_level: string
  category: string
  total_courses_enrolled: number
  average_score: number
  highest_score: number
  lowest_score: number
  pass_count: number
  fail_count: number
  enrollments: {
    course_id: number
    course_name: string
    program_type: string
    duration: string
    university_name: string | null
    instructor_name: string | null
    evaluation_score: number
  }[]
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

function scoreColor(score: number) {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-blue-500"
  if (score >= 40) return "text-yellow-500"
  return "text-red-500"
}

function scoreBadge(score: number) {
  if (score >= 80) return "default" as const
  if (score >= 40) return "secondary" as const
  return "destructive" as const
}

export default function AnalystDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([])
  const [enrollmentSummary, setEnrollmentSummary] = useState<EnrollmentsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null)
  const [courseDialogOpen, setCourseDialogOpen] = useState(false)
  const [courseLoading, setCourseLoading] = useState(false)

  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null)
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [studentLoading, setStudentLoading] = useState(false)

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

  async function openCourseDetail(courseId: number) {
    setCourseLoading(true)
    setCourseDialogOpen(true)
    setCourseDetail(null)
    try {
      const detail = await getAnalystCourseDetail(courseId)
      setCourseDetail(detail as unknown as CourseDetail)
    } catch {
      setCourseDetail(null)
    } finally {
      setCourseLoading(false)
    }
  }

  async function openStudentDetail(studentId: number) {
    setStudentLoading(true)
    setStudentDialogOpen(true)
    setStudentDetail(null)
    try {
      const detail = await getAnalystStudentDetail(studentId)
      setStudentDetail(detail as unknown as StudentDetail)
    } catch {
      setStudentDetail(null)
    } finally {
      setStudentLoading(false)
    }
  }

  const passRate = stats && stats.total_enrollments > 0
    ? Math.round((stats.pass_count / stats.total_enrollments) * 100)
    : 0

  return (
    <DashboardShell role="analyst" title="Analyst Dashboard">
      {loading ? (
        <p className="text-muted-foreground">Loading analytics…</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="space-y-8">

          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Students</CardDescription>
                  <CardTitle className="text-3xl">{stats.total_students}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">across {stats.students_per_country.length} countries</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Courses</CardDescription>
                  <CardTitle className="text-3xl">{stats.total_courses}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">at {stats.total_universities} universities</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Enrollments</CardDescription>
                  <CardTitle className="text-3xl">{stats.total_enrollments}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">avg {(stats.total_enrollments / (stats.total_courses || 1)).toFixed(1)} per course</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Score / Pass Rate</CardDescription>
                  <CardTitle className="text-3xl">
                    <span className={scoreColor(stats.average_evaluation_score)}>{stats.average_evaluation_score}</span>
                    <span className="text-lg text-muted-foreground ml-2">/ {passRate}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{stats.pass_count} passed · {stats.fail_count} failed (≥40 = pass)</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="students">Student Insights</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {stats && stats.score_distribution.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                      <CardDescription>How scores are spread across all enrollments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.score_distribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {stats.score_distribution.map((_, i) => (
                                <Cell key={i} fill={["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"][i]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {enrollmentSummary && enrollmentSummary.top_5_courses_by_enrollment.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Popular Courses</CardTitle>
                      <CardDescription>Top 5 by enrollment count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={enrollmentSummary.top_5_courses_by_enrollment} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="course_name" type="category" width={140} tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="enrollment_count" fill="#10b981" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats && stats.courses_per_university.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Courses per University</CardTitle>
                      <CardDescription>Distribution across institutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.courses_per_university}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="university" tick={{ fontSize: 10 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="course_count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats && stats.avg_score_per_program_type.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Avg Score by Program Type</CardTitle>
                      <CardDescription>Which program types perform best?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.avg_score_per_program_type}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="program_type" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="avg_score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              <p className="text-sm text-muted-foreground">Click any course card for detailed analytics, enrolled students, and score breakdowns.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courseSummary.map((c) => {
                  const cPassRate = c.enrollment_count > 0 ? Math.round((c.pass_count / c.enrollment_count) * 100) : 0
                  return (
                    <Card key={c.course_id} className="cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all" onClick={() => openCourseDetail(c.course_id)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{c.course_name}</CardTitle>
                            <CardDescription className="mt-1">{c.instructor_name ?? "No instructor"} · {c.university_name ?? "—"}</CardDescription>
                          </div>
                          <Badge variant="outline" className="shrink-0">{c.program_type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold">{c.enrollment_count}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Enrolled</p>
                          </div>
                          <div>
                            <p className={`text-lg font-bold ${scoreColor(c.average_score)}`}>{c.average_score}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Avg Score</p>
                          </div>
                          <div>
                            <p className={`text-lg font-bold ${cPassRate >= 50 ? "text-green-500" : "text-red-500"}`}>{cPassRate}%</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Pass Rate</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{c.duration}</span>
                          <span>{c.content_count} materials</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {stats && stats.students_per_country.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Students by Country</CardTitle>
                      <CardDescription>Geographic distribution of learners</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.students_per_country} dataKey="student_count" nameKey="country" cx="50%" cy="50%" outerRadius={100} label>
                              {stats.students_per_country.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

                {stats && stats.students_per_skill_level.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Students by Skill Level</CardTitle>
                      <CardDescription>Beginner vs Intermediate vs Advanced</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.students_per_skill_level} dataKey="count" nameKey="skill_level" cx="50%" cy="50%" innerRadius={50} outerRadius={100} label>
                              {stats.students_per_skill_level.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

                {stats && stats.students_per_category.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Students by Category</CardTitle>
                      <CardDescription>Interest area distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.students_per_category}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats && stats.courses_per_program_type.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Courses by Program Type</CardTitle>
                      <CardDescription>Certificate vs Degree vs Bootcamp</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.courses_per_program_type} dataKey="count" nameKey="program_type" cx="50%" cy="50%" outerRadius={90} label>
                              {stats.courses_per_program_type.map((_, i) => (
                                <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />
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
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {enrollmentSummary && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Average Score</CardDescription>
                      <CardTitle className={`text-3xl ${scoreColor(enrollmentSummary.average_score)}`}>{enrollmentSummary.average_score}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Highest Score</CardDescription>
                      <CardTitle className="text-3xl text-green-500">{enrollmentSummary.max_score}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Lowest Score</CardDescription>
                      <CardTitle className="text-3xl text-red-500">{enrollmentSummary.min_score}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Score Range</CardDescription>
                      <CardTitle className="text-3xl">{enrollmentSummary.max_score - enrollmentSummary.min_score}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Course Performance Comparison</CardTitle>
                  <CardDescription>Avg score &amp; enrollment per course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseSummary}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course_name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average_score" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="enrollment_count" name="Enrollments" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Details Table</CardTitle>
                  <CardDescription>Click any row for detailed analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 pr-4 font-medium text-muted-foreground">Course</th>
                          <th className="pb-2 pr-4 font-medium text-muted-foreground">Instructor</th>
                          <th className="pb-2 pr-4 font-medium text-muted-foreground">University</th>
                          <th className="pb-2 pr-4 text-center font-medium text-muted-foreground">Enrolled</th>
                          <th className="pb-2 pr-4 text-center font-medium text-muted-foreground">Avg</th>
                          <th className="pb-2 pr-4 text-center font-medium text-muted-foreground">High</th>
                          <th className="pb-2 pr-4 text-center font-medium text-muted-foreground">Low</th>
                          <th className="pb-2 text-center font-medium text-muted-foreground">Pass Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseSummary.map((c) => {
                          const pr = c.enrollment_count > 0 ? Math.round((c.pass_count / c.enrollment_count) * 100) : 0
                          return (
                            <tr key={c.course_id} className="border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => openCourseDetail(c.course_id)}>
                              <td className="py-2.5 pr-4 font-medium text-primary hover:underline">{c.course_name}</td>
                              <td className="py-2.5 pr-4">{c.instructor_name ?? "—"}</td>
                              <td className="py-2.5 pr-4 text-muted-foreground">{c.university_name ?? "—"}</td>
                              <td className="py-2.5 pr-4 text-center">{c.enrollment_count}</td>
                              <td className={`py-2.5 pr-4 text-center font-medium ${scoreColor(c.average_score)}`}>{c.average_score}</td>
                              <td className="py-2.5 pr-4 text-center text-green-500">{c.max_score}</td>
                              <td className="py-2.5 pr-4 text-center text-red-500">{c.min_score}</td>
                              <td className="py-2.5 text-center">
                                <Badge variant={pr >= 50 ? "default" : "destructive"}>{pr}%</Badge>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              {courseLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading course analytics…</div>
              ) : courseDetail ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{courseDetail.course_name}</DialogTitle>
                    <DialogDescription>{courseDetail.program_type} · {courseDetail.duration} · {courseDetail.university_name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold">{courseDetail.enrollment_count}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Students</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className={`text-2xl font-bold ${scoreColor(courseDetail.average_score)}`}>{courseDetail.average_score}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Avg Score</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className={`text-2xl font-bold ${courseDetail.pass_rate >= 50 ? "text-green-500" : "text-red-500"}`}>{courseDetail.pass_rate}%</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Pass Rate</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold">{courseDetail.max_score} - {courseDetail.min_score}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">High - Low</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {courseDetail.instructor_name && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Instructor</p>
                          <p className="font-medium">{courseDetail.instructor_name}</p>
                          {courseDetail.instructor_expertise && <Badge variant="secondary" className="mt-1">{courseDetail.instructor_expertise}</Badge>}
                        </div>
                      )}
                      {courseDetail.topics.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Topics Covered</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {courseDetail.topics.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                          </div>
                        </div>
                      )}
                      {courseDetail.textbooks.length > 0 && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium text-muted-foreground">Textbooks</p>
                          <div className="space-y-1 mt-1">
                            {courseDetail.textbooks.map((tb) => (
                              <p key={tb.title} className="text-sm">📖 <span className="font-medium">{tb.title}</span> <span className="text-muted-foreground">by {tb.author}</span></p>
                            ))}
                          </div>
                        </div>
                      )}
                      {courseDetail.content_by_type.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Content Materials</p>
                          <div className="flex gap-2 mt-1">
                            {courseDetail.content_by_type.map((ct) => <Badge key={ct.type} variant="secondary">{ct.count} {ct.type}s</Badge>)}
                          </div>
                        </div>
                      )}
                    </div>

                    {courseDetail.score_distribution.some(d => d.count > 0) && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Score Distribution</p>
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={courseDetail.score_distribution}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {courseDetail.score_distribution.map((_, i) => (
                                  <Cell key={i} fill={["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"][i]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {courseDetail.skill_level_breakdown.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Student Skill Levels</p>
                        <div className="flex gap-3">
                          {courseDetail.skill_level_breakdown.map((sl) => (
                            <Badge key={sl.skill_level} variant="outline" className="text-sm">{sl.skill_level}: {sl.count}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Enrolled Students ({courseDetail.enrolled_students.length})</p>
                      {courseDetail.enrolled_students.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {courseDetail.enrolled_students.map((s) => (
                            <div key={s.student_id} className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => { setCourseDialogOpen(false); setTimeout(() => openStudentDetail(s.student_id), 200) }}>
                              <div>
                                <p className="font-medium text-primary hover:underline">{s.email}</p>
                                <p className="text-xs text-muted-foreground">{s.skill_level} · {s.category} · Age {s.age} · {s.country}</p>
                              </div>
                              <Badge variant={scoreBadge(s.evaluation_score)}>{s.evaluation_score}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-muted-foreground">No course data found.</div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              {studentLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading student analytics…</div>
              ) : studentDetail ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{studentDetail.email}</DialogTitle>
                    <DialogDescription>Student Analytics</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div><p className="text-xs font-medium text-muted-foreground">Age</p><p className="font-medium">{studentDetail.age}</p></div>
                      <div><p className="text-xs font-medium text-muted-foreground">Country</p><p className="font-medium">{studentDetail.country}</p></div>
                      <div><p className="text-xs font-medium text-muted-foreground">Skill Level</p><Badge variant="secondary">{studentDetail.skill_level}</Badge></div>
                      <div><p className="text-xs font-medium text-muted-foreground">Category</p><Badge variant="outline">{studentDetail.category}</Badge></div>
                      <div><p className="text-xs font-medium text-muted-foreground">Student ID</p><p className="font-medium">#{studentDetail.student_id}</p></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold">{studentDetail.total_courses_enrolled}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Courses</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className={`text-2xl font-bold ${scoreColor(studentDetail.average_score)}`}>{studentDetail.average_score}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Avg Score</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold text-green-500">{studentDetail.highest_score}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Highest</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold text-red-500">{studentDetail.lowest_score}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Lowest</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Badge variant="default" className="text-sm">{studentDetail.pass_count} Passed</Badge>
                      <Badge variant="destructive" className="text-sm">{studentDetail.fail_count} Failed</Badge>
                      {studentDetail.total_courses_enrolled > 0 && (
                        <Badge variant="outline" className="text-sm">{Math.round((studentDetail.pass_count / studentDetail.total_courses_enrolled) * 100)}% Pass Rate</Badge>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Course Enrollments ({studentDetail.enrollments.length})</p>
                      {studentDetail.enrollments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Not enrolled in any courses.</p>
                      ) : (
                        <div className="space-y-2">
                          {studentDetail.enrollments.map((e) => (
                            <div key={e.course_id} className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => { setStudentDialogOpen(false); setTimeout(() => openCourseDetail(e.course_id), 200) }}>
                              <div>
                                <p className="font-medium text-primary hover:underline">{e.course_name}</p>
                                <p className="text-xs text-muted-foreground">{e.program_type} · {e.duration} · {e.university_name ?? "—"} · {e.instructor_name ?? "—"}</p>
                              </div>
                              <Badge variant={scoreBadge(e.evaluation_score)}>{e.evaluation_score}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setStudentDialogOpen(false)}>Close</Button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-muted-foreground">No student data found.</div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      )}
    </DashboardShell>
  )
}
