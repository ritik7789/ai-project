from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.database import Base


class User(Base):
    """Database table for user details.

    This is a basic CRUD example:
    - Create a user
    - Read users
    - Update a user
    - Delete a user
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=True)
    role = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ErpDocument(Base):
    """Database table for ERP files used by the simple RAG implementation.

    In a real ERP RAG system, source_name could be a PDF, CSV, HR policy file,
    invoice export, purchase order, inventory report, etc.
    """

    __tablename__ = "erp_documents"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(255), index=True, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
