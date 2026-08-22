import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly API = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  checkIn(latitude: number, longitude: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.API}/check-in`, { latitude, longitude });
  }

  checkOut(latitude: number, longitude: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.API}/check-out`, { latitude, longitude });
  }

  getMyAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.API}/me`);
  }

  getTodayAttendance(): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.API}/me/today`);
  }

  getMyAttendanceByDate(date: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.API}/me`, { params: new HttpParams().set('date', date) });
  }

  getMyAttendanceRange(from: string, to: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.API}/me`, {
      params: new HttpParams().set('from', from).set('to', to)
    });
  }

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.API);
  }

  getExceptions(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.API}/exceptions`);
  }

  getByEmployee(id: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.API}/employee/${id}`);
  }
}
