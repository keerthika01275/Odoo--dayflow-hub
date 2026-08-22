import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../../services/payroll.service';
import { ToastService } from '../../../services/toast.service';
import { Payroll } from '../../../models/models';

@Component({
  selector: 'app-admin-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-payroll.component.html',
  styleUrls: ['./admin-payroll.component.scss']
})
export class AdminPayrollComponent implements OnInit {
  payrollList: Payroll[] = [];
  searchQuery = '';
  showModal = false;
  selectedPayroll: Payroll | null = null;
  isSaving = false;

  form = {
    basicSalary: 0,
    housingAllowance: 0,
    transportAllowance: 0,
    otherAllowance: 0,
    deductions: 0
  };

  get filteredPayroll(): Payroll[] {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.payrollList;
    return this.payrollList.filter(p =>
      p.employee?.firstName?.toLowerCase().includes(q) ||
      p.employee?.lastName?.toLowerCase().includes(q) ||
      p.employee?.employeeId?.toLowerCase().includes(q)
    );
  }

  get totalPayroll(): number {
    return this.payrollList.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  }

  get previewNet(): number {
    return this.form.basicSalary + this.form.housingAllowance + this.form.transportAllowance + this.form.otherAllowance - this.form.deductions;
  }

  constructor(
    private payrollService: PayrollService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.payrollService.getAll().subscribe({
      next: (list: Payroll[]) => this.payrollList = list
    });
  }

  openEdit(payroll: Payroll): void {
    this.selectedPayroll = payroll;
    this.form = {
      basicSalary: Number(payroll.basicSalary) || 0,
      housingAllowance: Number(payroll.housingAllowance) || 0,
      transportAllowance: Number(payroll.transportAllowance) || 0,
      otherAllowance: Number(payroll.otherAllowance) || 0,
      deductions: Number(payroll.deductions) || 0
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPayroll = null;
  }

  savePayroll(): void {
    if (!this.selectedPayroll?.employee?.employeeId) return;
    this.isSaving = true;
    const empId = this.selectedPayroll.employee.employeeId;
    this.payrollService.update(empId, this.form).subscribe({
      next: (updated: Payroll) => {
        const name = `${this.selectedPayroll?.employee?.firstName} ${this.selectedPayroll?.employee?.lastName}`;
        this.toast.success(`Payroll updated for ${name}`);
        const idx = this.payrollList.findIndex(p => p.employee?.employeeId === empId);
        if (idx !== -1 && updated) {
          this.payrollList[idx] = { ...this.payrollList[idx], ...updated };
        }
        this.isSaving = false;
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to update payroll.');
        this.isSaving = false;
      }
    });
  }

  getTotalAllowances(p: Payroll): number {
    return Number(p.housingAllowance || 0) + Number(p.transportAllowance || 0) + Number(p.otherAllowance || 0);
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  }

  getEmployeeName(p: Payroll): string {
    return `${p.employee?.firstName || ''} ${p.employee?.lastName || ''}`.trim();
  }
}
