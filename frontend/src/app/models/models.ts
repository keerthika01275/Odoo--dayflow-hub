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

export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: Department;
  designation: string;
  joiningDate: string;
  salary: number;
  profilePicture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface Attendance {
  id: number;
  employee: Employee;
  date: string;
  checkIn: string;
  checkOut: string;
  checkInLatitude: number;
  checkInLongitude: number;
  checkOutLatitude: number;
  checkOutLongitude: number;
  status: string;
  remarks: string;
}

export interface LeaveRequest {
  id: number;
  employee: Employee;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  reviewedBy: string;
  reviewComment: string;
  createdAt: string;
}

export interface Payroll {
  id: number;
  employee: Employee;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  deductions: number;
  netSalary: number;
  effectiveFrom: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors?: { [key: string]: string };
}
