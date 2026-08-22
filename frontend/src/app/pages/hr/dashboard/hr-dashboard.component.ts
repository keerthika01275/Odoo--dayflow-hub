import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { AttendanceService } from '../../../services/attendance.service';
import { LeaveService } from '../../../services/leave.service';
import { Attendance, Employee, LeaveRequest } from '../../../models/models';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.scss']
})
export class HrDashboardComponent implements OnInit {
  employees: Employee[] = [];
  attendanceList: Attendance[] = [];
  leaveRequests: LeaveRequest[] = [];
  exceptions: Attendance[] = [];

  presentTodayCount = 0;
  onLeaveCount = 0;
  pendingLeavesCount = 0;

  actionMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (list: Employee[]) => this.employees = list
    });

    this.attendanceService.getAll().subscribe({
      next: (list: Attendance[]) => {
        this.attendanceList = list;
        const today = new Date().toISOString().split('T')[0];
        this.presentTodayCount = list.filter(a => a.date === today && a.status === 'PRESENT').length;
      }
    });

    this.attendanceService.getExceptions().subscribe({
      next: (list: Attendance[]) => this.exceptions = list
    });

    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getAll().subscribe({
      next: (list: LeaveRequest[]) => {
        this.leaveRequests = list;
        this.pendingLeavesCount = list.filter(l => l.status === 'PENDING').length;
      }
    });
  }

  approveLeave(id: number): void {
    this.leaveService.approve(id, 'Approved by HR').subscribe({
      next: () => {
        this.actionMessage = '✓ Leave request approved.';
        this.loadLeaves();
      }
    });
  }

  rejectLeave(id: number): void {
    this.leaveService.reject(id, 'Rejected by HR').subscribe({
      next: () => {
        this.actionMessage = '✓ Leave request rejected.';
        this.loadLeaves();
      }
    });
  }
}
