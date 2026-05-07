export interface RagQueryRequest {
  question: string;
}

export interface RagSource {
  document_id: number;
  source_name: string;
  score: number;
}

export interface RawRagResponse {
  answer: string;
  sources: RagSource[];
}

export interface RagQueryResponse {
  question: string;
  answer: string;
  matched_source_name: string | null;
  matched_chunk: string | null;
  score: number;
}
