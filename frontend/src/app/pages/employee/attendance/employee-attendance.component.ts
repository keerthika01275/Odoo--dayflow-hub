import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../services/attendance.service';
import { LocationService } from '../../../services/location.service';
import { ToastService } from '../../../services/toast.service';
import { Attendance } from '../../../models/models';

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
  attendanceHistory: Attendance[] = [];
  todayRecord: Attendance | null = null;
  isLoading = false;
  isCheckingIn = false;
  isCheckingOut = false;
  locationError = '';
  currentLocation: { lat: number; lng: number } | null = null;
  today = new Date();

  get checkedInToday(): boolean {
    return !!this.todayRecord?.checkIn;
  }

  get checkedOutToday(): boolean {
    return !!this.todayRecord?.checkOut;
  }

  get todayStatus(): string {
    if (!this.todayRecord) return 'NOT_MARKED';
    return this.todayRecord.status || 'PRESENT';
  }

  constructor(
    private attendanceService: AttendanceService,
    private locationService: LocationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
    this.detectLocation();
  }

  detectLocation(): void {
    this.locationService.getCurrentLocation().then(
      (coords) => {
        this.currentLocation = { lat: coords.latitude, lng: coords.longitude };
      },
      (_err) => {
        this.locationError = 'Location access denied. GPS check-in requires location permission.';
      }
    );
  }

  loadHistory(): void {
    this.isLoading = true;
    this.attendanceService.getMyAttendance().subscribe({
      next: (list: Attendance[]) => {
        this.attendanceHistory = list.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const today = new Date().toISOString().split('T')[0];
        this.todayRecord = list.find(a => {
          const d = typeof a.date === 'string' ? a.date : String(a.date);
          return d.startsWith(today);
        }) || null;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  checkIn(): void {
    if (!this.currentLocation) {
      this.toast.error('Location not available. Please allow location access.');
      return;
    }
    this.isCheckingIn = true;
    this.attendanceService.checkIn(this.currentLocation.lat, this.currentLocation.lng).subscribe({
      next: (record: Attendance) => {
        this.toast.success(`✓ Checked in successfully. Have a productive day!`);
        this.isCheckingIn = false;
        this.loadHistory();
      },
      error: () => { this.isCheckingIn = false; }
    });
  }

  checkOut(): void {
    if (!this.currentLocation) {
      this.toast.error('Location not available. Please allow location access.');
      return;
    }
    this.isCheckingOut = true;
    this.attendanceService.checkOut(this.currentLocation.lat, this.currentLocation.lng).subscribe({
      next: (record: Attendance) => {
        this.toast.success(`✓ Checked out successfully. Great work today!`);
        this.isCheckingOut = false;
        this.loadHistory();
      },
      error: () => { this.isCheckingOut = false; }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PRESENT: 'status--present',
      ABSENT: 'status--absent',
      LATE: 'status--late',
      HALF_DAY: 'status--half',
      ON_LEAVE: 'status--leave',
      LOCATION_EXCEPTION: 'status--violation'
    };
    return map[status] || 'status--absent';
  }

  formatDateTime(dt: string | null | undefined): string {
    if (!dt) return '—';
    try {
      return new Date(dt).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch { return String(dt); }
  }
}
