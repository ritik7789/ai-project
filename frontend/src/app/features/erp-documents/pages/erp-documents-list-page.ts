import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ErpDocument } from '../../../models/erp-document.model';
import { ErpDocumentsApiService } from '../../../services/erp-documents-api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-erp-documents-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingStateComponent, ErrorStateComponent, EmptyStateComponent],
  templateUrl: './erp-documents-list-page.html',
  styleUrl: './erp-documents-list-page.scss'
})
export class ErpDocumentsListPageComponent implements OnInit {
  private readonly erpApi = inject(ErpDocumentsApiService);

  readonly documents = signal<ErpDocument[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.loading.set(true);
    this.error.set(null);
    this.erpApi.list().subscribe({
      next: (data) => this.documents.set(data),
      error: () => this.error.set('Failed to load ERP documents.'),
      complete: () => this.loading.set(false)
    });
  }

  deleteDocument(id: number): void {
    this.erpApi.delete(id).subscribe({
      next: () => this.documents.update((items) => items.filter((item) => item.id !== id))
    });
  }
}
