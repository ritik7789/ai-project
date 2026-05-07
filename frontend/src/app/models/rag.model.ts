export interface RagQueryRequest {
  question: string;
}

export interface RagQueryResponse {
  question: string;
  answer: string;
  matched_source_name: string | null;
  matched_chunk: string | null;
  score: number;
}
