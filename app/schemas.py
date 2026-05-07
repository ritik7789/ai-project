from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Request body for creating a user."""

    full_name: str
    email: EmailStr
    department: Optional[str] = None
    role: Optional[str] = None


class UserUpdate(BaseModel):
    """Request body for updating a user.

    All fields are optional so you can update only one field at a time.
    """

    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    role: Optional[str] = None


class UserRead(BaseModel):
    """Response shape returned by the API for a user."""

    id: int
    full_name: str
    email: EmailStr
    department: Optional[str] = None
    role: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ErpDocumentCreate(BaseModel):
    """Request body for adding ERP text into the RAG knowledge base."""

    source_name: str
    content: str


class ErpDocumentRead(BaseModel):
    """Response shape for an ERP document stored in the database."""

    id: int
    source_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class RagQuery(BaseModel):
    """Question sent by the user to the RAG endpoint."""

    question: str
