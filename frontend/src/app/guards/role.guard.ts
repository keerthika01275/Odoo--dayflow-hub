import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'] || [];
  const userRole = authService.getRole();

  if (userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  // Redirect to appropriate dashboard or login if unauthorized
  const target = authService.getDashboardRoute();
  router.navigate([target]);
  return false;
};
