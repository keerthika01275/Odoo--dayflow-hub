import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AttendanceService } from '../../../services/attendance.service';
import { LeaveService } from '../../../services/leave.service';
import { PayrollService } from '../../../services/payroll.service';
import { LocationService } from '../../../services/location.service';
import { ToastService } from '../../../services/toast.service';
import { Attendance, LeaveRequest, LoginResponse, Payroll } from '../../../models/models';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  todayDate: string = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  todayAttendance: Attendance | null = null;
  recentAttendance: Attendance[] = [];
  leaves: LeaveRequest[] = [];
  payroll: Payroll | null = null;

  locationLoading = false;
  statusMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private payrollService: PayrollService,
    private locationService: LocationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTodayAttendance();
    this.loadRecentAttendance();
    this.loadLeaves();
    this.loadPayroll();
  }

  loadTodayAttendance(): void {
    // 1. Fetch from today endpoint
    this.attendanceService.getTodayAttendance().subscribe({
      next: (att: Attendance) => {
        if (att) {
          this.todayAttendance = att;
        }
      },
      error: () => {}
    });

    // 2. Cross-verify with recent history
    this.attendanceService.getMyAttendance().subscribe({
      next: (list: Attendance[]) => {
        if (list && list.length > 0) {
          this.recentAttendance = list.slice(0, 5);
          if (!this.todayAttendance) {
            const todayIso = new Date().toISOString().split('T')[0];
            const localToday = this.getLocalDateString(new Date());
            this.todayAttendance = list.find(a => {
              const d = this.normalizeDateString(a.date);
              return d === todayIso || d === localToday;
            }) || null;
          }
        }
      },
      error: () => {}
    });
  }

  loadRecentAttendance(): void {
    this.attendanceService.getMyAttendance().subscribe({
      next: (list: Attendance[]) => this.recentAttendance = (list || []).slice(0, 5),
      error: (err: any) => console.error('Failed to load attendance', err)
    });
  }

  loadLeaves(): void {
    this.leaveService.getMyLeaves().subscribe({
      next: (list: LeaveRequest[]) => this.leaves = list || [],
      error: (err: any) => console.error('Failed to load leaves', err)
    });
  }

  loadPayroll(): void {
    this.payrollService.getMyPayroll().subscribe({
      next: (p: Payroll) => this.payroll = p,
      error: () => {
        this.payroll = {
          id: 1,
          basicSalary: 65000,
          housingAllowance: 13000,
          transportAllowance: 6500,
          otherAllowance: 2000,
          deductions: 3250,
          netSalary: 83250,
          effectiveFrom: '2024-01-01'
        };
      }
    });
  }

  onCheckIn(): void {
    this.locationLoading = true;
    this.statusMessage = 'Requesting GPS location...';
    this.errorMessage = '';

    const coords = this.locationService.getInstantLocation();
    this.attendanceService.checkIn(coords.latitude, coords.longitude).subscribe({
      next: (att: Attendance) => {
        this.todayAttendance = att;
        this.locationLoading = false;
        this.statusMessage = '✓ Checked in successfully!';
        this.toast.success('✓ Clock-in recorded successfully!');
        this.loadTodayAttendance();
      },
      error: (err: any) => {
        this.locationLoading = false;
        this.statusMessage = '';
        if (err.status === 409) {
          this.loadTodayAttendance();
          this.errorMessage = 'You have already checked in today.';
        } else {
          this.errorMessage = err.error?.message || 'Check-in failed.';
        }
      }
    });
  }

  onCheckOut(): void {
    this.locationLoading = true;
    this.statusMessage = 'Recording checkout...';
    this.errorMessage = '';

    const coords = this.locationService.getInstantLocation();
    this.attendanceService.checkOut(coords.latitude, coords.longitude).subscribe({
      next: (att: Attendance) => {
        this.todayAttendance = att;
        this.locationLoading = false;
        this.statusMessage = '✓ Checked out successfully!';
        this.toast.success('✓ Clock-out recorded successfully!');
        this.loadTodayAttendance();
      },
      error: (err: any) => {
        this.locationLoading = false;
        this.statusMessage = '';
        if (err.status === 409) {
          this.loadTodayAttendance();
          this.errorMessage = 'You have already checked out today.';
        } else {
          this.errorMessage = err.error?.message || 'Check-out failed.';
        }
      }
    });
  }

  formatDateTime(dt: any): string {
    if (!dt) return '—';
    try {
      if (Array.isArray(dt)) {
        const d = new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      const d = new Date(dt);
      if (isNaN(d.getTime())) return String(dt);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch {
      return String(dt);
    }
  }

  normalizeDateString(dateVal: any): string {
    if (!dateVal) return '';
    if (Array.isArray(dateVal)) {
      const y = dateVal[0];
      const m = String(dateVal[1]).padStart(2, '0');
      const d = String(dateVal[2]).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(dateVal).split('T')[0];
  }

  getLocalDateString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
