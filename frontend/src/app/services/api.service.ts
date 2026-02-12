import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChartData } from 'chart.js';

type AuditScope =
  | 'session'
  | 'user'
  | 'ip'
  | 'ip-lifetime';

interface AuditIPRecord {
  recordID: string;
  ip: string;
  label: string;
}

export interface UserModel {
  userID: string;
  userRole: 1 | 2 | 3;
  username: string;
}

export interface AuditSummary {
  totalActions: number;
  created: number;
  updated: number;
  deleted: number;
}

export interface DoughnutResponse {
  chartData: ChartData<'doughnut', number[], unknown>;
  totalRecords: number;
}

export interface RecentActions {
  username: string;
  actionType: string,
  actionDesc: string,
  createdAt: string
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    const url = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.get<T>(url, { params, withCredentials: true });
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

  register(credentials: { username: string, password: string }) {
    return this.post('/user/signup', credentials)
  }

  refreshToken() {
    return this.post('/auth/refresh', {});
  }

  checkTokenStatus() {
    return this.get('/auth/token-status');
  }

  getUser(): Observable<UserModel> {
    return this.get('user');
  }

  getAPIs(pageNumber: number, pageLimit: number) {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageLimit.toString());
    return this.get(`list`, params);
  }

  getLogs(pageNumber: number, pageLimit: number, scope?: AuditScope, recordID?: string, userID?: string) {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageLimit.toString());

      console.log(`scope:${scope}     recordID:${recordID}    userID:${userID}`)
    if (scope) {
      params = params.set('scope', scope);
    }

    if (recordID) {
      params = params.set('recordID', recordID);
    }

    if(userID) {
      params = params.set('userID', userID);
    }

    return this.get(`/audit/get-logs`, params);
  }

  getRecordIDs(): Observable<{ records: AuditIPRecord }> {
    return this.get('/audit/get/record-IDs');
  }

  getAuditUsers() {
    return this.get('/audit/get/users');
  }

  // Dashboard
  getActionCounts(): Observable<AuditSummary> {
    return this.get('/audit/get-action-count');
  }

  getActionOverTime(): Observable<ChartData<'bar'>> {
    return this.get('/audit/get-action-over-time');
  }

  getIPCounts(): Observable<DoughnutResponse> {
    return this.get('/audit/get-ip-count');
  }

  getRecentAction(): Observable<RecentActions[]> {
    return this.get('/audit/get-recent-actions');
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
