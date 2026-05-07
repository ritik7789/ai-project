from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app import crud, models, rag, schemas
from app.database import Base, engine, get_db
from app.ingestion import parse_document_content


# Create database tables when the application starts.
# This is beginner-friendly for demos. Bigger projects often use Alembic
# migrations so database changes can be tracked carefully over time.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ERP RAG + User CRUD API",
    description="A beginner-friendly FastAPI project with user CRUD and simple ERP RAG search.",
    version="1.0.0",
)


@app.get("/")
def health_check():
    """Small route to confirm the API is running."""
    return {"message": "ERP RAG FastAPI project is running"}


@app.post(
    "/users",
    response_model=schemas.UserRead,
    status_code=status.HTTP_201_CREATED,
)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a user with basic details."""
    existing_user = crud.get_user_by_email(db=db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    return crud.create_user(db=db, user=user)


@app.get("/users", response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db)):
    """List all users."""
    return crud.get_users(db=db)


@app.get("/users/{user_id}", response_model=schemas.UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """Read one user by id."""
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


@app.put("/users/{user_id}", response_model=schemas.UserRead)
def update_user(
    user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)
):
    """Update user details.

    Example: send only {"department": "Finance"} to update just the department.
    """
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.email:
        existing_user = crud.get_user_by_email(db=db, email=user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Email already exists")

    return crud.update_user(db=db, db_user=db_user, user_update=user_update)


@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete one user."""
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    crud.delete_user(db=db, db_user=db_user)
    return None


@app.post(
    "/erp-documents",
    response_model=schemas.ErpDocumentRead,
    status_code=status.HTTP_201_CREATED,
)
def add_erp_document(
    document: schemas.ErpDocumentCreate, db: Session = Depends(get_db)
):
    """Add ERP text into the RAG knowledge base."""
    return crud.create_erp_document(db=db, document=document)


@app.post(
    "/erp-documents/upload",
    response_model=schemas.ErpDocumentRead,
    status_code=status.HTTP_201_CREATED,
)
async def upload_erp_document(
    file: UploadFile = File(...), db: Session = Depends(get_db)
):
    """Upload and ingest ERP documents from txt, csv, xls/xlsx, or pdf."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is required")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        parsed_content = parse_document_content(
            filename=file.filename, content_bytes=file_bytes
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not parsed_content:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from uploaded file",
        )

    document = schemas.ErpDocumentCreate(
        source_name=file.filename,
        content=parsed_content,
    )
    return crud.create_erp_document(db=db, document=document)


@app.get("/erp-documents", response_model=list[schemas.ErpDocumentRead])
def list_erp_documents(db: Session = Depends(get_db)):
    """List all ERP documents stored for RAG."""
    return crud.get_erp_documents(db=db)


@app.delete("/erp-documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_erp_document(document_id: int, db: Session = Depends(get_db)):
    """Delete one ERP document from the RAG knowledge base."""
    db_document = crud.get_erp_document(db=db, document_id=document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="ERP document not found")

    crud.delete_erp_document(db=db, db_document=db_document)
    return None


@app.post("/rag/query")
def rag_query(query: schemas.RagQuery, db: Session = Depends(get_db)):
    """Ask a question against ERP documents.

    Current demo behavior:
    - Reads all ERP documents from SQLite.
    - Splits them into chunks.
    - Finds chunks sharing words with the question.
    - Returns the best matching chunk and source information.
    """
    documents = crud.get_erp_documents(db=db)
    users = crud.get_users(db=db)
    return rag.answer_question(question=query.question, documents=documents, users=users)
