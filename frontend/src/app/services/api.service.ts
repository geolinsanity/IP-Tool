import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    const url = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.get<T>(url, { withCredentials: true });
  }

  post<T>(path: string, body: any): Observable<T> {
    const url = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.post<T>(url, body, { withCredentials: true });
  }

  put<T>(path: string, body: any): Observable<T> {
    const url = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.put<T>(url, body, { withCredentials: true });
  }

  delete<T>(path: string): Observable<T> {
    const url = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.delete<T>(url, { withCredentials: true });
  }

  //API
  login(credentials: { username: string; password: string }) { 
    return this.post('/user/login', credentials); 
  }

  logout() {
    return this.post('/user/logout', {});
  }

  getUser() {
    return this.get('user');
  }

  getAPIs(pageNumber: number, pageLimit: number) {
    return this.get(`list?page=${pageNumber}&limit=${pageLimit}`);
  }

  //CRUD
  addIP(newRecord: { ip: string; label: string; comment: string}) {
    return this.post('add', newRecord);
  }

  editIP(idRecord: string ,updatedRecord: { ip: string; label: string; comment: string}) {
    return this.put(`edit/${idRecord}`, updatedRecord);
  }

  deleteIP(idRecord: string) {
    return this.delete(`delete/${idRecord}`);
  }
  
}
