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

  // Handle 204 No Content
  if (res.status === 204) return {} as T;

  return res.json();
}

// ─── Auth ──────────────────────────────────────────────
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

// ─── Student endpoints ─────────────────────────────────
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

export function getMyEnrolledCourses() {
  return apiFetch<
    {
      student_id: number;
      course_id: number;
      evaluation_score: number;
    }[]
  >("/api/students/my-courses");
}

// ─── Instructor endpoints ──────────────────────────────
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

// ─── Analyst endpoints ─────────────────────────────────
export function getStatistics() {
  return apiFetch<Record<string, unknown>>("/api/analyst/statistics");
}

export function getCoursesSummary() {
  return apiFetch<Record<string, unknown>[]>("/api/analyst/courses/summary");
}

export function getEnrollmentsSummary() {
  return apiFetch<Record<string, unknown>[]>("/api/analyst/enrollments/summary");
}

// ─── Admin endpoints ───────────────────────────────────
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

// ─── Public courses ────────────────────────────────────
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
