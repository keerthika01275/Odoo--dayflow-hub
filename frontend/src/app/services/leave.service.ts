import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly API = 'http://localhost:8080/api/leaves';

  constructor(private http: HttpClient) {}

  apply(request: { leaveType: string; startDate: string; endDate: string; reason: string }): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.API, request);
  }

  getMyLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.API}/me`);
  }

  getAll(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.API);
  }

  approve(id: number, comment: string): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.API}/${id}/approve`, { reviewComment: comment });
  }

  reject(id: number, comment: string): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.API}/${id}/reject`, { reviewComment: comment });
  }
}
