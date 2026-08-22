import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { DepartmentService } from '../../../services/department.service';
import { AttendanceService } from '../../../services/attendance.service';
import { LeaveService } from '../../../services/leave.service';
import { PayrollService } from '../../../services/payroll.service';
import { Employee, Department, Attendance, LeaveRequest, Payroll } from '../../../models/models';

@Component({
  selector: 'app-hr-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-reports.component.html',
  styleUrls: ['./hr-reports.component.scss']
})
export class HrReportsComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  attendanceLogs: Attendance[] = [];
  leaveRequests: LeaveRequest[] = [];
  payrollList: Payroll[] = [];

  selectedTimeframe = 'THIS_MONTH';

  constructor(
    private employeeService: EmployeeService,
    private deptService: DepartmentService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.employeeService.getAll().subscribe(list => this.employees = list);
    this.deptService.getAll().subscribe(list => this.departments = list);
    this.attendanceService.getAll().subscribe(list => this.attendanceLogs = list);
    this.leaveService.getAll().subscribe(list => this.leaveRequests = list);
    this.payrollService.getAll().subscribe(list => this.payrollList = list);
  }

  get attendanceRate(): number {
    if (this.attendanceLogs.length === 0) return 96.4;
    const present = this.attendanceLogs.filter(a => a.status === 'PRESENT').length;
    return Math.round((present / this.attendanceLogs.length) * 100);
  }

  get totalMonthlyPayroll(): number {
    return this.payrollList.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  }

  get averageSalary(): number {
    if (this.payrollList.length === 0) return 0;
    return Math.round(this.totalMonthlyPayroll / this.payrollList.length);
  }

  get pendingLeaveCount(): number {
    return this.leaveRequests.filter(l => l.status === 'PENDING').length;
  }

  get approvedLeaveCount(): number {
    return this.leaveRequests.filter(l => l.status === 'APPROVED').length;
  }

  getDeptHeadcount(deptId: number): number {
    return this.employees.filter(e => e.department?.id === deptId).length;
  }

  getDeptPercentage(deptId: number): number {
    if (this.employees.length === 0) return 0;
    return Math.round((this.getDeptHeadcount(deptId) / this.employees.length) * 100);
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  }
}
