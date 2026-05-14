import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ExpenseApiService } from '../../services/expense-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel" *ngIf="userId() !== null; else noUser">
      <div class="head">
        <h3>{{ name() }}</h3>
        <button class="signout" (click)="onSignOut()">Sign out</button>
      </div>
      <div class="rows">
        <div class="income-row"><span>Income</span><span>{{ income() | number:'1.2-2' }}</span></div>
        <div><span>Expenses</span><span>{{ totalExpenses() | number:'1.2-2' }}</span></div>
        <div class="rem"><span>Remaining</span><span>{{ remaining() | number:'1.2-2' }}</span></div>
      </div>
    </div>

    <ng-template #noUser>
      <p>Please login to see your panel.</p>
    </ng-template>
  `,
  styles: [`
    .panel { padding: .75rem; border: 1px solid #e5e7eb; border-radius: 12px; background:#fff; }
    .head { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
    .signout { padding:.35rem .6rem; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
    .rows { display:grid; gap:.25rem; }
    .rows > div { display:flex; justify-content:space-between; }
    .rem span:last-child { font-weight:600; color:#059669; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanelComponent {
  private readonly api = inject(ExpenseApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  userId = input<number | null>(null);

  name = signal('');
  income = signal(0);
  totalExpenses = signal(0);
  remaining = signal(0);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id) return;

      this.api.getUser(id).subscribe(u => {
        this.name.set(u.fullName || u.email || 'User');
        this.income.set(u.income ?? 0);
        this.remaining.set((u.income ?? 0) - this.totalExpenses());
      });

      this.api.getExpenseTotalsByCategory(id).subscribe(rows => {
        const sum = rows.reduce((acc, r) => acc + (r.total ?? 0), 0);
        this.totalExpenses.set(sum);
        this.remaining.set(this.income() - sum);
      });

      if (isPlatformBrowser(this.platformId)) {
        window.addEventListener('storage', (e) => {
          if (e.key === 'expense-updated') {
            this.api.getExpenseTotalsByCategory(id).subscribe(rows => {
              const sum = rows.reduce((acc, r) => acc + (r.total ?? 0), 0);
              this.totalExpenses.set(sum);
              this.remaining.set(this.income() - sum);
            });
          }
        });
      }
    });
  }

  onSignOut() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
