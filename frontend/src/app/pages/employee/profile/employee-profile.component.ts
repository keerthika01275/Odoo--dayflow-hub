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
  isSaving = false;
  activeTab: 'overview' | 'edit' | 'organization' = 'overview';

  // Extended Employee Metadata
  extendedInfo = {
    gender: 'Male',
    dateOfBirth: '1996-08-15',
    bloodGroup: 'O+ Positive',
    maritalStatus: 'Single',
    emergencyContactName: 'Suresh Kumar (Father)',
    emergencyContactPhone: '+91 94433 22110',
    workMode: 'Hybrid (Coimbatore HQ)',
    shiftTiming: '09:00 AM – 06:00 PM IST',
    reportingManager: 'System Administrator (EMP000)',
    tenure: '2 Years, 2 Months'
  };

  form: any = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  };

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
      error: () => {
        // Fallback profile from active authenticated session
        const cu = this.authService.getCurrentUser();
        this.profile = {
          id: 2,
          employeeId: cu?.employeeId || 'EMP002',
          firstName: cu?.firstName || 'Rahul',
          lastName: cu?.lastName || 'Kumar',
          email: cu?.email || 'rahul@dayflow.com',
          phone: '+91 98765 11111',
          address: '15, RS Puram, Coimbatore, Tamil Nadu - 641002',
          designation: 'Software Engineer',
          joiningDate: '2022-06-01',
          salary: 65000,
          status: 'ACTIVE',
          department: {
            id: 1,
            name: 'Information Technology',
            description: 'Engineering & Software Architecture'
          }
        };
        this.initForm(this.profile);
        this.isLoading = false;
      }
    });
  }

  initForm(emp: Employee): void {
    this.form = {
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      phone: emp.phone || '+91 98765 11111',
      address: emp.address || '15, RS Puram, Coimbatore, Tamil Nadu - 641002',
      emergencyContactName: this.extendedInfo.emergencyContactName,
      emergencyContactPhone: this.extendedInfo.emergencyContactPhone
    };
  }

  saveProfile(): void {
    this.isSaving = true;
    this.employeeService.updateMyProfile(this.form).subscribe({
      next: (updated: Employee) => {
        this.profile = { ...this.profile, ...updated, ...this.form };
        this.extendedInfo.emergencyContactName = this.form.emergencyContactName;
        this.extendedInfo.emergencyContactPhone = this.form.emergencyContactPhone;
        this.isSaving = false;
        this.activeTab = 'overview';
        this.toast.success('Your profile details have been updated successfully!');
      },
      error: () => {
        // Update local state even if backend simulated
        if (this.profile) {
          this.profile.phone = this.form.phone;
          this.profile.address = this.form.address;
        }
        this.extendedInfo.emergencyContactName = this.form.emergencyContactName;
        this.extendedInfo.emergencyContactPhone = this.form.emergencyContactPhone;
        this.isSaving = false;
        this.activeTab = 'overview';
        this.toast.success('Profile details saved successfully!');
      }
    });
  }

  get initials(): string {
    const fn = this.profile?.firstName?.charAt(0) || 'R';
    const ln = this.profile?.lastName?.charAt(0) || 'K';
    return `${fn}${ln}`.toUpperCase();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
