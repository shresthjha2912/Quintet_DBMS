"""
Seed script — populates ALL tables with sample data.
Run:  cd backend && .venv/bin/python seed.py
"""

from app.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.user import User
from app.models.student import Student
from app.models.instructor import Instructor
from app.models.university import University
from app.models.course import Course
from app.models.content import Content
from app.models.enrollment import Enrollment
from app.models.topic import Topic
from app.models.textbook import Textbook
from app.models.course_topic import CourseTopic
from app.models.textbook_used import TextbookUsed

# Make sure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # ── 1. Users ─────────────────────────────────────────────────
    # Admin already seeded by app startup; add instructors, students, analysts
    users_data = [
        # Instructors (user_id will auto-increment; admin is 1)
        {"email_id": "andrew.ng@quintet.com",       "role": "instructor", "password": hash_password("instructor123")},
        {"email_id": "jamesgosling@quintet.com",     "role": "instructor", "password": hash_password("instructor123")},
        {"email_id": "linus.torvalds@quintet.com",   "role": "instructor", "password": hash_password("instructor123")},
        {"email_id": "fei.fei.li@quintet.com",       "role": "instructor", "password": hash_password("instructor123")},
        {"email_id": "tim.berners@quintet.com",      "role": "instructor", "password": hash_password("instructor123")},
        # Students
        {"email_id": "rahul.sharma@student.com",     "role": "student",    "password": hash_password("student123")},
        {"email_id": "priya.patel@student.com",      "role": "student",    "password": hash_password("student123")},
        {"email_id": "john.doe@student.com",         "role": "student",    "password": hash_password("student123")},
        {"email_id": "alice.wang@student.com",       "role": "student",    "password": hash_password("student123")},
        {"email_id": "bob.martin@student.com",       "role": "student",    "password": hash_password("student123")},
        # Analysts
        {"email_id": "analyst1@quintet.com",         "role": "analyst",    "password": hash_password("analyst123")},
        {"email_id": "analyst2@quintet.com",         "role": "analyst",    "password": hash_password("analyst123")},
    ]

    # Check if data already seeded (look for first instructor)
    existing = db.query(User).filter(User.email_id == "andrew.ng@quintet.com").first()
    if existing:
        print("⚠️  Data already seeded. Skipping.")
        exit(0)

    for u in users_data:
        db.add(User(**u))
    db.flush()  # so user_ids are assigned

    # Fetch the user_ids
    instructor_users = db.query(User).filter(User.role == "instructor").order_by(User.user_id).all()
    student_users = db.query(User).filter(User.role == "student").order_by(User.user_id).all()

    print(f"✅ Created {len(users_data)} users")

    # ── 2. Instructors ───────────────────────────────────────────
    instructors_data = [
        {"user_id": instructor_users[0].user_id, "name": "Andrew Ng",        "expertise": "Machine Learning"},
        {"user_id": instructor_users[1].user_id, "name": "James Gosling",    "expertise": "Java & Software Engineering"},
        {"user_id": instructor_users[2].user_id, "name": "Linus Torvalds",   "expertise": "Operating Systems"},
        {"user_id": instructor_users[3].user_id, "name": "Fei-Fei Li",       "expertise": "Computer Vision & AI"},
        {"user_id": instructor_users[4].user_id, "name": "Tim Berners-Lee",  "expertise": "Web Technologies"},
    ]

    for i in instructors_data:
        db.add(Instructor(**i))
    db.flush()

    instructors = db.query(Instructor).order_by(Instructor.instructor_id).all()
    print(f"✅ Created {len(instructors_data)} instructors")

    # ── 3. Students ──────────────────────────────────────────────
    students_data = [
        {"user_id": student_users[0].user_id, "age": 21, "skill_level": "Intermediate", "category": "Undergraduate", "country": "India"},
        {"user_id": student_users[1].user_id, "age": 23, "skill_level": "Beginner",     "category": "Postgraduate",  "country": "India"},
        {"user_id": student_users[2].user_id, "age": 20, "skill_level": "Beginner",     "category": "Undergraduate", "country": "USA"},
        {"user_id": student_users[3].user_id, "age": 25, "skill_level": "Advanced",     "category": "Postgraduate",  "country": "China"},
        {"user_id": student_users[4].user_id, "age": 22, "skill_level": "Intermediate", "category": "Undergraduate", "country": "UK"},
    ]

    for s in students_data:
        db.add(Student(**s))
    db.flush()

    students = db.query(Student).order_by(Student.student_id).all()
    print(f"✅ Created {len(students_data)} students")

    # ── 4. Universities ──────────────────────────────────────────
    universities_data = [
        {"name": "IIT Kharagpur",                              "country": "India"},
        {"name": "Stanford University",                        "country": "USA"},
        {"name": "Massachusetts Institute of Technology (MIT)", "country": "USA"},
        {"name": "University of Oxford",                       "country": "UK"},
        {"name": "Tsinghua University",                        "country": "China"},
    ]

    for u in universities_data:
        db.add(University(**u))
    db.flush()

    universities = db.query(University).order_by(University.university_id).all()
    print(f"✅ Created {len(universities_data)} universities")

    # ── 5. Courses ───────────────────────────────────────────────
    courses_data = [
        {"course_name": "Machine Learning",              "duration": "12 weeks", "program_type": "Certificate",  "instructor_id": instructors[0].instructor_id, "university_id": universities[1].university_id},
        {"course_name": "Deep Learning Specialization",  "duration": "16 weeks", "program_type": "Specialization","instructor_id": instructors[0].instructor_id, "university_id": universities[1].university_id},
        {"course_name": "Java Programming Masterclass",  "duration": "10 weeks", "program_type": "Certificate",  "instructor_id": instructors[1].instructor_id, "university_id": universities[0].university_id},
        {"course_name": "Software Engineering Principles","duration": "8 weeks",  "program_type": "Degree",      "instructor_id": instructors[1].instructor_id, "university_id": universities[2].university_id},
        {"course_name": "Linux Kernel Development",      "duration": "14 weeks", "program_type": "Certificate",  "instructor_id": instructors[2].instructor_id, "university_id": universities[2].university_id},
        {"course_name": "Operating Systems",             "duration": "12 weeks", "program_type": "Degree",       "instructor_id": instructors[2].instructor_id, "university_id": universities[0].university_id},
        {"course_name": "Computer Vision with Deep Learning","duration":"10 weeks","program_type": "Specialization","instructor_id": instructors[3].instructor_id, "university_id": universities[1].university_id},
        {"course_name": "Introduction to AI",            "duration": "8 weeks",  "program_type": "Certificate",  "instructor_id": instructors[3].instructor_id, "university_id": universities[4].university_id},
        {"course_name": "Web Development Fundamentals",  "duration": "6 weeks",  "program_type": "Certificate",  "instructor_id": instructors[4].instructor_id, "university_id": universities[3].university_id},
        {"course_name": "Full-Stack Web Applications",   "duration": "16 weeks", "program_type": "Degree",       "instructor_id": instructors[4].instructor_id, "university_id": universities[3].university_id},
    ]

    for c in courses_data:
        db.add(Course(**c))
    db.flush()

    courses = db.query(Course).order_by(Course.course_id).all()
    print(f"✅ Created {len(courses_data)} courses")

    # ── 6. Topics ────────────────────────────────────────────────
    topics_data = [
        {"topic_name": "Supervised Learning"},
        {"topic_name": "Neural Networks"},
        {"topic_name": "Object-Oriented Programming"},
        {"topic_name": "Data Structures & Algorithms"},
        {"topic_name": "Process Management"},
        {"topic_name": "Image Recognition"},
        {"topic_name": "HTML/CSS/JavaScript"},
        {"topic_name": "RESTful APIs"},
        {"topic_name": "Natural Language Processing"},
        {"topic_name": "Cloud Computing"},
    ]

    for t in topics_data:
        db.add(Topic(**t))
    db.flush()

    topics = db.query(Topic).order_by(Topic.topic_id).all()
    print(f"✅ Created {len(topics_data)} topics")

    # ── 7. Textbooks ─────────────────────────────────────────────
    textbooks_data = [
        {"title": "Pattern Recognition and Machine Learning", "author": "Christopher Bishop"},
        {"title": "Deep Learning",                            "author": "Ian Goodfellow"},
        {"title": "Effective Java",                           "author": "Joshua Bloch"},
        {"title": "Operating System Concepts",                "author": "Abraham Silberschatz"},
        {"title": "Computer Vision: Algorithms and Applications", "author": "Richard Szeliski"},
        {"title": "Clean Code",                               "author": "Robert C. Martin"},
        {"title": "Introduction to Algorithms (CLRS)",        "author": "Cormen, Leiserson, Rivest, Stein"},
        {"title": "HTML and CSS: Design and Build Websites",  "author": "Jon Duckett"},
    ]

    for tb in textbooks_data:
        db.add(Textbook(**tb))
    db.flush()

    textbooks = db.query(Textbook).order_by(Textbook.textbook_id).all()
    print(f"✅ Created {len(textbooks_data)} textbooks")

    # ── 8. Course ↔ Topic links ──────────────────────────────────
    course_topics_data = [
        {"course_id": courses[0].course_id, "topic_id": topics[0].topic_id},  # ML → Supervised Learning
        {"course_id": courses[0].course_id, "topic_id": topics[1].topic_id},  # ML → Neural Networks
        {"course_id": courses[1].course_id, "topic_id": topics[1].topic_id},  # Deep Learning → Neural Networks
        {"course_id": courses[1].course_id, "topic_id": topics[5].topic_id},  # Deep Learning → Image Recognition
        {"course_id": courses[2].course_id, "topic_id": topics[2].topic_id},  # Java → OOP
        {"course_id": courses[2].course_id, "topic_id": topics[3].topic_id},  # Java → DSA
        {"course_id": courses[3].course_id, "topic_id": topics[2].topic_id},  # SE Principles → OOP
        {"course_id": courses[4].course_id, "topic_id": topics[4].topic_id},  # Linux Kernel → Process Management
        {"course_id": courses[5].course_id, "topic_id": topics[4].topic_id},  # OS → Process Management
        {"course_id": courses[6].course_id, "topic_id": topics[5].topic_id},  # CV → Image Recognition
        {"course_id": courses[6].course_id, "topic_id": topics[1].topic_id},  # CV → Neural Networks
        {"course_id": courses[7].course_id, "topic_id": topics[0].topic_id},  # Intro AI → Supervised Learning
        {"course_id": courses[7].course_id, "topic_id": topics[8].topic_id},  # Intro AI → NLP
        {"course_id": courses[8].course_id, "topic_id": topics[6].topic_id},  # Web Dev → HTML/CSS/JS
        {"course_id": courses[8].course_id, "topic_id": topics[7].topic_id},  # Web Dev → REST APIs
        {"course_id": courses[9].course_id, "topic_id": topics[6].topic_id},  # Full-Stack → HTML/CSS/JS
        {"course_id": courses[9].course_id, "topic_id": topics[7].topic_id},  # Full-Stack → REST APIs
        {"course_id": courses[9].course_id, "topic_id": topics[9].topic_id},  # Full-Stack → Cloud Computing
    ]

    for ct in course_topics_data:
        db.add(CourseTopic(**ct))
    db.flush()
    print(f"✅ Created {len(course_topics_data)} course-topic links")

    # ── 9. Textbook ↔ Course links ───────────────────────────────
    textbooks_used_data = [
        {"course_id": courses[0].course_id, "textbook_id": textbooks[0].textbook_id},  # ML → Bishop
        {"course_id": courses[1].course_id, "textbook_id": textbooks[1].textbook_id},  # Deep Learning → Goodfellow
        {"course_id": courses[2].course_id, "textbook_id": textbooks[2].textbook_id},  # Java → Effective Java
        {"course_id": courses[2].course_id, "textbook_id": textbooks[5].textbook_id},  # Java → Clean Code
        {"course_id": courses[3].course_id, "textbook_id": textbooks[5].textbook_id},  # SE → Clean Code
        {"course_id": courses[3].course_id, "textbook_id": textbooks[6].textbook_id},  # SE → CLRS
        {"course_id": courses[4].course_id, "textbook_id": textbooks[3].textbook_id},  # Linux → Silberschatz
        {"course_id": courses[5].course_id, "textbook_id": textbooks[3].textbook_id},  # OS → Silberschatz
        {"course_id": courses[6].course_id, "textbook_id": textbooks[4].textbook_id},  # CV → Szeliski
        {"course_id": courses[6].course_id, "textbook_id": textbooks[1].textbook_id},  # CV → Goodfellow
        {"course_id": courses[7].course_id, "textbook_id": textbooks[0].textbook_id},  # Intro AI → Bishop
        {"course_id": courses[8].course_id, "textbook_id": textbooks[7].textbook_id},  # Web Dev → Duckett
        {"course_id": courses[9].course_id, "textbook_id": textbooks[7].textbook_id},  # Full-Stack → Duckett
    ]

    for tu in textbooks_used_data:
        db.add(TextbookUsed(**tu))
    db.flush()
    print(f"✅ Created {len(textbooks_used_data)} textbook-course links")

    # ── 10. Contents ─────────────────────────────────────────────
    contents_data = [
        {"course_id": courses[0].course_id, "type": "video",   "content_url": "https://example.com/ml/lecture1.mp4"},
        {"course_id": courses[0].course_id, "type": "pdf",     "content_url": "https://example.com/ml/notes.pdf"},
        {"course_id": courses[1].course_id, "type": "video",   "content_url": "https://example.com/dl/lecture1.mp4"},
        {"course_id": courses[1].course_id, "type": "quiz",    "content_url": "https://example.com/dl/quiz1.html"},
        {"course_id": courses[2].course_id, "type": "video",   "content_url": "https://example.com/java/lecture1.mp4"},
        {"course_id": courses[3].course_id, "type": "pdf",     "content_url": "https://example.com/se/handbook.pdf"},
        {"course_id": courses[4].course_id, "type": "video",   "content_url": "https://example.com/linux/lecture1.mp4"},
        {"course_id": courses[5].course_id, "type": "pdf",     "content_url": "https://example.com/os/slides.pdf"},
        {"course_id": courses[6].course_id, "type": "video",   "content_url": "https://example.com/cv/lecture1.mp4"},
        {"course_id": courses[7].course_id, "type": "quiz",    "content_url": "https://example.com/ai/quiz1.html"},
        {"course_id": courses[8].course_id, "type": "video",   "content_url": "https://example.com/webdev/lecture1.mp4"},
        {"course_id": courses[8].course_id, "type": "pdf",     "content_url": "https://example.com/webdev/cheatsheet.pdf"},
        {"course_id": courses[9].course_id, "type": "video",   "content_url": "https://example.com/fullstack/lecture1.mp4"},
    ]

    for c in contents_data:
        db.add(Content(**c))
    db.flush()
    print(f"✅ Created {len(contents_data)} content items")

    # ── 11. Enrollments ──────────────────────────────────────────
    enrollments_data = [
        {"student_id": students[0].student_id, "course_id": courses[0].course_id, "evaluation_score": 88.5},
        {"student_id": students[0].student_id, "course_id": courses[2].course_id, "evaluation_score": 75.0},
        {"student_id": students[0].student_id, "course_id": courses[5].course_id, "evaluation_score": 92.0},
        {"student_id": students[1].student_id, "course_id": courses[1].course_id, "evaluation_score": 67.5},
        {"student_id": students[1].student_id, "course_id": courses[6].course_id, "evaluation_score": 81.0},
        {"student_id": students[2].student_id, "course_id": courses[0].course_id, "evaluation_score": 90.0},
        {"student_id": students[2].student_id, "course_id": courses[8].course_id, "evaluation_score": 55.0},
        {"student_id": students[3].student_id, "course_id": courses[1].course_id, "evaluation_score": 95.0},
        {"student_id": students[3].student_id, "course_id": courses[7].course_id, "evaluation_score": 88.0},
        {"student_id": students[3].student_id, "course_id": courses[9].course_id, "evaluation_score": 72.5},
        {"student_id": students[4].student_id, "course_id": courses[3].course_id, "evaluation_score": 84.0},
        {"student_id": students[4].student_id, "course_id": courses[4].course_id, "evaluation_score": 78.5},
        {"student_id": students[4].student_id, "course_id": courses[8].course_id, "evaluation_score": 91.0},
    ]

    for e in enrollments_data:
        db.add(Enrollment(**e))
    db.flush()
    print(f"✅ Created {len(enrollments_data)} enrollments")

    # ── Commit everything ────────────────────────────────────────
    db.commit()
    print("\n🎉 All sample data seeded successfully!")
    print("\n📋 Login credentials:")
    print("   Admin:       admin@quintet.com / admin123")
    print("   Instructors: andrew.ng@quintet.com / instructor123  (and 4 others)")
    print("   Students:    rahul.sharma@student.com / student123  (and 4 others)")
    print("   Analysts:    analyst1@quintet.com / analyst123")

except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")
    raise
finally:
    db.close()
