from pathlib import Path
import sys


# This script is outside the app package, so we add the project root to Python's
# import path. That allows imports like "from app.database import SessionLocal".
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from app import crud, models, schemas  # noqa: E402
from app.database import Base, SessionLocal, engine  # noqa: E402
from app.ingestion import SUPPORTED_EXTENSIONS, parse_document_content  # noqa: E402


DATA_FOLDER = PROJECT_ROOT / "app" / "data"


def main():
    """Load sample ERP text files into SQLite for testing the RAG endpoint."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        for file_path in sorted(DATA_FOLDER.iterdir()):
            if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue

            existing_document = (
                db.query(models.ErpDocument)
                .filter(models.ErpDocument.source_name == file_path.name)
                .first()
            )

            if existing_document:
                print(f"Skipping existing document: {file_path.name}")
                continue

            content = parse_document_content(
                filename=file_path.name, content_bytes=file_path.read_bytes()
            )
            if not content:
                print(f"Skipping unreadable/empty document: {file_path.name}")
                continue

            document = schemas.ErpDocumentCreate(source_name=file_path.name, content=content)
            crud.create_erp_document(db=db, document=document)
            print(f"Loaded document: {file_path.name}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
