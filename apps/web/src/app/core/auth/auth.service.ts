import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';
import type { AuthResponse, AuthUser, BootstrapPayload, LoginPayload } from './auth.models';

const AUTH_TOKEN_KEY = 'acpanel.auth.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenState = signal<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));
  private readonly userState = signal<AuthUser | null>(null);
  private readonly initializedState = signal(false);

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenState() && !!this.userState());

  initialize() {
    const token = this.tokenState();

    if (!token) {
      this.initializedState.set(true);
      return of(null);
    }

    return this.http.get<{ user: AuthUser }>(`${API_BASE_URL}/auth/me`).pipe(
      tap(({ user }: { user: AuthUser }) => {
        this.userState.set(user);
        this.initializedState.set(true);
      }),
      map(({ user }: { user: AuthUser }) => user),
      catchError(() => {
        this.clearSession();
        this.initializedState.set(true);
        return of(null);
      })
    );
  }

  login(payload: LoginPayload) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response: AuthResponse) => this.setSession(response))
    );
  }

  bootstrapAdmin(payload: BootstrapPayload) {
    return this.http.post<{ user: AuthUser }>(`${API_BASE_URL}/auth/bootstrap`, payload);
  }

  logout() {
    this.clearSession();
  }

  getToken() {
    return this.tokenState();
  }

  private setSession(response: AuthResponse) {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    this.tokenState.set(response.token);
    this.userState.set(response.user);
    this.initializedState.set(true);
  }

  private clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
  }
}
