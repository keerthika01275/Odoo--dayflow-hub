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
  currentLocation: { lat: number; lng: number } = { lat: 11.0168, lng: 76.9558 };
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
    const coords = this.locationService.getInstantLocation();
    this.currentLocation = { lat: coords.latitude, lng: coords.longitude };
    this.loadHistory();
  }

  useOfficeLocation(): void {
    const office = this.locationService.getOfficeCoordinates();
    this.currentLocation = { lat: office.latitude, lng: office.longitude };
    this.toast.info('Using Office GPS coordinates (11.0168, 76.9558).');
  }

  loadHistory(): void {
    this.isLoading = true;

    // 1. Fetch today's dedicated record from server
    this.attendanceService.getTodayAttendance().subscribe({
      next: (today: Attendance) => {
        if (today) {
          this.todayRecord = today;
        }
      },
      error: () => {}
    });

    // 2. Fetch full attendance history
    this.attendanceService.getMyAttendance().subscribe({
      next: (list: Attendance[]) => {
        this.attendanceHistory = list || [];
        const todayIso = new Date().toISOString().split('T')[0];
        const localToday = this.getLocalDateString(new Date());

        if (!this.todayRecord) {
          this.todayRecord = this.attendanceHistory.find(a => {
            const d = this.normalizeDateString(a.date);
            return d === todayIso || d === localToday;
          }) || null;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  checkIn(): void {
    if (!this.currentLocation) {
      const office = this.locationService.getOfficeCoordinates();
      this.currentLocation = { lat: office.latitude, lng: office.longitude };
    }
    this.isCheckingIn = true;
    this.attendanceService.checkIn(this.currentLocation.lat, this.currentLocation.lng).subscribe({
      next: (record: Attendance) => {
        this.todayRecord = record;
        this.toast.success(`✓ Checked in successfully. Have a productive day!`);
        this.isCheckingIn = false;
        this.loadHistory();
      },
      error: (err: any) => {
        this.isCheckingIn = false;
        if (err.status === 409) {
          this.loadHistory();
        }
      }
    });
  }

  checkOut(): void {
    if (!this.currentLocation) {
      const office = this.locationService.getOfficeCoordinates();
      this.currentLocation = { lat: office.latitude, lng: office.longitude };
    }
    this.isCheckingOut = true;
    this.attendanceService.checkOut(this.currentLocation.lat, this.currentLocation.lng).subscribe({
      next: (record: Attendance) => {
        this.todayRecord = record;
        this.toast.success(`✓ Checked out successfully. Great work today!`);
        this.isCheckingOut = false;
        this.loadHistory();
      },
      error: (err: any) => {
        this.isCheckingOut = false;
        if (err.status === 409) {
          this.loadHistory();
        }
      }
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
