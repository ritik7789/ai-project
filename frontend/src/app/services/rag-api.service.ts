import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RagQueryRequest, RagQueryResponse, RawRagResponse } from '../models/rag.model';

@Injectable({ providedIn: 'root' })
export class RagApiService {
  private readonly http = inject(HttpClient);

  query(payload: RagQueryRequest): Observable<RagQueryResponse> {
    return this.http.post<RawRagResponse>('/rag/query', payload).pipe(
      map((response) => {
        const topSource = response.sources?.[0];
        const noMatch = !topSource && response.answer.includes('No matching ERP information');

        return {
          question: payload.question,
          answer: response.answer,
          matched_source_name: topSource?.source_name ?? null,
          matched_chunk: noMatch ? null : response.answer,
          score: topSource?.score ?? 0
        };
      })
    );
  }
}
