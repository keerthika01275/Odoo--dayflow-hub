import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmployeeDashboardComponent } from './pages/employee/dashboard/employee-dashboard.component';
import { HrDashboardComponent } from './pages/hr/dashboard/hr-dashboard.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Role-Protected Layout Routes
  {
    path: 'employee',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYEE', 'HR', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EmployeeDashboardComponent }
    ]
  },
  {
    path: 'hr',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['HR', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HrDashboardComponent }
    ]
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
