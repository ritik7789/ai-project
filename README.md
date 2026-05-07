# ERP RAG + FastAPI Demo

This project is a beginner-friendly FastAPI API with:

- Basic CRUD endpoints for user details
- SQLite database storage
- A simple RAG-style ERP document search
- Sample ERP files for HR, inventory, and finance

## Project Structure

```text
rag_fastapi_project/
  app/
    data/
      erp_finance_policy.txt
      erp_hr_policy.txt
      erp_inventory_policy.txt
    __init__.py
    crud.py
    database.py
    main.py
    models.py
    rag.py
    schemas.py
  README.md
  requirements.txt
  scripts/
    load_sample_erp_documents.py
```

## Install

```powershell
cd C:\Users\genaiahmgpusr57\Pictures\rag_fastapi_project
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
uvicorn app.main:app --reload
```

Open the interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## Load Sample ERP Files

The `app/data` folder contains sample ERP text files. Run this command once to
insert them into SQLite:

```powershell
python .\scripts\load_sample_erp_documents.py
```

## User CRUD Endpoints

- `POST /users` creates a user
- `GET /users` lists users
- `GET /users/{user_id}` reads one user
- `PUT /users/{user_id}` updates one user
- `DELETE /users/{user_id}` deletes one user

Example user JSON:

```json
{
  "full_name": "Asha Sharma",
  "email": "asha@example.com",
  "department": "Finance",
  "role": "Accounts Executive"
}
```

## RAG Endpoints

- `POST /erp-documents` adds ERP text into the knowledge base
- `POST /erp-documents/upload` uploads and ingests `.txt/.csv/.xls/.xlsx/.pdf`
- `GET /erp-documents` lists ERP documents
- `DELETE /erp-documents/{document_id}` deletes ERP text
- `POST /rag/query` asks a question against stored ERP text

Example ERP document JSON:

```json
{
  "source_name": "erp_finance_policy.txt",
  "content": "The ERP finance module manages invoices, payments, vendors, purchase orders, and general ledger entries."
}
```

Example RAG query JSON:

```json
{
  "question": "How are vendor invoices approved?"
}
```

## Important Learning Note

This project uses simple keyword matching for RAG so the code is easy to understand.
Real RAG systems usually add:

- Embeddings
- Vector database storage
- Better chunking
- LLM answer generation
- Authentication and authorization

## Local LLM for RAG (Llama3/Qwen3)

You can enable local LLM-generated answers (via Ollama) while keeping the same
retrieval/source pipeline.

Configuration doc:

- `docs/local-llm-rag-setup.md`

Quick start:

```bash
export RAG_LLM_ENABLED=true
export RAG_LLM_BASE_URL=http://127.0.0.1:11434
export RAG_LLM_MODEL=llama3:8b
uvicorn app.main:app --reload
```

## Multi-format Ingestion

RAG can ingest unstructured data from multiple file types.

- Supported formats: `.txt`, `.csv`, `.xls`, `.xlsx`, `.pdf`
- Upload API: `POST /erp-documents/upload` with form field `file`
- Bulk load from folder: `python scripts/load_sample_erp_documents.py`

See:

- `docs/rag-ingestion-formats.md`
