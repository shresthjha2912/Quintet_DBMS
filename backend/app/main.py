from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, students, instructors, courses, content, admin, analyst

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Quintet DBMS Backend API",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(instructors.router, prefix="/api/instructors", tags=["Instructors"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(analyst.router, prefix="/api/analyst", tags=["Analyst"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Quintet DBMS API is running"}
