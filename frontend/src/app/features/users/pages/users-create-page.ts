import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { UserCreate } from '../../../models/user.model';
import { UsersApiService } from '../../../services/users-api.service';

@Component({
  selector: 'app-users-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './users-create-page.html',
  styleUrl: './users-create-page.scss'
})
export class UsersCreatePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.maxLength(100)]],
    role: ['', [Validators.maxLength(100)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UserCreate = {
      full_name: value.full_name,
      email: value.email,
      department: value.department || null,
      role: value.role || null
    };

    this.usersApi.create(payload).subscribe({
      next: () => {
        this.notification.success('User created.');
        this.router.navigateByUrl('/users');
      }
    });
  }
}
