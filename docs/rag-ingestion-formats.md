# RAG Multi-Format Ingestion Guide

The RAG pipeline now supports ingesting these file formats:

- `.txt`
- `.csv`
- `.xlsx`
- `.xls`
- `.pdf`

## 1) Install dependencies

```bash
pip install -r requirements.txt
```

## 2) Bulk ingest from `app/data`

Place files in `app/data/` and run:

```bash
python scripts/load_sample_erp_documents.py
```

The loader now auto-detects supported file types and skips unsupported files.

## 3) Upload a file through API

Endpoint:

- `POST /erp-documents/upload`
- Form field: `file`

Example (curl):

```bash
curl -X POST http://127.0.0.1:8000/erp-documents/upload \
  -F "file=@app/data/erp_finance_policy.txt"
```

## 4) How each format is parsed

- `txt`: raw UTF-8 text
- `csv`: each row converted into a pipe-separated text line
- `xlsx/xls`: all sheets read; each row converted to `column: value` pairs
- `pdf`: text extracted page by page

## 5) Retrieval quality improvements

RAG ranking now uses:

- weighted token overlap (IDF-like weighting)
- phrase match bonus
- expanded chunk size with overlap

This improves relevance and reduces vague matches on short queries.
