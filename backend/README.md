# Quintet DBMS — Backend

FastAPI backend for the Quintet DBMS project.

## Setup

```bash
# Install dependencies (using uv)
uv sync

# Or using pip
pip install -e .
```

## Run

```bash
# Using uvicorn directly
uvicorn app.main:app --reload --port 8000

# Or using the entry point
python main.py
```

## API Docs

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
app/
 main.py          ← FastAPI entry point
 database.py      ← PostgreSQL connection
 core/            ← Settings & security
 models/          ← SQLAlchemy DB models
 schemas/         ← Pydantic request/response models
 routers/         ← API endpoints
 services/        ← Business logic
 tests/           ← Unit tests
```
