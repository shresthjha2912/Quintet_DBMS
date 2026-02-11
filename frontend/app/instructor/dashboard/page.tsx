"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getInstructorProfile, getInstructorCourses } from "@/lib/api"

interface Profile {
  instructor_id: number
  user_id: number
  email_id: string
  name: string
  expertise: string
}

interface Course {
  course_id: number
  course_name: string
  duration: string
  program_type: string
  instructor_id: number
  university_id: number
}

export default function InstructorDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [p, c] = await Promise.all([
          getInstructorProfile(),
          getInstructorCourses(),
        ])
        setProfile(p)
        setCourses(c)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardShell role="instructor" title="Instructor Dashboard">
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
                <CardDescription>Your instructor account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Instructor ID</p>
                    <p className="font-medium">{profile.instructor_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Expertise</p>
                    <Badge variant="secondary">{profile.expertise}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}


          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              My Courses ({courses.length})
            </h2>
            {courses.length === 0 ? (
              <p className="text-muted-foreground">
                No courses assigned yet. Contact the administrator.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.course_id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        <a href={`/courses/${course.course_id}`} className="hover:underline">{course.course_name}</a>
                      </CardTitle>
                      <CardDescription>Course #{course.course_id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Program Type</span>
                        <Badge variant="outline">{course.program_type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">University ID</span>
                        <span className="font-medium">{course.university_id}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
