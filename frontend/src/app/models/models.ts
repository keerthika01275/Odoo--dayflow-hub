export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  employeeId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  employeeId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
  status?: string;
  employeeCount?: number;
}

export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  department?: DepartmentResponse;
  designation?: string;
  joiningDate?: string;
  salary?: number;
  profilePicture?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  status?: string;
  employeeCount?: number;
}

// Backend Attendance entity shape (returned directly as JSON)
export interface Attendance {
  id: number;
  employee: Employee;
  date: string;
  checkIn: string | null;        // LocalDateTime → serialized as array or string
  checkOut: string | null;
  checkInLatitude: number | null;
  checkInLongitude: number | null;
  checkOutLatitude: number | null;
  checkOutLongitude: number | null;
  status: string;
  remarks: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Backend LeaveRequest entity shape
export interface LeaveRequest {
  id: number;
  employee: Employee;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  reviewedBy: string | null;
  reviewComment: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Backend Payroll entity shape
export interface Payroll {
  id?: number;
  employee?: Employee;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  deductions: number;
  netSalary: number;
  effectiveFrom: string;
  updatedAt?: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors?: { [key: string]: string };
}

