import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RagQueryResponse } from '../../models/rag.model';
import { RagApiService } from '../../services/rag-api.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-rag-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './rag-page.html',
  styleUrl: './rag-page.scss'
})
export class RagPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ragApi = inject(RagApiService);

  readonly loading = signal(false);
  readonly result = signal<RagQueryResponse | null>(null);

  readonly form = this.fb.nonNullable.group({
    question: ['', [Validators.required, Validators.minLength(4)]]
  });

  runQuery(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.result.set(null);

    this.ragApi.query(this.form.getRawValue()).subscribe({
      next: (response) => this.result.set(response),
      complete: () => this.loading.set(false)
    });
  }
}
