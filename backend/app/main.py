from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import auth, students, instructors, courses, content, admin, analyst

# Import all models so Base.metadata knows about them
import app.models  # noqa: F401

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


@app.on_event("startup")
def on_startup():
    """Create all tables and seed the predefined admin user."""
    Base.metadata.create_all(bind=engine)
    _seed_admin()


def _seed_admin():
    """Insert the predefined admin user if it doesn't already exist."""
    from app.models.user import User
    from app.core.security import hash_password

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email_id == settings.ADMIN_EMAIL).first()
        if not existing:
            admin_user = User(
                email_id=settings.ADMIN_EMAIL,
                password=hash_password(settings.ADMIN_PASSWORD),
                role="admin",
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Quintet DBMS API is running"}
