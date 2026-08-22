import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/models';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  role: string | null = null;
  navItems: NavItem[] = [];
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.role = this.authService.getRole();
    this.setupNavigation();
  }

  setupNavigation(): void {
    switch (this.role) {
      case 'EMPLOYEE':
        this.navItems = [
          { label: 'My Day', icon: 'home', route: '/employee/dashboard' },
          { label: 'Attendance', icon: 'schedule', route: '/employee/attendance' },
          { label: 'Leave', icon: 'event_note', route: '/employee/leave' },
          { label: 'Payroll', icon: 'payments', route: '/employee/payroll' },
          { label: 'Profile', icon: 'person', route: '/employee/profile' }
        ];
        break;

      case 'HR':
        this.navItems = [
          { label: 'Overview', icon: 'dashboard', route: '/hr/dashboard' },
          { label: 'Employees', icon: 'groups', route: '/hr/employees' },
          { label: 'Attendance', icon: 'schedule', route: '/hr/attendance' },
          { label: 'Leave Requests', icon: 'event_available', route: '/hr/leaves' },
          { label: 'Exceptions', icon: 'warning', route: '/hr/exceptions' },
          { label: 'Payroll', icon: 'payments', route: '/hr/payroll' },
          { label: 'Reports', icon: 'analytics', route: '/hr/reports' }
        ];
        break;

      case 'ADMIN':
        this.navItems = [
          { label: 'Control Center', icon: 'admin_panel_settings', route: '/admin/dashboard' },
          { label: 'Workforce', icon: 'badge', route: '/admin/employees' },
          { label: 'Departments', icon: 'domain', route: '/admin/departments' },
          { label: 'HR Accounts', icon: 'manage_accounts', route: '/admin/hr-accounts' },
          { label: 'Attendance', icon: 'schedule', route: '/admin/attendance' },
          { label: 'Leave', icon: 'event_note', route: '/admin/leaves' },
          { label: 'Payroll', icon: 'payments', route: '/admin/payroll' },
          { label: 'Activity', icon: 'history', route: '/admin/activity' },
          { label: 'Settings', icon: 'settings', route: '/admin/settings' }
        ];
        break;

      default:
        this.navItems = [];
        break;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
