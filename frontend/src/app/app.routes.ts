import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// Employee components
import { EmployeeDashboardComponent } from './pages/employee/dashboard/employee-dashboard.component';
import { EmployeeAttendanceComponent } from './pages/employee/attendance/employee-attendance.component';
import { EmployeeLeaveComponent } from './pages/employee/leave/employee-leave.component';
import { EmployeePayrollComponent } from './pages/employee/payroll/employee-payroll.component';
import { EmployeeProfileComponent } from './pages/employee/profile/employee-profile.component';

// HR components
import { HrDashboardComponent } from './pages/hr/dashboard/hr-dashboard.component';
import { HrEmployeesComponent } from './pages/hr/employees/hr-employees.component';
import { HrLeavesComponent } from './pages/hr/leaves/hr-leaves.component';
import { HrAttendanceComponent } from './pages/hr/attendance/hr-attendance.component';
import { HrReportsComponent } from './pages/hr/reports/hr-reports.component';

// Admin components
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminEmployeesComponent } from './pages/admin/employees/admin-employees.component';
import { AdminDepartmentsComponent } from './pages/admin/departments/admin-departments.component';
import { AdminHrAccountsComponent } from './pages/admin/hr-accounts/admin-hr-accounts.component';
import { AdminPayrollComponent } from './pages/admin/payroll/admin-payroll.component';
import { AdminActivityComponent } from './pages/admin/activity/admin-activity.component';
import { AdminSettingsComponent } from './pages/admin/settings/admin-settings.component';

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
      { path: 'payroll', component: EmployeePayrollComponent },
      { path: 'profile', component: EmployeeProfileComponent }
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
      { path: 'employees', component: HrEmployeesComponent },
      { path: 'attendance', component: HrAttendanceComponent },
      { path: 'leaves', component: HrLeavesComponent },
      { path: 'exceptions', component: HrAttendanceComponent },
      { path: 'payroll', component: AdminPayrollComponent },
      { path: 'reports', component: HrReportsComponent }
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
      { path: 'departments', component: AdminDepartmentsComponent },
      { path: 'hr-accounts', component: AdminHrAccountsComponent },
      { path: 'attendance', component: HrAttendanceComponent },
      { path: 'leaves', component: HrLeavesComponent },
      { path: 'payroll', component: AdminPayrollComponent },
      { path: 'activity', component: AdminActivityComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
