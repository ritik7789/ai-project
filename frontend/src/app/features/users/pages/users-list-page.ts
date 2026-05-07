import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { User } from '../../../models/user.model';
import { UsersApiService } from '../../../services/users-api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingStateComponent, ErrorStateComponent, EmptyStateComponent],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss'
})
export class UsersListPageComponent implements OnInit {
  private readonly usersApi = inject(UsersApiService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usersApi.list().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.error.set('Could not load users.'),
      complete: () => this.loading.set(false)
    });
  }

  deleteUser(id: number): void {
    this.usersApi.delete(id).subscribe({
      next: () => this.users.update((items) => items.filter((item) => item.id !== id))
    });
  }
}
