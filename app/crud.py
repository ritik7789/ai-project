from sqlalchemy.orm import Session

from app import models, schemas


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """Insert a new user row into the database."""
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session) -> list[models.User]:
    """Return all users."""
    return db.query(models.User).order_by(models.User.id).all()


def get_user(db: Session, user_id: int) -> models.User | None:
    """Return one user by id, or None if no user exists."""
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> models.User | None:
    """Return one user by email. Used to avoid duplicate email addresses."""
    return db.query(models.User).filter(models.User.email == email).first()


def update_user(
    db: Session, db_user: models.User, user_update: schemas.UserUpdate
) -> models.User:
    """Update only the fields sent in the request body."""
    update_data = user_update.model_dump(exclude_unset=True)
    for field_name, field_value in update_data.items():
        setattr(db_user, field_name, field_value)

    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, db_user: models.User) -> None:
    """Delete a user row from the database."""
    db.delete(db_user)
    db.commit()


def create_erp_document(
    db: Session, document: schemas.ErpDocumentCreate
) -> models.ErpDocument:
    """Insert ERP document text into the knowledge base."""
    db_document = models.ErpDocument(**document.model_dump())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


def get_erp_documents(db: Session) -> list[models.ErpDocument]:
    """Return all ERP documents stored for RAG."""
    return db.query(models.ErpDocument).order_by(models.ErpDocument.id).all()


def get_erp_document(db: Session, document_id: int) -> models.ErpDocument | None:
    """Return one ERP document by id."""
    return (
        db.query(models.ErpDocument)
        .filter(models.ErpDocument.id == document_id)
        .first()
    )


def delete_erp_document(db: Session, db_document: models.ErpDocument) -> None:
    """Remove one ERP document from the knowledge base."""
    db.delete(db_document)
    db.commit()
