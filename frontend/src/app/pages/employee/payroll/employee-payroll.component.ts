import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../../services/payroll.service';
import { Payroll } from '../../../models/models';

export interface PayslipRecord {
  month: string;
  year: number;
  gross: number;
  deductions: number;
  net: number;
  status: 'DISBURSED' | 'PROCESSING';
  paymentDate: string;
}

@Component({
  selector: 'app-employee-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.scss']
})
export class EmployeePayrollComponent implements OnInit {
  payroll: Payroll | null = null;
  isLoading = true;
  isAnnual = false;
  activeTab: 'overview' | 'history' | 'tax' = 'overview';

  selectedPayslip: PayslipRecord | null = null;
  showPayslipModal = false;

  taxDetails = {
    panNumber: 'ABCDE1234F',
    uanNumber: '100987654321',
    pfAccountNumber: 'TN/CBE/0098765/000/1234',
    taxRegime: 'New Tax Regime (FY 2025-26)',
    bankName: 'HDFC Bank Ltd.',
    bankAccountMasked: '•••• •••• •••• 8921',
    ifscCode: 'HDFC0001234'
  };

  payslipHistory: PayslipRecord[] = [
    { month: 'August', year: 2026, gross: 86500, deductions: 3250, net: 83250, status: 'DISBURSED', paymentDate: '2026-08-31' },
    { month: 'July', year: 2026, gross: 86500, deductions: 3250, net: 83250, status: 'DISBURSED', paymentDate: '2026-07-31' },
    { month: 'June', year: 2026, gross: 86500, deductions: 3250, net: 83250, status: 'DISBURSED', paymentDate: '2026-06-30' },
    { month: 'May', year: 2026, gross: 86500, deductions: 3250, net: 83250, status: 'DISBURSED', paymentDate: '2026-05-31' },
    { month: 'April', year: 2026, gross: 86500, deductions: 3250, net: 83250, status: 'DISBURSED', paymentDate: '2026-04-30' },
    { month: 'March', year: 2026, gross: 86500, deductions: 3250, net: 83250, status: 'DISBURSED', paymentDate: '2026-03-31' }
  ];

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.payrollService.getMyPayroll().subscribe({
      next: (data: Payroll) => {
        this.payroll = data;
        this.isLoading = false;
      },
      error: () => {
        // Fallback default salary structure
        this.payroll = {
          id: 1,
          basicSalary: 65000,
          housingAllowance: 13000,
          transportAllowance: 6500,
          otherAllowance: 2000,
          deductions: 3250,
          netSalary: 83250,
          effectiveFrom: '2024-01-01',
          employee: {
            id: 2,
            employeeId: 'EMP002',
            firstName: 'Rahul',
            lastName: 'Kumar',
            designation: 'Software Engineer',
            email: 'rahul@dayflow.com',
            status: 'ACTIVE'
          }
        };
        this.isLoading = false;
      }
    });
  }

  get multiplier(): number {
    return this.isAnnual ? 12 : 1;
  }

  get basicSalaryVal(): number {
    return (Number(this.payroll?.basicSalary) || 65000) * this.multiplier;
  }

  get housingAllowanceVal(): number {
    return (Number(this.payroll?.housingAllowance) || 13000) * this.multiplier;
  }

  get transportAllowanceVal(): number {
    return (Number(this.payroll?.transportAllowance) || 6500) * this.multiplier;
  }

  get otherAllowanceVal(): number {
    return (Number(this.payroll?.otherAllowance) || 2000) * this.multiplier;
  }

  get totalAllowances(): number {
    return this.housingAllowanceVal + this.transportAllowanceVal + this.otherAllowanceVal;
  }

  get grossSalary(): number {
    return this.basicSalaryVal + this.totalAllowances;
  }

  get deductionsVal(): number {
    return (Number(this.payroll?.deductions) || 3250) * this.multiplier;
  }

  get netSalaryVal(): number {
    return this.grossSalary - this.deductionsVal;
  }

  get basicPercent(): number {
    if (!this.grossSalary) return 75;
    return Math.round((this.basicSalaryVal / this.grossSalary) * 100);
  }

  openPayslip(record?: PayslipRecord): void {
    this.selectedPayslip = record || this.payslipHistory[0];
    this.showPayslipModal = true;
  }

  closePayslip(): void {
    this.showPayslipModal = false;
    this.selectedPayslip = null;
  }

  printPayslip(): void {
    window.print();
  }

  formatCurrency(val: any): string {
    const num = typeof val === 'number' ? val : Number(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  }
}
