import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

// Must match backend entity/DTO field names
export interface TransactionDto {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  txnDate: string;
  category: { categoryId: number; name: string } | null;
  user: { userId: number };
}

export interface CategorySpendDto {
  categoryName: string;
  total: number;
}

export interface CategoryDto {
  categoryId: number;
  name: string;
}

export interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  income: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  // Get user details
  getUser(userId: number): Observable<UserDto> {
    return this.http
      .get<{ user: UserDto }>(`${this.baseUrl}/transactions/user/${userId}/dashboard`)
      .pipe(map((res) => res.user));
  }

  // Get all transactions for a user
  getUserTransactions(userId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.baseUrl}/transactions/user/${userId}`);
  }

  // Create a new expense
  createExpense(userId: number, amount: number, categoryId: number | null, txnDate?: string) {
    const body = {
      amount,
      txnDate: txnDate ?? new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
      category: categoryId ? { categoryId } : null,
    };
    return this.http.post(`${this.baseUrl}/transactions/user/${userId}`, body, { responseType: 'json' });
  }

  // Calculate totals by category
  getExpenseTotalsByCategory(userId: number): Observable<CategorySpendDto[]> {
    return this.getUserTransactions(userId).pipe(
      map((txns) =>
        txns
          .filter((t) => t.type === 'EXPENSE')
          .reduce<Record<string, number>>((acc, t) => {
            const name = t.category?.name ?? 'Uncategorized';
            acc[name] = (acc[name] ?? 0) + (t.amount ?? 0);
            return acc;
          }, {})
      ),
      map((totalsMap) =>
        Object.entries(totalsMap).map(([categoryName, total]) => ({ categoryName, total }))
      )
    );
  }

  // Get all categories
  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.baseUrl}/categories`);
  }

  // Get remaining balance (income - all expenses)
  getRemaining(userId: number): Observable<number> {
    return this.getUser(userId).pipe(
      switchMap((user) =>
        this.getUserTransactions(userId).pipe(
          map((txns) => {
            const totalExpenses = txns
              .filter((t) => t.type === 'EXPENSE')
              .reduce((sum, t) => sum + (t.amount ?? 0), 0);
            return user.income - totalExpenses;
          })
        )
      )
    );
  }
}
