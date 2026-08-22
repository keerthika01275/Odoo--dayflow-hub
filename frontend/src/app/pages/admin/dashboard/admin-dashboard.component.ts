import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { DepartmentService } from '../../../services/department.service';
import { AttendanceService } from '../../../services/attendance.service';
import { Attendance, Department, Employee } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  presentTodayCount = 0;
  hrAccountCount = 1; // Priya Sharma

  systemLogs = [
    { time: 'Just now', action: 'System Startup', details: 'DAYFLOW Enterprise HRMS active & operational' },
    { time: '10 mins ago', action: 'Geofence Verified', details: 'Office GPS location set to (11.0168, 76.9558), 200m radius' },
    { time: '1 hour ago', action: 'Data Seeding', details: '6 Departments and 7 Employee records verified' }
  ];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (list: Employee[]) => this.employees = list
    });

    this.departmentService.getAll().subscribe({
      next: (list: Department[]) => this.departments = list
    });

    this.attendanceService.getAll().subscribe({
      next: (list: Attendance[]) => {
        const today = new Date().toISOString().split('T')[0];
        this.presentTodayCount = list.filter(a => a.date === today && a.status === 'PRESENT').length;
      }
    });
  }
}
