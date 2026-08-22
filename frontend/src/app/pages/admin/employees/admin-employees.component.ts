import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { DepartmentService } from '../../../services/department.service';
import { ToastService } from '../../../services/toast.service';
import { Employee, Department } from '../../../models/models';

@Component({
  selector: 'app-admin-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-employees.component.html',
  styleUrls: ['./admin-employees.component.scss']
})
export class AdminEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: Department[] = [];
  searchQuery = '';
  filterDept = '';

  showModal = false;
  isEditMode = false;
  selectedId: number | null = null;
  deleteConfirmId: number | null = null;

  form: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    departmentId: null,
    designation: '',
    employeeId: '',
    joiningDate: '',
    salary: null
  };

  constructor(
    private employeeService: EmployeeService,
    private deptService: DepartmentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (list: Employee[]) => {
        this.employees = list;
        this.applyFilter();
      }
    });

    this.deptService.getAll().subscribe({
      next: (list: Department[]) => this.departments = list
    });
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(e => {
      const matchSearch = !q ||
        e.firstName?.toLowerCase().includes(q) ||
        e.lastName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.employeeId?.toLowerCase().includes(q);
      const matchDept = !this.filterDept ||
        String(e.department?.id) === this.filterDept;
      return matchSearch && matchDept;
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedId = null;
    this.form = { firstName: '', lastName: '', email: '', phone: '', address: '', departmentId: null, designation: '', employeeId: '', joiningDate: '', salary: null };
    this.showModal = true;
  }

  openEditModal(emp: Employee): void {
    this.isEditMode = true;
    this.selectedId = emp.id || null;
    this.form = {
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      address: emp.address || '',
      departmentId: emp.department?.id || null,
      designation: emp.designation || '',
      employeeId: emp.employeeId || '',
      joiningDate: emp.joiningDate || '',
      salary: emp.salary || null
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.deleteConfirmId = null;
  }

  saveEmployee(): void {
    if (this.isEditMode && this.selectedId !== null) {
      this.employeeService.update(this.selectedId, this.form).subscribe({
        next: () => {
          this.toast.success(`Employee ${this.form.firstName} updated successfully.`);
          this.closeModal();
          this.loadData();
        }
      });
    } else {
      this.employeeService.create(this.form).subscribe({
        next: () => {
          this.toast.success(`Employee ${this.form.firstName} created successfully.`);
          this.closeModal();
          this.loadData();
        }
      });
    }
  }

  confirmDelete(id: number | undefined): void {
    if (id !== undefined) {
      this.deleteConfirmId = id;
    }
  }

  deleteEmployee(): void {
    if (this.deleteConfirmId === null) return;
    const idToDelete = this.deleteConfirmId;
    this.employeeService.delete(idToDelete).subscribe({
      next: () => {
        this.toast.success('Employee removed from the system.');
        this.employees = this.employees.filter(e => e.id !== idToDelete);
        this.applyFilter();
        this.deleteConfirmId = null;
        this.loadData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to remove employee.');
        this.deleteConfirmId = null;
      }
    });
  }

  exportToCsv(): void {
    if (this.employees.length === 0) {
      this.toast.info('No employee records available to export.');
      return;
    }

    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Status'];
    const rows = this.employees.map(e => [
      `"${e.employeeId || ''}"`,
      `"${e.firstName || ''}"`,
      `"${e.lastName || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.department?.name || ''}"`,
      `"${e.designation || ''}"`,
      `"${e.joiningDate || ''}"`,
      `"${e.status || 'ACTIVE'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DAYFLOW_Workforce_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Workforce roster exported to CSV successfully.');
  }

  getStatusClass(status: string | undefined): string {
    const s = status || 'ACTIVE';
    const map: Record<string, string> = { ACTIVE: 'badge--active', INACTIVE: 'badge--inactive', TERMINATED: 'badge--terminated' };
    return map[s] || 'badge--active';
  }
}
