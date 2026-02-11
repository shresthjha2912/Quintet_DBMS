"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getStudentProfile,
  browseCourses,
  getMyEnrolledCourses,
  enrollInCourse,
} from "@/lib/api"

interface Profile {
  student_id: number
  user_id: number
  email_id: string
  age: number
  skill_level: string
  category: string
  country: string
}

interface Course {
  course_id: number
  course_name: string
  duration: string
  program_type: string
  instructor_id: number
  university_id: number
}

interface Enrollment {
  student_id: number
  course_id: number
  evaluation_score: number
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [tab, setTab] = useState<"my-courses" | "browse">("my-courses")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const [p, c, e] = await Promise.all([
        getStudentProfile(),
        browseCourses(),
        getMyEnrolledCourses(),
      ])
      setProfile(p)
      setCourses(c)
      setEnrollments(e)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  async function handleEnroll(courseId: number) {
    if (!profile) return
    setEnrolling(courseId)
    setError("")
    try {
      await enrollInCourse(profile.student_id, courseId)
      const e = await getMyEnrolledCourses()
      setEnrollments(e)
      setTab("my-courses")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Enrollment failed")
    } finally {
      setEnrolling(null)
    }
  }

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id))
  const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.course_id))
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.has(c.course_id))

  const filteredBrowse = searchQuery
    ? availableCourses.filter((c) =>
        c.course_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : availableCourses

  const filteredEnrolled = searchQuery
    ? enrolledCourses.filter((c) =>
        c.course_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : enrolledCourses

  return (
    <DashboardShell role="student" title="Student Dashboard">
      {loading ? (
        <p className="text-muted-foreground">Loading your data…</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="space-y-8">

          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Your student account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Student ID</p>
                    <p className="font-medium">{profile.student_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Age</p>
                    <p className="font-medium">{profile.age}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Skill Level</p>
                    <Badge variant="secondary">{profile.skill_level}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Category</p>
                    <Badge variant="outline">{profile.category}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Country</p>
                    <p className="font-medium">{profile.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}


          <div className="relative">
            <Input
              placeholder="Search courses by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
              >
                
              </button>
            )}
          </div>


          <div className="flex gap-2">
            <Button
              variant={tab === "my-courses" ? "default" : "outline"}
              onClick={() => setTab("my-courses")}
            >
              My Courses ({enrollments.length})
            </Button>
            <Button
              variant={tab === "browse" ? "default" : "outline"}
              onClick={() => setTab("browse")}
            >
              Browse Courses ({availableCourses.length})
            </Button>
          </div>

          {tab === "my-courses" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEnrolled.length === 0 ? (
                <p className="col-span-full text-muted-foreground">
                  {searchQuery
                    ? `No enrolled courses starting with "${searchQuery}".`
                    : "You haven\u0027t enrolled in any courses yet. Click \"Browse Courses\" to get started!"}
                </p>
              ) : (
                filteredEnrolled.map((course) => {
                  const enrollment = enrollments.find((e) => e.course_id === course.course_id)
                  return (
                    <Card key={course.course_id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          <a href={`/courses/${course.course_id}`} className="hover:underline">{course.course_name}</a>
                        </CardTitle>
                        <CardDescription>{course.program_type}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Score</span>
                          <Badge variant="secondary">{enrollment?.evaluation_score ?? "N/A"}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}

          {tab === "browse" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBrowse.length === 0 ? (
                <p className="col-span-full text-muted-foreground">
                  {searchQuery
                    ? `No available courses starting with "${searchQuery}".`
                    : "You\u0027re enrolled in all available courses!"}
                </p>
              ) : (
                filteredBrowse.map((course) => (
                  <Card key={course.course_id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        <a href={`/courses/${course.course_id}`} className="hover:underline">{course.course_name}</a>
                      </CardTitle>
                      <CardDescription>{course.program_type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <Button
                        className="w-full"
                        size="sm"
                        disabled={enrolling === course.course_id}
                        onClick={() => handleEnroll(course.course_id)}
                      >
                        {enrolling === course.course_id ? "Enrolling…" : "Enroll"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  )
}
