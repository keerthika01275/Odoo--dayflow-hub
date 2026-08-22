import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { ToastService } from '../../../services/toast.service';
import { LeaveRequest } from '../../../models/models';

@Component({
  selector: 'app-employee-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
  myLeaves: LeaveRequest[] = [];
  showApplyForm = false;
  isSubmitting = false;

  form = {
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: ''
  };

  leaveTypes = ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY'];

  // Standard Annual Quotas
  quotas: Record<string, number> = {
    CASUAL: 14,
    SICK: 12,
    EARNED: 20
  };

  get pendingCount(): number { return this.myLeaves.filter(l => l.status === 'PENDING').length; }
  get approvedCount(): number { return this.myLeaves.filter(l => l.status === 'APPROVED').length; }

  getUsedDays(type: string): number {
    return this.myLeaves
      .filter(l => l.leaveType === type && l.status === 'APPROVED')
      .reduce((sum, l) => sum + this.getLeaveDays(l.startDate, l.endDate), 0);
  }

  getRemainingDays(type: string): number {
    const total = this.quotas[type] || 10;
    return Math.max(0, total - this.getUsedDays(type));
  }

  constructor(
    private leaveService: LeaveService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMyLeaves();
  }

  loadMyLeaves(): void {
    this.leaveService.getMyLeaves().subscribe({
      next: (list: LeaveRequest[]) => {
        this.myLeaves = list.sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
      }
    });
  }

  openApplyForm(): void {
    this.form = { leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' };
    this.showApplyForm = true;
  }

  closeForm(): void {
    this.showApplyForm = false;
  }

  submitLeave(): void {
    if (!this.form.startDate || !this.form.endDate || !this.form.reason) {
      this.toast.warning('Please fill in all required fields.');
      return;
    }
    if (new Date(this.form.endDate) < new Date(this.form.startDate)) {
      this.toast.warning('End date cannot be before start date.');
      return;
    }
    this.isSubmitting = true;
    this.leaveService.apply(this.form).subscribe({
      next: () => {
        this.toast.success('Leave application submitted successfully!');
        this.isSubmitting = false;
        this.closeForm();
        this.loadMyLeaves();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to submit leave application.');
        this.isSubmitting = false;
      }
    });
  }

  getLeaveDays(start: string, end: string): number {
    if (!start || !end) return 0;
    const s = new Date(start), e = new Date(end);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'status--pending',
      APPROVED: 'status--approved',
      REJECTED: 'status--rejected'
    };
    return map[status] || 'status--pending';
  }
}
