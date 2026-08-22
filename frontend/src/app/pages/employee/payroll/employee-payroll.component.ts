import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from '../../../services/payroll.service';
import { Payroll } from '../../../models/models';

@Component({
  selector: 'app-employee-payroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.scss']
})
export class EmployeePayrollComponent implements OnInit {
  payroll: Payroll | null = null;
  isLoading = true;

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.payrollService.getMyPayroll().subscribe({
      next: (data: Payroll) => {
        this.payroll = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get totalAllowances(): number {
    if (!this.payroll) return 0;
    return Number(this.payroll.housingAllowance || 0) +
           Number(this.payroll.transportAllowance || 0) +
           Number(this.payroll.otherAllowance || 0);
  }

  get basicPercent(): number {
    const basic = Number(this.payroll?.basicSalary || 0);
    const total = basic + this.totalAllowances;
    if (!total) return 0;
    return Math.round((basic / total) * 100);
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  }
}
