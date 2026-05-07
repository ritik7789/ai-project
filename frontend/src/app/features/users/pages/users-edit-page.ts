import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { UsersApiService } from '../../../services/users-api.service';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-users-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingStateComponent, ErrorStateComponent],
  templateUrl: './users-edit-page.html',
  styleUrl: './users-edit-page.scss'
})
export class UsersEditPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly notification = inject(NotificationService);

  readonly userId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.maxLength(100)]],
    role: ['', [Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid user id.');
      return;
    }

    this.userId.set(id);
    this.loading.set(true);
    this.usersApi.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          full_name: user.full_name,
          email: user.email,
          department: user.department ?? '',
          role: user.role ?? ''
        });
      },
      error: () => this.error.set('Could not load user details.'),
      complete: () => this.loading.set(false)
    });
  }

  submit(): void {
    const id = this.userId();
    if (!id || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.usersApi
      .update(id, {
        full_name: value.full_name,
        email: value.email,
        department: value.department || null,
        role: value.role || null
      })
      .subscribe({
        next: () => {
          this.notification.success('User updated.');
          this.router.navigateByUrl('/users');
        }
      });
  }
}
