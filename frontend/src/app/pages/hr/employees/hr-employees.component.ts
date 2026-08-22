import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { DepartmentService } from '../../../services/department.service';
import { Employee, Department } from '../../../models/models';

@Component({
  selector: 'app-hr-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.scss']
})
export class HrEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  searchQuery = '';
  filterDept = '';
  selectedEmployee: Employee | null = null;
  showDetailModal = false;

  constructor(
    private employeeService: EmployeeService,
    private deptService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (list) => this.employees = list
    });
    this.deptService.getAll().subscribe({
      next: (list) => this.departments = list
    });
  }

  get filteredEmployees(): Employee[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.employees.filter(e => {
      const matchSearch = !q ||
        e.firstName?.toLowerCase().includes(q) ||
        e.lastName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.employeeId?.toLowerCase().includes(q) ||
        e.designation?.toLowerCase().includes(q);
      const matchDept = !this.filterDept || String(e.department?.id) === this.filterDept;
      return matchSearch && matchDept;
    });
  }

  viewDetails(emp: Employee): void {
    this.selectedEmployee = emp;
    this.showDetailModal = true;
  }

  closeDetails(): void {
    this.showDetailModal = false;
    this.selectedEmployee = null;
  }

  getInitials(emp: Employee): string {
    return `${emp.firstName?.charAt(0) || ''}${emp.lastName?.charAt(0) || ''}`;
  }
}
