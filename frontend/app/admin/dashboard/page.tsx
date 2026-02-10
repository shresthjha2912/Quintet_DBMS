"use client"

import { useEffect, useState, useCallback } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  adminGetInstructors,
  adminCreateInstructor,
  adminGetStudents,
  adminDeleteStudent,
  adminDeleteInstructor,
  adminCreateCourse,
  adminDeleteCourse,
  adminGetInstructorDetail,
  adminGetStudentDetail,
  adminGetCourseDetail,
  getPublicCourses,
} from "@/lib/api"

/* ---------- types ---------- */
interface Instructor {
  instructor_id: number
  user_id: number
  name: string
  expertise: string
  email_id?: string
}

interface Student {
  student_id: number
  user_id: number
  email_id?: string
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

/* ---------- Detail types ---------- */
interface InstructorDetail {
  instructor_id: number
  user_id: number
  email_id: string
  name: string
  expertise: string
  courses: { course_id: number; course_name: string; duration: string; program_type: string }[]
}

interface StudentDetail {
  student_id: number
  user_id: number
  email_id: string
  age: number
  skill_level: string
  category: string
  country: string
  enrollments: { course_id: number; course_name: string | null; evaluation_score: number }[]
}

interface CourseDetail {
  course_id: number
  course_name: string
  duration: string
  program_type: string
  instructor_id: number | null
  instructor_name: string
  instructor_email: string | null
  university_id: number
  university_name: string
  enrolled_students: { student_id: number; student_email: string | null; evaluation_score: number }[]
}

/* ---------- page ---------- */
export default function AdminDashboard() {
  const [tab, setTab] = useState<"instructors" | "courses" | "students">("instructors")

  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Detail state
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorDetail | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [i, s, c] = await Promise.all([
        adminGetInstructors(),
        adminGetStudents(),
        getPublicCourses(),
      ])
      setInstructors(i)
      setStudents(s)
      setCourses(c)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function openInstructorDetail(id: number) {
    setDetailLoading(true)
    setDetailOpen(true)
    setSelectedStudent(null)
    setSelectedCourse(null)
    try {
      const data = await adminGetInstructorDetail(id)
      setSelectedInstructor(data)
    } catch {
      setSelectedInstructor(null)
    } finally {
      setDetailLoading(false)
    }
  }

  async function openStudentDetail(id: number) {
    setDetailLoading(true)
    setDetailOpen(true)
    setSelectedInstructor(null)
    setSelectedCourse(null)
    try {
      const data = await adminGetStudentDetail(id)
      setSelectedStudent(data)
    } catch {
      setSelectedStudent(null)
    } finally {
      setDetailLoading(false)
    }
  }

  async function openCourseDetail(id: number) {
    setDetailLoading(true)
    setDetailOpen(true)
    setSelectedInstructor(null)
    setSelectedStudent(null)
    try {
      const data = await adminGetCourseDetail(id)
      setSelectedCourse(data)
    } catch {
      setSelectedCourse(null)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <DashboardShell role="admin" title="Admin Dashboard">
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="cursor-pointer hover:ring-2 hover:ring-primary/30" onClick={() => setTab("instructors")}>
              <CardHeader className="pb-2">
                <CardDescription>Instructors</CardDescription>
                <CardTitle className="text-3xl">{instructors.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:ring-2 hover:ring-primary/30" onClick={() => setTab("courses")}>
              <CardHeader className="pb-2">
                <CardDescription>Courses</CardDescription>
                <CardTitle className="text-3xl">{courses.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:ring-2 hover:ring-primary/30" onClick={() => setTab("students")}>
              <CardHeader className="pb-2">
                <CardDescription>Students</CardDescription>
                <CardTitle className="text-3xl">{students.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2">
            {(["instructors", "courses", "students"] as const).map((t) => (
              <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)} className="capitalize">
                {t}
              </Button>
            ))}
          </div>

          {/* ── Instructors tab ── */}
          {tab === "instructors" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Instructors</h2>
                <CreateInstructorDialog onCreated={refresh} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {instructors.map((i) => (
                  <Card key={i.instructor_id} className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => openInstructorDetail(i.instructor_id)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{i.name}</CardTitle>
                      <CardDescription>ID: {i.instructor_id} · {i.email_id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">{i.expertise}</Badge>
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (!confirm(`Remove instructor ${i.name}?`)) return
                            await adminDeleteInstructor(i.instructor_id)
                            refresh()
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Courses tab ── */}
          {tab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Courses</h2>
                <CreateCourseDialog onCreated={refresh} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                  <Card key={c.course_id} className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => openCourseDetail(c.course_id)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{c.course_name}</CardTitle>
                      <CardDescription>{c.program_type} · {c.duration}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Instructor #{c.instructor_id} · Univ #{c.university_id}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!confirm(`Delete course "${c.course_name}"?`)) return
                          await adminDeleteCourse(c.course_id)
                          refresh()
                        }}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Students tab ── */}
          {tab === "students" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Students</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((s) => (
                  <Card key={s.student_id} className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => openStudentDetail(s.student_id)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{s.email_id ?? `Student #${s.student_id}`}</CardTitle>
                      <CardDescription>{s.category} &middot; {s.skill_level}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Age {s.age} &middot; {s.country}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!confirm(`Remove student #${s.student_id}?`)) return
                          await adminDeleteStudent(s.student_id)
                          refresh()
                        }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Detail Dialog ── */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {detailLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading details...</div>
              ) : selectedInstructor ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedInstructor.name}</DialogTitle>
                    <DialogDescription>Instructor Details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedInstructor.email_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Instructor ID</p>
                        <p className="font-medium">{selectedInstructor.instructor_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Expertise</p>
                        <Badge variant="secondary">{selectedInstructor.expertise}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">User ID</p>
                        <p className="font-medium">{selectedInstructor.user_id}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Assigned Courses ({selectedInstructor.courses.length})
                      </h3>
                      {selectedInstructor.courses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No courses assigned.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedInstructor.courses.map((c) => (
                            <div key={c.course_id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{c.course_name}</p>
                                <p className="text-xs text-muted-foreground">{c.program_type} &middot; {c.duration}</p>
                              </div>
                              <Badge variant="outline">#{c.course_id}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : selectedStudent ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedStudent.email_id}</DialogTitle>
                    <DialogDescription>Student Details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedStudent.email_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Student ID</p>
                        <p className="font-medium">{selectedStudent.student_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Age</p>
                        <p className="font-medium">{selectedStudent.age}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Country</p>
                        <p className="font-medium">{selectedStudent.country}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Skill Level</p>
                        <Badge variant="secondary">{selectedStudent.skill_level}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Category</p>
                        <Badge variant="outline">{selectedStudent.category}</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Enrolled Courses ({selectedStudent.enrollments.length})
                      </h3>
                      {selectedStudent.enrollments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Not enrolled in any courses.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedStudent.enrollments.map((e) => (
                            <div key={e.course_id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{e.course_name ?? `Course #${e.course_id}`}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant={e.evaluation_score > 0 ? "default" : "secondary"}>
                                  Score: {e.evaluation_score}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : selectedCourse ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedCourse.course_name}</DialogTitle>
                    <DialogDescription>Course Details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Course ID</p>
                        <p className="font-medium">{selectedCourse.course_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Program Type</p>
                        <Badge variant="outline">{selectedCourse.program_type}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Duration</p>
                        <p className="font-medium">{selectedCourse.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">University</p>
                        <p className="font-medium">{selectedCourse.university_name}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-muted-foreground">Instructor</p>
                        <p className="font-medium">
                          {selectedCourse.instructor_name}
                          {selectedCourse.instructor_email && (
                            <span className="text-xs text-muted-foreground ml-2">({selectedCourse.instructor_email})</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Enrolled Students ({selectedCourse.enrolled_students.length})
                      </h3>
                      {selectedCourse.enrolled_students.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedCourse.enrolled_students.map((s) => (
                            <div key={s.student_id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{s.student_email ?? `Student #${s.student_id}`}</p>
                              </div>
                              <Badge variant={s.evaluation_score > 0 ? "default" : "secondary"}>
                                Score: {s.evaluation_score}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No details available.</div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </DashboardShell>
  )
}

/* ===== Dialogs ===== */

function CreateInstructorDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ email_id: "", password: "", name: "", expertise: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminCreateInstructor(form)
      setOpen(false)
      setForm({ email_id: "", password: "", name: "", expertise: "" })
      onCreated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Instructor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Instructor</DialogTitle>
          <DialogDescription>Fill in the details below to create a new instructor account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inst-email">Email</Label>
            <Input id="inst-email" type="email" required value={form.email_id} onChange={(e) => setForm({ ...form, email_id: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inst-pass">Password</Label>
            <Input id="inst-pass" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inst-name">Name</Label>
            <Input id="inst-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inst-exp">Expertise</Label>
            <Input id="inst-exp" required value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Creating…" : "Create Instructor"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CreateCourseDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    course_name: "",
    duration: "",
    program_type: "",
    instructor_id: "",
    university_id: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminCreateCourse({
        course_name: form.course_name,
        duration: form.duration,
        program_type: form.program_type,
        instructor_id: Number(form.instructor_id),
        university_id: Number(form.university_id),
      })
      setOpen(false)
      setForm({ course_name: "", duration: "", program_type: "", instructor_id: "", university_id: "" })
      onCreated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>Fill in the details below to add a new course.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="c-name">Course Name</Label>
            <Input id="c-name" required value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-dur">Duration</Label>
            <Input id="c-dur" placeholder="e.g. 12 weeks" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-type">Program Type</Label>
            <Input id="c-type" placeholder="e.g. Certificate" required value={form.program_type} onChange={(e) => setForm({ ...form, program_type: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="c-inst">Instructor ID</Label>
              <Input id="c-inst" type="number" required value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-uni">University ID</Label>
              <Input id="c-uni" type="number" required value={form.university_id} onChange={(e) => setForm({ ...form, university_id: e.target.value })} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Creating…" : "Create Course"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
