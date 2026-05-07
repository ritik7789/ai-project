import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotificationService } from '../../core/services/notification.service';
import { ErpDocument, ErpDocumentCreate } from '../../models/erp-document.model';
import { ErpDocumentsApiService } from '../../services/erp-documents-api.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-erp-documents-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './erp-documents-page.html',
  styleUrl: './erp-documents-page.scss'
})
export class ErpDocumentsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly erpApi = inject(ErpDocumentsApiService);
  private readonly notification = inject(NotificationService);

  readonly documents = signal<ErpDocument[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    source_name: ['', [Validators.required, Validators.maxLength(255)]],
    content: ['', [Validators.required]]
  });

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

  createDocument(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: ErpDocumentCreate = {
      source_name: formValue.source_name,
      content: formValue.content
    };

    this.erpApi.create(payload).subscribe({
      next: (document) => {
        this.documents.update((items) => [...items, document]);
        this.form.reset();
        this.notification.success('ERP document added.');
      }
    });
  }

  deleteDocument(id: number): void {
    this.erpApi.delete(id).subscribe({
      next: () => {
        this.documents.update((items) => items.filter((item) => item.id !== id));
        this.notification.info('ERP document deleted.');
      }
    });
  }
}
