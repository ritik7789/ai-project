import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { ErpDocumentCreate } from '../../../models/erp-document.model';
import { ErpDocumentsApiService } from '../../../services/erp-documents-api.service';

@Component({
  selector: 'app-erp-documents-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './erp-documents-create-page.html',
  styleUrl: './erp-documents-create-page.scss'
})
export class ErpDocumentsCreatePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly erpApi = inject(ErpDocumentsApiService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly form = this.fb.nonNullable.group({
    source_name: ['', [Validators.required, Validators.maxLength(255)]],
    content: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ErpDocumentCreate = {
      source_name: value.source_name,
      content: value.content
    };

    this.erpApi.create(payload).subscribe({
      next: () => {
        this.notification.success('ERP document added.');
        this.router.navigateByUrl('/erp-documents');
      }
    });
  }
}
