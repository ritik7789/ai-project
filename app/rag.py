import re

from app.models import ErpDocument


def split_into_chunks(text: str, chunk_size: int = 700, overlap: int = 120) -> list[str]:
    """Split long ERP text into smaller searchable chunks.

    RAG means Retrieval-Augmented Generation:
    1. Store useful company/ERP data.
    2. Retrieve the most relevant parts for a user question.
    3. Send those parts to an AI model to generate the final answer.

    This demo implements step 1 and step 2 without calling an AI provider.
    It returns a simple answer from the best matching ERP chunk.
    """
    cleaned_text = " ".join(text.split())
    if not cleaned_text:
        return []

    chunks = []
    start = 0

    while start < len(cleaned_text):
        end = start + chunk_size
        chunks.append(cleaned_text[start:end])

        # Move forward, but keep some overlap so important context is not lost
        # between two neighboring chunks.
        start = end - overlap

        if start < 0:
            start = 0

    return chunks


def tokenize(text: str) -> set[str]:
    """Convert text into lowercase search words.

    This is intentionally simple for learning. Real RAG systems usually use
    embeddings and a vector database such as FAISS, Chroma, Pinecone, etc.
    """
    words = re.findall(r"[a-zA-Z0-9]+", text.lower())

    # Remove very small words because they usually do not help search quality.
    return {word for word in words if len(word) > 2}


def find_best_matches(
    question: str, documents: list[ErpDocument], limit: int = 3
) -> list[dict]:
    """Find ERP document chunks that share the most words with the question."""
    question_words = tokenize(question)
    matches = []

    for document in documents:
        for chunk in split_into_chunks(document.content):
            chunk_words = tokenize(chunk)
            score = len(question_words.intersection(chunk_words))

            if score > 0:
                matches.append(
                    {
                        "score": score,
                        "document_id": document.id,
                        "source_name": document.source_name,
                        "chunk": chunk,
                    }
                )

    matches.sort(key=lambda item: item["score"], reverse=True)
    return matches[:limit]


def answer_question(question: str, documents: list[ErpDocument]) -> dict:
    """Return a basic RAG-style answer using retrieved ERP chunks."""
    matches = find_best_matches(question=question, documents=documents)

    if not matches:
        return {
            "answer": "No matching ERP information was found for this question.",
            "sources": [],
        }

    best_match = matches[0]

    # In a production app, this is where you would send the question and the
    # retrieved chunks to an LLM. For now, we return the best matching text so
    # the RAG retrieval concept is easy to see.
    return {
        "answer": best_match["chunk"],
        "sources": [
            {
                "document_id": match["document_id"],
                "source_name": match["source_name"],
                "score": match["score"],
            }
            for match in matches
        ],
    }
