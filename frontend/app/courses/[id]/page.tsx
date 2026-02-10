"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  getCourseStudents,
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrolledCourses,
  gradeStudent,
  getCourseContent,
  getPublicCourses,
  getCourseTextbooks,
  addCourseContent,
  deleteCourseContent,
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContentItem {
  content_id: number
  course_id: number
  type: string
  content_url: string
}

interface TextbookItem {
  textbook_id: number
  title: string
  author: string
  link: string | null
}

interface StudentEnrollment {
  student_id: number
  course_id: number
  evaluation_score: number | null
  student_name?: string | null
  student_email?: string | null
}

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function typeIcon(type: string) {
  switch (type) {
    case "video": return "��"
    case "pdf": return "📄"
    case "article": return "📰"
    case "link": return "🔗"
    case "quiz": return "📝"
    default: return "📎"
  }
}

export default function CoursePage() {
  const params = useParams()
  const courseId = Number(params.id)
  const { user } = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [course, setCourse] = useState<any | null>(null)
  const [students, setStudents] = useState<StudentEnrollment[]>([])
  const [contents, setContents] = useState<ContentItem[]>([])
  const [textbooks, setTextbooks] = useState<TextbookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [gradeInputs, setGradeInputs] = useState<Record<number, string>>({})
  const [gradingId, setGradingId] = useState<number | null>(null)

  // Video selector — which video to play
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null)

  // Instructor: add content form
  const [newContentType, setNewContentType] = useState("video")
  const [newContentUrl, setNewContentUrl] = useState("")
  const [addingContent, setAddingContent] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user])

  async function load() {
    setLoading(true)
    try {
      // Use public courses endpoint — works for all roles
      const courses = await getPublicCourses()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = courses.find((x: any) => x.course_id === courseId)
      setCourse(c || null)

      // fetch content for everyone
      try {
        const ct = await getCourseContent(courseId)
        setContents(ct)
        // Default to first video
        const firstVideo = ct.find((item: ContentItem) => item.type === "video")
        if (firstVideo) setActiveVideoId(firstVideo.content_id)
      } catch {
        setContents([])
      }

      // fetch textbooks (public endpoint, no auth needed)
      try {
        const tb = await getCourseTextbooks(courseId)
        setTextbooks(tb)
      } catch {
        setTextbooks([])
      }

      if (user?.role === "instructor") {
        const s = await getCourseStudents(courseId)
        setStudents(s)
      }

      // Check if student is enrolled in this course
      if (user?.role === "student") {
        try {
          const enrollments = await getMyEnrolledCourses()
          const enrolled = enrollments.some((e: { course_id: number }) => e.course_id === courseId)
          setIsEnrolled(enrolled)
        } catch {
          setIsEnrolled(false)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  async function handleEnroll() {
    if (!user || user.role !== "student") return
    try {
      const { getStudentProfile } = await import("@/lib/api")
      const profile = await getStudentProfile()
      await enrollInCourse(profile.student_id, courseId)
      setIsEnrolled(true)
      alert("Enrolled successfully!")
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to enroll")
    }
  }

  async function handleUnenroll() {
    if (!user || user.role !== "student") return
    if (!confirm("Are you sure you want to unenroll from this course?")) return
    try {
      await unenrollFromCourse(courseId)
      setIsEnrolled(false)
      alert("Unenrolled successfully!")
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to unenroll")
    }
  }

  async function handleGrade(student_id: number) {
    const scoreStr = gradeInputs[student_id]
    if (!scoreStr) return alert("Enter a score first")
    const score = Number(scoreStr)
    if (Number.isNaN(score) || score < 0 || score > 100) return alert("Score must be 0-100")
    setGradingId(student_id)
    try {
      await gradeStudent(courseId, student_id, score)
      const s = await getCourseStudents(courseId)
      setStudents(s)
      setGradeInputs((prev) => {
        const next = { ...prev }
        delete next[student_id]
        return next
      })
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save grade")
    } finally {
      setGradingId(null)
    }
  }

  async function handleAddContent() {
    if (!newContentUrl.trim()) return alert("Enter a URL")
    setAddingContent(true)
    try {
      await addCourseContent(courseId, newContentType, newContentUrl.trim())
      setNewContentUrl("")
      // Refresh content list
      const ct = await getCourseContent(courseId)
      setContents(ct)
      // If we just added the first video, select it
      if (newContentType === "video" && !activeVideoId) {
        const firstVideo = ct.find((item: ContentItem) => item.type === "video")
        if (firstVideo) setActiveVideoId(firstVideo.content_id)
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to add content")
    } finally {
      setAddingContent(false)
    }
  }

  async function handleDeleteContent(contentId: number) {
    if (!confirm("Delete this content item?")) return
    try {
      await deleteCourseContent(courseId, contentId)
      const ct = await getCourseContent(courseId)
      setContents(ct)
      if (activeVideoId === contentId) {
        const firstVideo = ct.find((item: ContentItem) => item.type === "video")
        setActiveVideoId(firstVideo ? firstVideo.content_id : null)
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete content")
    }
  }

  if (!loading && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Course not found.</p>
      </div>
    )
  }

  const role = user?.role ?? "student"
  const videos = contents.filter((c) => c.type === "video")
  const nonVideos = contents.filter((c) => c.type !== "video")
  const activeVideo = videos.find((v) => v.content_id === activeVideoId) || null
  const activeEmbed = activeVideo ? youtubeEmbedUrl(activeVideo.content_url) : null

  return (
    <DashboardShell role={role} title={course?.course_name ?? "Course"}>
      {loading ? (
        <p className="text-muted-foreground">Loading course…</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="space-y-8">
          {/* Course info card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{course.course_name}</CardTitle>
                  <CardDescription className="mt-1">
                    {course.program_type} · {course.duration} · Instructor #{course.instructor_id} · University #{course.university_id}
                  </CardDescription>
                </div>
                {user?.role === "student" && (
                  isEnrolled ? (
                    <Button variant="destructive" onClick={handleUnenroll}>Unenroll</Button>
                  ) : (
                    <Button onClick={handleEnroll}>Enroll</Button>
                  )
                )}
              </div>
            </CardHeader>
          </Card>

          {/* ── Textbooks ── */}
          {textbooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📚 Textbooks</CardTitle>
                <CardDescription>{textbooks.length} textbook{textbooks.length !== 1 ? "s" : ""} linked to this course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {textbooks.map((tb) => (
                    <div key={tb.textbook_id} className="flex items-start gap-3 rounded-lg border p-4">
                      <span className="text-2xl">📖</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{tb.title}</p>
                        <p className="text-xs text-muted-foreground">by {tb.author}</p>
                        {tb.link ? (
                          <a
                            href={tb.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            View Textbook ↗
                          </a>
                        ) : (
                          <p className="mt-1 text-xs text-muted-foreground italic">No link available</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Video Player with Selector ── */}
          {videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🎬 Video Lectures</CardTitle>
                <CardDescription>
                  {videos.length} video{videos.length !== 1 ? "s" : ""} available — select one to watch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video selector tabs */}
                <div className="flex flex-wrap gap-2">
                  {videos.map((v, idx) => (
                    <Button
                      key={v.content_id}
                      size="sm"
                      variant={activeVideoId === v.content_id ? "default" : "outline"}
                      onClick={() => setActiveVideoId(v.content_id)}
                    >
                      Video {idx + 1}
                    </Button>
                  ))}
                </div>

                {/* Active video embed */}
                {activeVideo && (
                  <div className="space-y-2">
                    {activeEmbed ? (
                      <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-lg border">
                        <iframe
                          src={activeEmbed}
                          title="Video Lecture"
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={activeVideo.content_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        {activeVideo.content_url}
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground truncate">{activeVideo.content_url}</p>
                    {user?.role === "instructor" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteContent(activeVideo.content_id)}
                      >
                        Remove Video
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Other Resources ── */}
          {nonVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>{nonVideos.length} resource{nonVideos.length !== 1 ? "s" : ""}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {nonVideos.map((item) => (
                    <div key={item.content_id} className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-secondary">
                      <a
                        href={item.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <span className="text-2xl">{typeIcon(item.type)}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium capitalize">{item.type}</span>
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {item.content_url}
                          </p>
                        </div>
                        <span className="text-muted-foreground">↗</span>
                      </a>
                      {user?.role === "instructor" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive shrink-0"
                          onClick={() => handleDeleteContent(item.content_id)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Instructor: Add Content ── */}
          {user?.role === "instructor" && (
            <Card>
              <CardHeader>
                <CardTitle>Add Course Material</CardTitle>
                <CardDescription>Add a new video, PDF, article, or link to this course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="w-full sm:w-40">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Type</label>
                    <Select value={newContentType} onValueChange={setNewContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">🎬 Video</SelectItem>
                        <SelectItem value="pdf">📄 PDF</SelectItem>
                        <SelectItem value="article">📰 Article</SelectItem>
                        <SelectItem value="link">🔗 Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">URL</label>
                    <Input
                      placeholder="https://..."
                      value={newContentUrl}
                      onChange={(e) => setNewContentUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddContent()}
                    />
                  </div>
                  <Button onClick={handleAddContent} disabled={addingContent} className="shrink-0">
                    {addingContent ? "Adding…" : "Add Material"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Enrolled Students (instructor only) ── */}
          {user?.role === "instructor" && (
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>{students.length} student{students.length !== 1 ? "s" : ""} enrolled</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-5">Student</div>
                      <div className="col-span-2 text-center">Current Score</div>
                      <div className="col-span-3 text-center">New Score</div>
                      <div className="col-span-2 text-center">Action</div>
                    </div>
                    {students.map((s) => (
                      <div key={s.student_id} className="grid grid-cols-12 items-center gap-2 rounded-lg border p-4">
                        <div className="col-span-5">
                          <p className="font-medium">{s.student_email ?? `Student #${s.student_id}`}</p>
                          <p className="text-xs text-muted-foreground">ID: {s.student_id}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <Badge variant={s.evaluation_score != null && s.evaluation_score > 0 ? "default" : "secondary"}>
                            {s.evaluation_score ?? "N/A"}
                          </Badge>
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0-100"
                            className="h-8 text-center"
                            value={gradeInputs[s.student_id] ?? ""}
                            onChange={(e) => setGradeInputs((prev) => ({ ...prev, [s.student_id]: e.target.value }))}
                          />
                        </div>
                        <div className="col-span-2 text-center">
                          <Button
                            size="sm"
                            onClick={() => handleGrade(s.student_id)}
                            disabled={gradingId === s.student_id || !gradeInputs[s.student_id]}
                          >
                            {gradingId === s.student_id ? "Saving…" : "Grade"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  )
}
