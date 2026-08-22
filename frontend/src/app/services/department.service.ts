import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly API = `${environment.apiBaseUrl}/api/departments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.API);
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.API}/${id}`);
  }

  create(department: any): Observable<Department> {
    return this.http.post<Department>(this.API, department);
  }

  update(id: number, department: any): Observable<Department> {
    return this.http.put<Department>(`${this.API}/${id}`, department);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
