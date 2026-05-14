import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseApiService, CategorySpendDto } from '../../services/expense-api.service';

@Component({
  selector: 'app-expense-totals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="totals-container" *ngIf="userId() !== null; else noUser">
      <h4>Expenses by Category</h4>
      <table *ngIf="totals().length > 0; else noData">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of totals()">
            <td>{{ row.categoryName }}</td>
            <td>{{ row.total | number:'1.2-2' }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #noData><p>No expenses recorded.</p></ng-template>
      <p class="err" *ngIf="error()">{{ error() }}</p>
    </div>
    <ng-template #noUser><p>Please login to see expenses.</p></ng-template>
  `,
  styles: [`
    .totals-container { max-width: 860px; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
    table { width: 100%; border-collapse: collapse; margin-top: .5rem; }
    th, td { border: 1px solid #d1d5db; padding: .5rem; text-align: left; }
    th { background: #f3f4f6; }
    .err { color: #b91c1c; margin-top: .5rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseTotalsComponent {
  private readonly api = inject(ExpenseApiService);
  private readonly destroyRef = inject(DestroyRef);

  userId = input<number | null>(null);

  totals = signal<CategorySpendDto[]>([]);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id) return;
      this.loadTotals(id);
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'expense-updated') {
        const id = this.userId();
        if (id) this.loadTotals(id);
      }
    });
  }

  private loadTotals(userId: number) {
    this.error.set(null);
    const sub = this.api.getExpenseTotalsByCategory(userId).subscribe({
      next: (rows) => this.totals.set(rows),
      error: () => {
        this.error.set('Failed to load totals');
        this.totals.set([]);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
