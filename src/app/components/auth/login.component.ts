import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="card">
        <h2>Welcome back</h2>
        <p class="subtitle">Sign in to continue</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="you@example.com" />
          <div class="error" *ngIf="form.controls.email.touched && form.controls.email.invalid">
            Valid email is required
          </div>

          <label>Password</label>
          <input type="password" formControlName="password" placeholder="••••••••" />
          <div class="error" *ngIf="form.controls.password.touched && form.controls.password.invalid">
            Password is required
          </div>

          <button type="submit" [disabled]="form.invalid || loading()">{{ loading() ? 'Signing in…' : 'Sign in' }}</button>
        </form>
        <p class="muted">No account? <a routerLink="/signup">Create one</a></p>
        <button class="link" type="button" (click)="logout()" *ngIf="auth.jwtToken()">Sign out</button>
        <p class="err" *ngIf="error()">{{ error() }}</p>
      </div>
    </div>
  `,
  styles: [
    `
    .auth-shell { display:flex; align-items:center; justify-content:center; min-height:70vh; padding:1rem; }
    .card { width:100%; max-width:420px; padding:1.25rem 1.25rem 1.5rem; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.06); background:#fff; }
    h2 { margin:0 0 .25rem; font-weight:600; }
    .subtitle { margin:0 0 1rem; color:#6b7280; }
    form { display:grid; gap:.5rem; }
    label { font-size:.85rem; color:#374151; }
    input { padding:.6rem .7rem; border:1px solid #d1d5db; border-radius:8px; outline:none; }
    input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.15); }
    button { margin-top:.5rem; padding:.65rem .9rem; background:#111827; color:#fff; border:none; border-radius:8px; cursor:pointer; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
    .muted { margin:.75rem 0 0; color:#6b7280; font-size:.9rem; }
    .error { color:#b91c1c; font-size:.8rem; }
    .err { color:#b91c1c; margin-top:.5rem; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set('Invalid email or password');
        console.error(e);
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}


