import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Employee } from '../../../models/models';

@Component({
  selector: 'app-admin-hr-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-hr-accounts.component.html',
  styleUrls: ['./admin-hr-accounts.component.scss']
})
export class AdminHrAccountsComponent implements OnInit {
  employees: Employee[] = [];
  hrEmployees: Employee[] = [];
  searchQuery = '';
  showCreateModal = false;
  isSubmitting = false;

  newAccountForm = {
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (list) => {
        this.employees = list;
        // Identify HR members (either by department name containing HR or designation containing HR)
        this.hrEmployees = list.filter(e => {
          const dept = e.department?.name?.toLowerCase() || '';
          const desig = e.designation?.toLowerCase() || '';
          return dept.includes('human') || dept.includes('hr') || desig.includes('hr') || desig.includes('manager');
        });
      }
    });
  }

  get filteredHrList(): Employee[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.hrEmployees;
    return this.hrEmployees.filter(e =>
      e.firstName?.toLowerCase().includes(q) ||
      e.lastName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employeeId?.toLowerCase().includes(q)
    );
  }

  openCreateModal(): void {
    this.newAccountForm = {
      employeeId: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onEmployeeSelected(empId: string): void {
    const emp = this.employees.find(e => e.employeeId === empId);
    if (emp) {
      this.newAccountForm.email = emp.email;
    }
  }

  createHrAccount(): void {
    if (this.newAccountForm.password !== this.newAccountForm.confirmPassword) {
      this.toast.error('Passwords do not match');
      return;
    }
    if (this.newAccountForm.password.length < 6) {
      this.toast.warning('Password must be at least 6 characters');
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.newAccountForm).subscribe({
      next: () => {
        this.toast.success(`HR Account created successfully for ${this.newAccountForm.employeeId}`);
        this.isSubmitting = false;
        this.closeCreateModal();
        this.loadData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to create HR account.');
        this.isSubmitting = false;
      }
    });
  }
}
