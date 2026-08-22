import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly API = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API}/${id}`);
  }

  getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.API}/me`);
  }

  create(employee: any): Observable<Employee> {
    return this.http.post<Employee>(this.API, employee);
  }

  update(id: number, employee: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.API}/${id}`, employee);
  }

  updateMyProfile(employee: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.API}/me`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
