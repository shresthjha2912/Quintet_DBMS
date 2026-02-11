
from app.database import SessionLocal, engine, Base
from app.models.content import Content
from app.models.course import Course

db = SessionLocal()

try:
    courses = db.query(Course).order_by(Course.course_id).all()

    if len(courses) < 10:
        print("Not enough courses. Run seed.py first.")
        exit(1)

    db.query(Content).delete()
    db.flush()
    print("  Cleared old content rows")

    new_contents = [
        {"course_id": courses[0].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=jGwO_UgTS7I"},
        {"course_id": courses[0].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Machine_learning"},
        {"course_id": courses[0].course_id, "type": "pdf",     "content_url": "https://arxiv.org/pdf/2303.18223"},
        {"course_id": courses[1].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=CS4cs9xVecg"},
        {"course_id": courses[1].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Deep_learning"},
        {"course_id": courses[1].course_id, "type": "pdf",     "content_url": "https://arxiv.org/pdf/1706.03762"},
        {"course_id": courses[2].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=eIrMbAQSU34"},
        {"course_id": courses[2].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Java_(programming_language)"},
        {"course_id": courses[2].course_id, "type": "link",    "content_url": "https://docs.oracle.com/javase/tutorial/"},
        {"course_id": courses[3].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=O753uuutqH8"},
        {"course_id": courses[3].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Software_engineering"},
        {"course_id": courses[4].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=WnGG-MhY9Os"},
        {"course_id": courses[4].course_id, "type": "link",    "content_url": "https://www.kernel.org/doc/html/latest/"},
        {"course_id": courses[4].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Linux_kernel"},
        {"course_id": courses[5].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=vBURTt97EkA"},
        {"course_id": courses[5].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Operating_system"},
        {"course_id": courses[5].course_id, "type": "pdf",     "content_url": "https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf"},
        {"course_id": courses[6].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=dJYGatp4SvA"},
        {"course_id": courses[6].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Computer_vision"},
        {"course_id": courses[7].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=JMUxmLyrhSk"},
        {"course_id": courses[7].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Artificial_intelligence"},
        {"course_id": courses[7].course_id, "type": "pdf",     "content_url": "https://arxiv.org/pdf/2108.07258"},
        {"course_id": courses[8].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=UB1O30fR-EE"},
        {"course_id": courses[8].course_id, "type": "link",    "content_url": "https://developer.mozilla.org/en-US/docs/Learn"},
        {"course_id": courses[8].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Web_development"},
        {"course_id": courses[9].course_id, "type": "video",   "content_url": "https://www.youtube.com/watch?v=nu_pCVPKzTk"},
        {"course_id": courses[9].course_id, "type": "link",    "content_url": "https://nextjs.org/docs"},
        {"course_id": courses[9].course_id, "type": "article", "content_url": "https://en.wikipedia.org/wiki/Solution_stack"},
    ]

    for c in new_contents:
        db.add(Content(**c))

    db.commit()
    print(f" Inserted {len(new_contents)} content items with real working links!")

except Exception as e:
    db.rollback()
    print(f" Error: {e}")
    raise
finally:
    db.close()
