import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserPanelComponent } from '../components/user-panel/user-panel.component';
import { ExpenseEntryComponent } from '../components/expense-entry/expense-entry.component';
import { ExpenseTotalsComponent } from '../components/expense-totals/expense-totals.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UserPanelComponent, ExpenseEntryComponent, ExpenseTotalsComponent],
  template: `
    <div class="dash" *ngIf="userId() !== null; else redirectTemplate">
      <div class="left">
        <app-user-panel [userId]="userId()!" />
        <app-expense-entry [userId]="userId()!" />
      </div>
      <div class="right">
        <app-expense-totals [userId]="userId()!" />
      </div>
    </div>
    <ng-template #redirectTemplate><p>Redirecting to login…</p></ng-template>
  `,
  styles: [`
    .dash { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items:start; }
    .left, .right { min-height: 300px; display:grid; gap:1rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  userId = signal<number | null>(null);

  constructor() {
    const id = this.auth.userId();
    if (!id) {
      this.router.navigateByUrl('/login');
    } else {
      this.userId.set(id);
    }
  }
}
