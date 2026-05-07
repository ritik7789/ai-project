import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserCreate, UserUpdate } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<User[]> {
    return this.http.get<User[]>('/users');
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`);
  }

  create(payload: UserCreate): Observable<User> {
    return this.http.post<User>('/users', payload);
  }

  update(id: number, payload: UserUpdate): Observable<User> {
    return this.http.put<User>(`/users/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}
