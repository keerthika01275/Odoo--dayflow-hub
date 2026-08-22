import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AttendanceService } from '../../../services/attendance.service';
import { LeaveService } from '../../../services/leave.service';
import { PayrollService } from '../../../services/payroll.service';
import { LocationService } from '../../../services/location.service';
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
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTodayAttendance();
    this.loadRecentAttendance();
    this.loadLeaves();
    this.loadPayroll();
  }

  loadTodayAttendance(): void {
    this.attendanceService.getMyAttendanceByDate(new Date().toISOString().split('T')[0]).subscribe({
      next: (att: Attendance) => this.todayAttendance = att,
      error: () => this.todayAttendance = null
    });
  }

  loadRecentAttendance(): void {
    this.attendanceService.getMyAttendance().subscribe({
      next: (list: Attendance[]) => this.recentAttendance = list.slice(0, 5),
      error: (err: any) => console.error('Failed to load attendance', err)
    });
  }

  loadLeaves(): void {
    this.leaveService.getMyLeaves().subscribe({
      next: (list: LeaveRequest[]) => this.leaves = list,
      error: (err: any) => console.error('Failed to load leaves', err)
    });
  }

  loadPayroll(): void {
    this.payrollService.getMyPayroll().subscribe({
      next: (p: Payroll) => this.payroll = p,
      error: (err: any) => console.error('Failed to load payroll', err)
    });
  }

  onCheckIn(): void {
    this.locationLoading = true;
    this.statusMessage = 'Requesting GPS location...';
    this.errorMessage = '';

    this.locationService.getCurrentLocation()
      .then(coords => {
        this.statusMessage = 'Validating office location...';
        this.attendanceService.checkIn(coords.latitude, coords.longitude).subscribe({
          next: (att: Attendance) => {
            this.todayAttendance = att;
            this.locationLoading = false;
            this.statusMessage = '✓ Checked in successfully!';
            this.loadRecentAttendance();
          },
          error: (err: any) => {
            this.locationLoading = false;
            this.statusMessage = '';
            this.errorMessage = err.error?.message || 'Check-in failed.';
          }
        });
      })
      .catch(err => {
        this.locationLoading = false;
        this.statusMessage = '';
        this.errorMessage = err.message || 'Could not retrieve GPS coordinates.';
      });
  }

  onCheckOut(): void {
    this.locationLoading = true;
    this.statusMessage = 'Requesting GPS location...';
    this.errorMessage = '';

    this.locationService.getCurrentLocation()
      .then(coords => {
        this.statusMessage = 'Recording checkout...';
        this.attendanceService.checkOut(coords.latitude, coords.longitude).subscribe({
          next: (att: Attendance) => {
            this.todayAttendance = att;
            this.locationLoading = false;
            this.statusMessage = '✓ Checked out successfully!';
            this.loadRecentAttendance();
          },
          error: (err: any) => {
            this.locationLoading = false;
            this.statusMessage = '';
            this.errorMessage = err.error?.message || 'Check-out failed.';
          }
        });
      })
      .catch(err => {
        this.locationLoading = false;
        this.statusMessage = '';
        this.errorMessage = err.message || 'Could not retrieve GPS coordinates.';
      });
  }
}
