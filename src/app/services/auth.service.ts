import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  income: number;
  expenses?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';
  readonly jwtToken = signal<string | null>(this.getToken());
  readonly userId = signal<number | null>(this.parseUserId(this.getToken()));

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, body).pipe(
      tap((res) => this.setToken(res.token)),
    );
  }

  register(body: RegisterRequest) {
    const payload = { ...body, expenses: body.expenses ?? 0 };
    return this.http.post(`${this.baseUrl}/users/register`, payload);
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.jwtToken.set(null);
    this.userId.set(null);
  }

  private setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.jwtToken.set(token);
    this.userId.set(this.parseUserId(token));
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('jwt');
    } catch {
      return null;
    }
  }

  private parseUserId(token: string | null): number | null {
    try {
      if (!token) return null;
      const payload = JSON.parse(this.base64UrlDecode(token.split('.')[1] || ''));
      const sub = payload?.sub;
      const id = sub != null ? Number(sub) : null;
      return Number.isFinite(id as number) ? (id as number) : null;
    } catch {
      return null;
    }
  }

  private base64UrlDecode(str: string): string {
    const pad = (s: string) => s + '='.repeat((4 - (s.length % 4)) % 4);
    const base64 = pad(str.replace(/-/g, '+').replace(/_/g, '/'));
    if (typeof atob !== 'undefined') return atob(base64);
    return Buffer.from(base64, 'base64').toString('binary');
  }
}


