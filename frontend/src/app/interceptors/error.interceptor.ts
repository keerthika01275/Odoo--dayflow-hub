import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      if (error.error?.message) {
        message = error.error.message;
      } else if (error.message) {
        message = error.message;
      }

      switch (error.status) {
        case 0:
          message = 'Unable to reach the server. Please check your connection.';
          toast.error(message);
          break;
        case 400:
          if (error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).join(', ');
            message = `Validation error: ${validationErrors}`;
          }
          toast.warning(message);
          break;
        case 401:
          toast.error('Session expired. Please log in again.');
          auth.logout();
          break;
        case 403:
          toast.error('Access denied. You do not have permission for this action.');
          router.navigate(['/login']);
          break;
        case 404:
          toast.error(message || 'Resource not found.');
          break;
        case 409:
          toast.warning(message || 'Conflict: resource already exists.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(message);
      }

      return throwError(() => error);
    })
  );
};
