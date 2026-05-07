import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ErpDocument, ErpDocumentCreate } from '../models/erp-document.model';

@Injectable({ providedIn: 'root' })
export class ErpDocumentsApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<ErpDocument[]> {
    return this.http.get<ErpDocument[]>('/erp-documents');
  }

  create(payload: ErpDocumentCreate): Observable<ErpDocument> {
    return this.http.post<ErpDocument>('/erp-documents', payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/erp-documents/${id}`);
  }
}
