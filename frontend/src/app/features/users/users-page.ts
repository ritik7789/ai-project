import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotificationService } from '../../core/services/notification.service';
import { User, UserCreate } from '../../models/user.model';
import { UsersApiService } from '../../services/users-api.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly notification = inject(NotificationService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedUserId = signal<number | null>(null);
  readonly saving = signal(false);

  readonly selectedUser = computed(() =>
    this.users().find((u) => u.id === this.selectedUserId()) ?? null
  );

  readonly userForm = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.maxLength(100)]],
    role: ['', [Validators.maxLength(100)]]
  });
  readonly editForm = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.maxLength(100)]],
    role: ['', [Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersApi.list().subscribe({
      next: (data) => {
        this.users.set(data);
        if (data.length > 0 && !this.selectedUserId()) {
          this.selectedUserId.set(data[0].id);
        }
      },
      error: () => {
        this.error.set('Could not load users from backend.');
      },
      complete: () => this.loading.set(false)
    });
  }

  selectUser(id: number): void {
    this.selectedUserId.set(id);
    const user = this.users().find((item) => item.id === id);
    if (user) {
      this.editForm.patchValue({
        full_name: user.full_name,
        email: user.email,
        department: user.department ?? '',
        role: user.role ?? ''
      });
    }
  }

  createUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const formValue = this.userForm.getRawValue();
    const payload: UserCreate = {
      full_name: formValue.full_name,
      email: formValue.email,
      department: formValue.department || null,
      role: formValue.role || null
    };

    this.usersApi.create(payload).subscribe({
      next: (user) => {
        this.users.update((items) => [...items, user]);
        this.selectedUserId.set(user.id);
        this.userForm.reset();
        this.notification.success('User created successfully.');
      },
      complete: () => this.saving.set(false)
    });
  }

  updateSelectedUser(): void {
    const user = this.selectedUser();
    if (!user || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.editForm.getRawValue();
    const payload = {
      full_name: formValue.full_name,
      email: formValue.email,
      department: formValue.department || null,
      role: formValue.role || null
    };

    this.usersApi.update(user.id, payload).subscribe({
      next: (updated) => {
        this.users.update((items) =>
          items.map((item) => (item.id === updated.id ? updated : item))
        );
        this.selectUser(updated.id);
        this.notification.success('User updated successfully.');
      },
      complete: () => this.saving.set(false)
    });
  }

  deleteUser(id: number): void {
    this.usersApi.delete(id).subscribe({
      next: () => {
        this.users.update((items) => items.filter((item) => item.id !== id));
        if (this.selectedUserId() === id) {
          this.selectedUserId.set(this.users()[0]?.id ?? null);
        }
        this.notification.info('User deleted.');
      }
    });
  }
}
