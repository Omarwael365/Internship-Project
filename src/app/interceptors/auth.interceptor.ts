import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip auth endpoints
  if (req.url.includes('/api/auth/login') || req.url.includes('/api/users/register')) {
    return next(req);
  }

  let token: string | null = null;
  try {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('jwt');
    }
  } catch {
    token = null;
  }

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};


