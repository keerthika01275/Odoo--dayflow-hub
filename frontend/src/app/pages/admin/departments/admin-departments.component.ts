import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { EmployeeService } from '../../../services/employee.service';
import { ToastService } from '../../../services/toast.service';
import { Department, Employee } from '../../../models/models';

@Component({
  selector: 'app-admin-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-departments.component.html',
  styleUrls: ['./admin-departments.component.scss']
})
export class AdminDepartmentsComponent implements OnInit {
  departments: Department[] = [];
  employees: Employee[] = [];
  searchQuery = '';

  showModal = false;
  isEditMode = false;
  selectedId: number | null = null;
  deleteConfirmId: number | null = null;
  isSaving = false;

  form = {
    name: '',
    description: '',
    status: 'ACTIVE'
  };

  constructor(
    private deptService: DepartmentService,
    private employeeService: EmployeeService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.deptService.getAll().subscribe({
      next: (depts) => {
        this.departments = depts;
      }
    });

    this.employeeService.getAll().subscribe({
      next: (emps) => {
        this.employees = emps;
      }
    });
  }

  get filteredDepartments(): Department[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.departments;
    return this.departments.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  }

  getEmployeeCountForDept(deptId: number): number {
    return this.employees.filter(e => e.department?.id === deptId).length;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedId = null;
    this.form = { name: '', description: '', status: 'ACTIVE' };
    this.showModal = true;
  }

  openEditModal(dept: Department): void {
    this.isEditMode = true;
    this.selectedId = dept.id;
    this.form = {
      name: dept.name,
      description: dept.description || '',
      status: dept.status || 'ACTIVE'
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.deleteConfirmId = null;
  }

  saveDepartment(): void {
    if (!this.form.name.trim()) {
      this.toast.warning('Department name is required');
      return;
    }

    this.isSaving = true;
    if (this.isEditMode && this.selectedId !== null) {
      this.deptService.update(this.selectedId, this.form).subscribe({
        next: () => {
          this.toast.success(`Department "${this.form.name}" updated successfully.`);
          this.isSaving = false;
          this.closeModal();
          this.loadData();
        },
        error: () => { this.isSaving = false; }
      });
    } else {
      this.deptService.create(this.form).subscribe({
        next: () => {
          this.toast.success(`Department "${this.form.name}" created successfully.`);
          this.isSaving = false;
          this.closeModal();
          this.loadData();
        },
        error: () => { this.isSaving = false; }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  deleteDepartment(): void {
    if (this.deleteConfirmId === null) return;
    const idToDelete = this.deleteConfirmId;
    this.deptService.delete(idToDelete).subscribe({
      next: () => {
        this.toast.success('Department deleted successfully.');
        this.departments = this.departments.filter(d => d.id !== idToDelete);
        this.deleteConfirmId = null;
        this.loadData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to delete department.');
        this.deleteConfirmId = null;
      }
    });
  }
}
