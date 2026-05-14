import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="card">
        <h2>Create your account</h2>
        <p class="subtitle">Manage expenses smarter</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <label>Full name</label>
          <input type="text" formControlName="fullName" placeholder="Jane Doe" />

          <label>Email</label>
          <input type="email" formControlName="email" placeholder="you@example.com" />
          <div class="error" *ngIf="form.controls.email.touched && form.controls.email.invalid">
            Valid email is required
          </div>

          <label>Password</label>
          <input type="password" formControlName="password" placeholder="••••••••" />
          <div class="error" *ngIf="form.controls.password.touched && form.controls.password.invalid">
            Min 6 characters
          </div>

          <label>Monthly income</label>
          <input type="number" formControlName="income" placeholder="0" />

          <button type="submit" [disabled]="form.invalid || loading()">{{ loading() ? 'Creating…' : 'Create account' }}</button>
        </form>
        <p class="muted">Have an account? <a routerLink="/login">Sign in</a></p>
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
    input:focus { border-color:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.15); }
    button { margin-top:.5rem; padding:.65rem .9rem; background:#10b981; color:#fff; border:none; border-radius:8px; cursor:pointer; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
    .muted { margin:.75rem 0 0; color:#6b7280; font-size:.9rem; }
    .error { color:#b91c1c; font-size:.8rem; }
    .err { color:#b91c1c; margin-top:.5rem; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    income: [0, [Validators.required, Validators.min(1000)]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/login');
      },
      error: (e) => {
        this.loading.set(false);
        const msg = (e?.error && (typeof e.error === 'string' ? e.error : e.error?.message)) || e?.message || 'Could not create account';
        this.error.set(msg);
        console.error('Signup failed', e);
      },
    });
  }
}


