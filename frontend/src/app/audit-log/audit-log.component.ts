import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, ModalElements } from '../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

interface AuditModel {
  _id: string;
  userID: string;
  username: string;
  sessionID: string;
  actionType: 'Created' | 'Updated' | 'Deleted' | string;
  actionDesc: string;
  recordID: string;
  oldRecord: Record<string, any> | null;
  newRecord: Record<string, any> | null;
  createdAt: string;
  updatedAt: string; 
}

interface AuditIPRecord {
  recordID: string;
  ip: string;
  label: string;
}

interface AuditUser {
  userID: string;
  username: string;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule, MatSelectModule],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss'
})
export class AuditLogComponent implements OnInit {
  dataSource = new MatTableDataSource<AuditModel>([]);
  displayedColumns: string[] = ['username', 'sessionID', 'actionType', 'actionDesc', 'createdAt', 'updatedAt'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  userRole!: number;
  useScope: 'session' | 'user' = 'session';

  selectedRecordID: string | null = null;
  recordIDOptions: AuditIPRecord[] = [];
  selectedUserID: string | null = null;
  userOptions: AuditUser[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUser().subscribe({
      next: (user: any) => {
        console.log('current user:', user);
        this.userRole = user.userRole

        // If role is user
        if (this.userRole === 1) {
          this.useScope = 'session';
          this.displayedColumns = this.displayedColumns.slice(2);
        } else if (this.userRole === 2 || this.userRole === 3) {
          this.useScope = 'user';
        }

        if(this.userRole === 2 || this.userRole === 3) {
          this.api.getRecordIDs().subscribe({
            next: (res: any) => {
              this.recordIDOptions = res.records;
              console.log(this.recordIDOptions)
            },
            error: (err: any) => {
              console.error('failed to get recordIDs', err);
            }
          })

          this.api.getAuditUsers().subscribe({
            next: (res: any) => {
              this.userOptions = res.users;
            },
            error: err => {
              console.error('Failed to load users', err);
            }
          })
        }
        
        this.getLogs();
      },
      error: (err: any) => {
        console.error('failed to get current user', err);
      }
    });
  }

  getLogs(page: number = this.currentPage, limit: number = this.pageSize, recordID?: string, userID?: string): void {
    this.api.getLogs(page, limit, this.useScope, recordID, userID).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        console.log(this.dataSource.data)
        this.totalRecords = res.pagination.totalRecords;
      },
      error: (err) => {
        console.error('Unable to get data', err);
      }
    })
  }

  applyRecordIDFilter(): void {
    this.currentPage = 1;
    this.paginator.firstPage();
    this.getLogs(1, this.pageSize, this.selectedRecordID || undefined, this.selectedUserID || undefined);
  }

  applyUserFilter(): void {
    this.currentPage = 1;
    this.paginator.firstPage();
    this.getLogs(1, this.pageSize, this.selectedRecordID || undefined, this.selectedUserID || undefined);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getLogs(this.currentPage, this.pageSize, this.selectedRecordID || undefined, this.selectedUserID || undefined);
  }
}
