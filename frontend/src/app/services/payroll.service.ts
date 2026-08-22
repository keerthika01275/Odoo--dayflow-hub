import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payroll } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly API = `${environment.apiBaseUrl}/api/payroll`;

  constructor(private http: HttpClient) {}

  getMyPayroll(): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.API}/me`);
  }

  getAll(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(this.API);
  }

  getByEmployee(employeeId: string): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.API}/${employeeId}`);
  }

  update(employeeId: string, payroll: any): Observable<Payroll> {
    return this.http.put<Payroll>(`${this.API}/${employeeId}`, payroll);
  }
}
