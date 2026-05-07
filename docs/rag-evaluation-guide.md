# RAG Evaluation Guide

Use this with `docs/rag-evaluation-sheet.csv`.

## How to run

1. Start backend and frontend.
2. Run each query from the sheet in the frontend RAG page.
3. Copy these into the sheet:
- `actual_source` from Matched Source
- `actual_answer_summary` as a short 1-2 line summary
- `score` from UI
- `verdict` as `PASS` or `FAIL`
- `notes` for mismatch/vagueness

## PASS criteria

- Source relevance: `actual_source` matches `expected_source` (or is meaningfully related).
- Answer grounding: answer contains at least 2 expected keywords for fact queries.
- No hallucination for out-of-scope queries: expected `none` should return no-match style answer.
- Clarity: answer is specific and not generic/vague.

## Optional scoring rubric (0-5)

- `5`: exact source + precise answer + expected keywords present
- `4`: correct source + mostly correct but missing minor detail
- `3`: partially correct or vague, still somewhat useful
- `2`: weak match, mostly generic
- `1`: wrong source or misleading answer
- `0`: empty/failed response
