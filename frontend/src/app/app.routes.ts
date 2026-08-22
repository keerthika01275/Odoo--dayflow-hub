import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmployeeDashboardComponent } from './pages/employee/dashboard/employee-dashboard.component';
import { EmployeeAttendanceComponent } from './pages/employee/attendance/employee-attendance.component';
import { EmployeeLeaveComponent } from './pages/employee/leave/employee-leave.component';
import { EmployeePayrollComponent } from './pages/employee/payroll/employee-payroll.component';
import { HrDashboardComponent } from './pages/hr/dashboard/hr-dashboard.component';
import { HrLeavesComponent } from './pages/hr/leaves/hr-leaves.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminEmployeesComponent } from './pages/admin/employees/admin-employees.component';
import { AdminPayrollComponent } from './pages/admin/payroll/admin-payroll.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Employee routes
  {
    path: 'employee',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYEE', 'HR', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EmployeeDashboardComponent },
      { path: 'attendance', component: EmployeeAttendanceComponent },
      { path: 'leave', component: EmployeeLeaveComponent },
      { path: 'payroll', component: EmployeePayrollComponent }
    ]
  },

  // HR routes
  {
    path: 'hr',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['HR', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HrDashboardComponent },
      { path: 'leaves', component: HrLeavesComponent }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'employees', component: AdminEmployeesComponent },
      { path: 'payroll', component: AdminPayrollComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

