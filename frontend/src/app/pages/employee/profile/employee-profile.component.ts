import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Employee } from '../../../models/models';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  profile: Employee | null = null;
  isLoading = true;
  isEditing = false;
  isSaving = false;

  form: any = {};

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.employeeService.getMyProfile().subscribe({
      next: (emp: Employee) => {
        this.profile = emp;
        this.initForm(emp);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  initForm(emp: Employee): void {
    this.form = {
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      phone: emp.phone || '',
      address: emp.address || ''
    };
  }

  startEdit(): void {
    if (this.profile) this.initForm(this.profile);
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    this.isSaving = true;
    this.employeeService.updateMyProfile(this.form).subscribe({
      next: (updated: Employee) => {
        this.profile = updated;
        this.isEditing = false;
        this.isSaving = false;
        this.toast.success('Profile updated successfully!');
      },
      error: () => { this.isSaving = false; }
    });
  }

  get initials(): string {
    return `${this.profile?.firstName?.charAt(0) || ''}${this.profile?.lastName?.charAt(0) || ''}`;
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
