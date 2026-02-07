from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Quintet DBMS API is running"}


def test_list_courses():
    response = client.get("/api/courses/")
    assert response.status_code == 200
