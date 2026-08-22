import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { ToastService } from '../../../services/toast.service';
import { LeaveRequest } from '../../../models/models';

@Component({
  selector: 'app-hr-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-leaves.component.html',
  styleUrls: ['./hr-leaves.component.scss']
})
export class HrLeavesComponent implements OnInit {
  allLeaves: LeaveRequest[] = [];
  activeTab: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
  reviewComment: Record<number, string> = {};
  isProcessing: Record<number, boolean> = {};

  get filteredLeaves(): LeaveRequest[] {
    return this.allLeaves.filter(l => l.status === this.activeTab);
  }

  get pendingCount(): number { return this.allLeaves.filter(l => l.status === 'PENDING').length; }
  get approvedCount(): number { return this.allLeaves.filter(l => l.status === 'APPROVED').length; }
  get rejectedCount(): number { return this.allLeaves.filter(l => l.status === 'REJECTED').length; }

  constructor(
    private leaveService: LeaveService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getAll().subscribe({
      next: (list: LeaveRequest[]) => {
        this.allLeaves = list.sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
      }
    });
  }

  getEmployeeName(leave: LeaveRequest): string {
    if (!leave.employee) return 'Employee';
    return `${leave.employee.firstName || ''} ${leave.employee.lastName || ''}`.trim();
  }

  approve(leave: LeaveRequest): void {
    if (!leave.id) return;
    this.isProcessing[leave.id] = true;
    const comment = this.reviewComment[leave.id] || 'Approved by HR';
    this.leaveService.approve(leave.id, comment).subscribe({
      next: () => {
        this.toast.success(`Leave approved for ${this.getEmployeeName(leave)}`);
        this.isProcessing[leave.id!] = false;
        this.loadLeaves();
      },
      error: () => { this.isProcessing[leave.id!] = false; }
    });
  }

  reject(leave: LeaveRequest): void {
    if (!leave.id) return;
    this.isProcessing[leave.id] = true;
    const comment = this.reviewComment[leave.id] || 'Rejected by HR';
    this.leaveService.reject(leave.id, comment).subscribe({
      next: () => {
        this.toast.warning(`Leave rejected for ${this.getEmployeeName(leave)}`);
        this.isProcessing[leave.id!] = false;
        this.loadLeaves();
      },
      error: () => { this.isProcessing[leave.id!] = false; }
    });
  }

  getLeaveDays(start: string, end: string): number {
    if (!start || !end) return 0;
    const s = new Date(start), e = new Date(end);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  getLeaveTypeClass(type: string): string {
    const map: Record<string, string> = {
      SICK: 'type--sick',
      CASUAL: 'type--casual',
      EARNED: 'type--earned',
      MATERNITY: 'type--maternity',
      PATERNITY: 'type--paternity'
    };
    return map[type] || 'type--casual';
  }
}
