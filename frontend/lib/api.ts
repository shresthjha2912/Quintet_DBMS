const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error ${res.status}`);
  }

  if (res.status === 204) return {} as T;

  return res.json();
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: string;
  user_id: number;
}

export function loginStudent(email_id: string, password: string) {
  return apiFetch<TokenResponse>("/api/auth/student/login", {
    method: "POST",
    body: JSON.stringify({ email_id, password }),
  });
}

export interface StudentSignupData {
  email_id: string;
  password: string;
  age: number;
  skill_level: string;
  category: string;
  country: string;
}

export function signupStudent(data: StudentSignupData) {
  return apiFetch<TokenResponse>("/api/auth/student/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginInstructor(email_id: string, password: string) {
  return apiFetch<TokenResponse>("/api/auth/instructor/login", {
    method: "POST",
    body: JSON.stringify({ email_id, password }),
  });
}

export function loginAnalyst(email_id: string, password: string) {
  return apiFetch<TokenResponse>("/api/auth/analyst/login", {
    method: "POST",
    body: JSON.stringify({ email_id, password }),
  });
}

export function loginAdmin(email_id: string, password: string) {
  return apiFetch<TokenResponse>("/api/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email_id, password }),
  });
}

export function getStudentProfile() {
  return apiFetch<{
    student_id: number;
    user_id: number;
    email_id: string;
    age: number;
    skill_level: string;
    category: string;
    country: string;
  }>("/api/students/profile");
}

export function browseCourses() {
  return apiFetch<
    {
      course_id: number;
      course_name: string;
      duration: string;
      program_type: string;
      instructor_id: number;
      university_id: number;
    }[]
  >("/api/students/courses");
}

export function enrollInCourse(student_id: number, course_id: number) {
  return apiFetch("/api/students/enroll", {
    method: "POST",
    body: JSON.stringify({ student_id, course_id }),
  });
}

export function unenrollFromCourse(course_id: number) {
  return apiFetch(`/api/students/unenroll/${course_id}`, {
    method: "DELETE",
  });
}

export function getMyEnrolledCourses() {
  return apiFetch<
    {
      student_id: number;
      course_id: number;
      evaluation_score: number;
    }[]
  >("/api/students/my-courses");
}

export function getInstructorProfile() {
  return apiFetch<{
    instructor_id: number;
    user_id: number;
    email_id: string;
    name: string;
    expertise: string;
  }>("/api/instructors/profile");
}

export function getInstructorCourses() {
  return apiFetch<
    {
      course_id: number;
      course_name: string;
      duration: string;
      program_type: string;
      instructor_id: number;
      university_id: number;
    }[]
  >("/api/instructors/my-courses");
}

export function getCourseStudents(course_id: number) {
  return apiFetch<
    {
      student_id: number;
      course_id: number;
      evaluation_score: number;
      student_name?: string | null;
      student_email?: string | null;
    }[]
  >(`/api/instructors/courses/${course_id}/students`);
}

export function gradeStudent(course_id: number, student_id: number, score: number) {
  return apiFetch(`/api/instructors/courses/${course_id}/grade?student_id=${student_id}&score=${score}`, { method: "POST" });
}

export function instructorGetStudentProfile(student_id: number) {
  return apiFetch<{
    student_id: number;
    email_id: string | null;
    age: number;
    skill_level: string;
    category: string;
    country: string;
    enrollments: { course_id: number; course_name: string | null; evaluation_score: number | null }[];
  }>(`/api/instructors/students/${student_id}`);
}

export function getStatistics() {
  return apiFetch<Record<string, unknown>>("/api/analyst/statistics");
}

export function getCoursesSummary() {
  return apiFetch<Record<string, unknown>[]>("/api/analyst/courses/summary");
}

export function getEnrollmentsSummary() {
  return apiFetch<Record<string, unknown>[]>("/api/analyst/enrollments/summary");
}

export function getAnalystCourseDetail(course_id: number) {
  return apiFetch<Record<string, unknown>>(`/api/analyst/courses/${course_id}`);
}

export function getAnalystStudentDetail(student_id: number) {
  return apiFetch<Record<string, unknown>>(`/api/analyst/students/${student_id}`);
}

export function adminGetInstructors() {
  return apiFetch<
    {
      instructor_id: number;
      user_id: number;
      name: string;
      expertise: string;
    }[]
  >("/api/admin/instructors");
}

export function adminCreateInstructor(data: {
  email_id: string;
  password: string;
  name: string;
  expertise: string;
}) {
  return apiFetch("/api/admin/instructors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminGetStudents() {
  return apiFetch<
    {
      student_id: number;
      user_id: number;
      email_id: string;
      age: number;
      skill_level: string;
      category: string;
      country: string;
    }[]
  >("/api/admin/students");
}

export function adminDeleteStudent(student_id: number) {
  return apiFetch(`/api/admin/students/${student_id}`, { method: "DELETE" });
}

export function adminCreateCourse(data: {
  course_name: string;
  duration: string;
  program_type: string;
  instructor_id: number;
  university_id: number;
}) {
  return apiFetch("/api/admin/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminDeleteCourse(course_id: number) {
  return apiFetch(`/api/admin/courses/${course_id}`, { method: "DELETE" });
}

export function adminDeleteInstructor(instructor_id: number) {
  return apiFetch(`/api/admin/instructors/${instructor_id}`, { method: "DELETE" });
}

export function adminGetInstructorDetail(instructor_id: number) {
  return apiFetch<{
    instructor_id: number;
    user_id: number;
    email_id: string;
    name: string;
    expertise: string;
    courses: {
      course_id: number;
      course_name: string;
      duration: string;
      program_type: string;
    }[];
  }>(`/api/admin/instructors/${instructor_id}`);
}

export function adminGetStudentDetail(student_id: number) {
  return apiFetch<{
    student_id: number;
    user_id: number;
    email_id: string;
    age: number;
    skill_level: string;
    category: string;
    country: string;
    enrollments: {
      course_id: number;
      course_name: string | null;
      evaluation_score: number;
    }[];
  }>(`/api/admin/students/${student_id}`);
}

export function adminGetCourseDetail(course_id: number) {
  return apiFetch<{
    course_id: number;
    course_name: string;
    duration: string;
    program_type: string;
    instructor_id: number | null;
    instructor_name: string;
    instructor_email: string | null;
    university_id: number;
    university_name: string;
    enrolled_students: {
      student_id: number;
      student_email: string | null;
      evaluation_score: number;
    }[];
  }>(`/api/admin/courses/${course_id}`);
}

export function getPublicCourses() {
  return apiFetch<
    {
      course_id: number;
      course_name: string;
      duration: string;
      program_type: string;
      instructor_id: number;
      university_id: number;
    }[]
  >("/api/courses");
}

export function getCourseContent(course_id: number) {
  return apiFetch<
    {
      content_id: number;
      course_id: number;
      type: string;
      content_url: string;
    }[]
  >(`/api/content/${course_id}`);
}

export function getCourseTextbooks(course_id: number) {
  return apiFetch<
    {
      textbook_id: number;
      title: string;
      author: string;
      link: string | null;
    }[]
  >(`/api/courses/${course_id}/textbooks`);
}

export function addCourseContent(
  course_id: number,
  type: string,
  content_url: string,
) {
  return apiFetch<{
    content_id: number;
    course_id: number;
    type: string;
    content_url: string;
  }>(`/api/instructors/courses/${course_id}/content`, {
    method: "POST",
    body: JSON.stringify({ type, content_url }),
  });
}

export function deleteCourseContent(course_id: number, content_id: number) {
  return apiFetch(`/api/instructors/courses/${course_id}/content/${content_id}`, {
    method: "DELETE",
  });
}
