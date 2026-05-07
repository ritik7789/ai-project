from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# SQLite stores data in a local file. This is simple for learning and local demos.
# For production apps, teams usually use PostgreSQL, MySQL, SQL Server, etc.
DATABASE_URL = "sqlite:///./rag_fastapi.db"

# check_same_thread=False is required when SQLite is used with FastAPI.
# FastAPI can handle multiple requests, so the database connection may be used
# across different threads.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# SessionLocal creates database sessions.
# A session is the object we use to query, insert, update, and delete rows.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class for SQLAlchemy models.
# Every table model inherits from Base.
Base = declarative_base()


def get_db():
    """Create a database session for one API request.

    FastAPI will call this function before a route runs, give the route the
    database session, and close the session after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
