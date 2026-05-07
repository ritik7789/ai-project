from __future__ import annotations

import csv
import io
from pathlib import Path

import pandas as pd
from pypdf import PdfReader

SUPPORTED_EXTENSIONS = {".txt", ".csv", ".xlsx", ".xls", ".pdf"}


def parse_document_content(filename: str, content_bytes: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format '{suffix}'. Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )

    if suffix == ".txt":
        return _parse_txt(content_bytes)
    if suffix == ".csv":
        return _parse_csv(content_bytes)
    if suffix in {".xlsx", ".xls"}:
        return _parse_excel(content_bytes)
    if suffix == ".pdf":
        return _parse_pdf(content_bytes)

    raise ValueError("Unsupported file format")


def _parse_txt(content_bytes: bytes) -> str:
    return content_bytes.decode("utf-8", errors="ignore").strip()


def _parse_csv(content_bytes: bytes) -> str:
    decoded = content_bytes.decode("utf-8", errors="ignore")
    reader = csv.reader(io.StringIO(decoded))
    rows = []
    for row in reader:
        cleaned = [cell.strip() for cell in row if cell and cell.strip()]
        if cleaned:
            rows.append(" | ".join(cleaned))
    return "\n".join(rows).strip()


def _parse_excel(content_bytes: bytes) -> str:
    # sheet_name=None reads all sheets as a dict[str, DataFrame]
    excel_data = pd.read_excel(io.BytesIO(content_bytes), sheet_name=None)
    parts: list[str] = []

    for sheet_name, dataframe in excel_data.items():
        parts.append(f"Sheet: {sheet_name}")
        dataframe = dataframe.fillna("")
        columns = [str(column).strip() for column in dataframe.columns]

        for _, row in dataframe.iterrows():
            row_pairs = []
            for idx, value in enumerate(row.tolist()):
                value_text = str(value).strip()
                if value_text:
                    row_pairs.append(f"{columns[idx]}: {value_text}")
            if row_pairs:
                parts.append("; ".join(row_pairs))

    return "\n".join(parts).strip()


def _parse_pdf(content_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(content_bytes))
    pages = []
    for page in reader.pages:
        extracted = page.extract_text() or ""
        extracted = extracted.strip()
        if extracted:
            pages.append(extracted)
    return "\n\n".join(pages).strip()
