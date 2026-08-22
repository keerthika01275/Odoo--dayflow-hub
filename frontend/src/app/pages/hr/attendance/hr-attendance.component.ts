import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../../services/attendance.service';
import { Attendance } from '../../../models/models';

@Component({
  selector: 'app-hr-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-attendance.component.html',
  styleUrls: ['./hr-attendance.component.scss']
})
export class HrAttendanceComponent implements OnInit {
  attendanceList: Attendance[] = [];
  filteredList: Attendance[] = [];
  searchQuery = '';
  filterStatus = 'ALL';
  selectedDate = '';
  isExceptionsMode = false;

  constructor(
    private attendanceService: AttendanceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      this.isExceptionsMode = path.includes('exceptions');
      this.loadAttendance();
    });
  }

  loadAttendance(): void {
    if (this.isExceptionsMode) {
      this.attendanceService.getExceptions().subscribe({
        next: (list) => {
          this.attendanceList = list;
          this.applyFilter();
        }
      });
    } else {
      this.attendanceService.getAll().subscribe({
        next: (list) => {
          this.attendanceList = list;
          this.applyFilter();
        }
      });
    }
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredList = this.attendanceList.filter(a => {
      const matchSearch = !q ||
        a.employee?.firstName?.toLowerCase().includes(q) ||
        a.employee?.lastName?.toLowerCase().includes(q) ||
        a.employee?.employeeId?.toLowerCase().includes(q) ||
        a.employee?.department?.name?.toLowerCase().includes(q);

      const matchStatus = this.filterStatus === 'ALL' || a.status === this.filterStatus;
      const matchDate = !this.selectedDate || String(a.date).startsWith(this.selectedDate);

      return matchSearch && matchStatus && matchDate;
    });
  }

  get presentCount(): number {
    return this.attendanceList.filter(a => a.status === 'PRESENT').length;
  }

  get exceptionCount(): number {
    return this.attendanceList.filter(a => a.status === 'LOCATION_EXCEPTION').length;
  }

  formatTime(time: string | null): string {
    if (!time) return '—';
    try {
      return new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return String(time);
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PRESENT: 'badge--present',
      LOCATION_EXCEPTION: 'badge--exception',
      ABSENT: 'badge--absent',
      LATE: 'badge--late'
    };
    return map[status] || 'badge--present';
  }
}
