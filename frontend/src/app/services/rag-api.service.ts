import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RagQueryRequest, RagQueryResponse } from '../models/rag.model';

@Injectable({ providedIn: 'root' })
export class RagApiService {
  private readonly http = inject(HttpClient);

  query(payload: RagQueryRequest): Observable<RagQueryResponse> {
    return this.http.post<RagQueryResponse>('/rag/query', payload);
  }
}
